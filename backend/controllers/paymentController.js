import mongoose from 'mongoose';
import { getStripe } from '../config/stripe.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';

const toCents = (amount) => Math.round(amount * 100);

const loadOwnOrder = async (req, res) => {
  const { orderId } = req.body;
  if (!mongoose.isValidObjectId(orderId)) {
    res.status(400).json({ message: 'Invalid order ID' });
    return null;
  }
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return null;
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: 'Not authorized' });
    return null;
  }
  return order;
};

// Marks an order paid exactly once, after checking the PaymentIntent really
// belongs to this order and covers its full total. Shared by the client
// confirmation call and the Stripe webhook.
const markOrderPaid = async (order, paymentIntent) => {
  if (order.isPaid) return order;

  if (
    paymentIntent.status !== 'succeeded' ||
    paymentIntent.metadata?.orderId !== order._id.toString() ||
    paymentIntent.amount_received < toCents(order.totalPrice)
  ) {
    return null;
  }

  // Atomic flip so concurrent confirm + webhook calls can't both run the stock update
  const updated = await Order.findOneAndUpdate(
    { _id: order._id, isPaid: false },
    {
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: paymentIntent.receipt_email || undefined,
      },
    },
    { new: true }
  );
  if (!updated) return Order.findById(order._id);

  await Payment.updateOne(
    { stripePaymentIntentId: paymentIntent.id },
    { status: 'succeeded' }
  );

  for (const item of updated.orderItems) {
    // Quantities come from the stored order, so the operator is safe to trust past sanitizeFilter
    const result = await Product.updateOne(
      { _id: item.product, stock: mongoose.trusted({ $gte: item.quantity }) },
      { $inc: { stock: -item.quantity } }
    );
    if (result.modifiedCount === 0) {
      console.error(`Stock underflow for product ${item.product} on order ${updated._id}`);
    }
  }

  return updated;
};

export const createPaymentIntent = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ message: 'Payments are not configured' });
  }

  try {
    const order = await loadOwnOrder(req, res);
    if (!order) return;
    if (order.isPaid) {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    const amount = toCents(order.totalPrice);

    // Reuse an open PaymentIntent for this order instead of creating duplicates
    const existing = await Payment.findOne({ order: order._id, status: 'pending' });
    if (existing) {
      const intent = await stripe.paymentIntents.retrieve(existing.stripePaymentIntentId);
      if (intent.amount === amount && !['canceled', 'succeeded'].includes(intent.status)) {
        return res.status(200).json({ clientSecret: intent.client_secret, amount });
      }
    }

    const intent = await stripe.paymentIntents.create(
      {
        amount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: order._id.toString(),
          userId: req.user._id.toString(),
        },
      },
      { idempotencyKey: `order-${order._id}-${amount}` }
    );

    await Payment.updateOne(
      { stripePaymentIntentId: intent.id },
      {
        order: order._id,
        stripePaymentIntentId: intent.id,
        amount: order.totalPrice,
        status: 'pending',
        paymentMethod: 'card',
      },
      { upsert: true }
    );

    res.status(200).json({ clientSecret: intent.client_secret, amount });
  } catch (error) {
    console.error('Payment Intent Error:', error.message);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

// Called by the checkout page after Stripe confirms the card. The server asks
// Stripe directly, so the browser can't mark an order paid on its own.
export const confirmPayment = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ message: 'Payments are not configured' });
  }

  try {
    const order = await loadOwnOrder(req, res);
    if (!order) return;
    if (order.isPaid) return res.status(200).json(order);

    const payment = await Payment.findOne({ order: order._id }).sort({ _id: -1 });
    if (!payment) {
      return res.status(400).json({ message: 'No payment started for this order' });
    }

    const intent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);
    const paid = await markOrderPaid(order, intent);
    if (!paid) {
      return res.status(402).json({ message: 'Payment has not completed', status: intent.status });
    }

    res.status(200).json(paid);
  } catch (error) {
    console.error('Confirm Payment Error:', error.message);
    res.status(500).json({ message: 'Error confirming payment' });
  }
};

export const handleWebhook = async (req, res) => {
  const stripe = getStripe();
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).send('Webhook not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send('Webhook Error');
  }

  try {
    const intent = event.data.object;
    if (event.type === 'payment_intent.succeeded') {
      const order = mongoose.isValidObjectId(intent.metadata?.orderId)
        ? await Order.findById(intent.metadata.orderId)
        : null;
      if (order) await markOrderPaid(order, intent);
    } else if (event.type === 'payment_intent.payment_failed') {
      await Payment.updateOne({ stripePaymentIntentId: intent.id }, { status: 'failed' });
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error.message);
    res.status(500).send('Webhook handling failed');
  }
};
