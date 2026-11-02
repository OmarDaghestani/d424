import mongoose from 'mongoose';
import stripe from '../config/stripe.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';

export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure order belongs to the authenticated user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    // Create payment record
    await Payment.create({
      order: order._id,
      stripePaymentIntentId: paymentIntent.id,
      amount: order.totalPrice,
      status: 'pending',
      paymentMethod: 'card',
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment Intent Error:', error.message);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Webhook verified. Event type:', event.type);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        await handlePaymentSuccess(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        await handlePaymentFailure(failedPayment);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send('Webhook Error');
  }
};

async function handlePaymentSuccess(paymentIntent) {
  try {
    // Update payment record
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });
    if (payment) {
      payment.status = 'succeeded';
      await payment.save();

      // Update order
      const order = await Order.findById(payment.order);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: paymentIntent.id,
          status: 'succeeded',
          update_time: new Date().toISOString(),
          email_address: paymentIntent.receipt_email,
        };
        await order.save();
      }
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent) {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });
    if (payment) {
      payment.status = 'failed';
      await payment.save();
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
} 