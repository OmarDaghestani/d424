import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const SHIPPING_FIELDS = ['address', 'city', 'postalCode', 'country'];

// Create a new order. Names and prices always come from the database;
// any price or total sent by the client is ignored.
export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }
  if (
    !shippingAddress ||
    SHIPPING_FIELDS.some((field) => typeof shippingAddress[field] !== 'string')
  ) {
    return res.status(400).json({ message: 'Invalid shipping address' });
  }
  if (typeof paymentMethod !== 'string' || !paymentMethod.trim()) {
    return res.status(400).json({ message: 'Payment method is required' });
  }

  for (const item of orderItems) {
    if (!mongoose.isValidObjectId(item?.product)) {
      return res.status(400).json({ message: 'Invalid product in order' });
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity in order' });
    }
  }

  try {
    const productIds = orderItems.map((item) => item.product);
    // IDs were validated above; trusted() exempts this operator from sanitizeFilter
    const products = await Product.find({ _id: mongoose.trusted({ $in: productIds }) });
    const productsById = new Map(products.map((p) => [p._id.toString(), p]));

    const pricedItems = [];
    for (const item of orderItems) {
      const product = productsById.get(String(item.product));
      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }
      if (item.quantity > product.stock) {
        return res
          .status(400)
          .json({ message: `Only ${product.stock} of ${product.name} in stock` });
      }
      pricedItems.push({
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        product: product._id,
      });
    }

    const totalPrice =
      Math.round(
        pricedItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
      ) / 100;

    const order = new Order({
      user: req.user._id,
      orderItems: pricedItems,
      shippingAddress: Object.fromEntries(
        SHIPPING_FIELDS.map((field) => [field, shippingAddress[field]])
      ),
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create Order Error:', error.message);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Get logged-in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get My Orders Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get All Orders Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
};
