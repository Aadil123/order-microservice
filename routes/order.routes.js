const express = require('express');
const Order = require('../models/order.model');
const router = express.Router();

const { v4: uuidv4 } = require('uuid'); // Import UUID generator

// Create an order
router.post('/', async (req, res) => {
  const { productId, userId, addressId } = req.body;

  try {
    const newOrder = new Order({
      orderId: uuidv4(), // Generate a unique orderId
      productId,
      userId,
      addressId,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching order: ' + err.message });
    }
  });

module.exports = router;
