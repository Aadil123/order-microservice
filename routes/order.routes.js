const express = require("express");
const axios = require("axios");
const Order = require("../models/order.model");
const router = express.Router();

const { v4: uuidv4 } = require("uuid"); // Import UUID generator

const getRequestHeaders = (req) => {
  const authorization = req.get("Authorization");
  const apiKey = req.get("X-API-KEY");

  const headers = {};

  if (authorization) {
    headers["Authorization"] = authorization;
  } else if (apiKey) {
    headers["X-API-KEY"] = apiKey;
  }

  return headers;
};

// Create an order
router.post("/", async (req, res) => {
  const { productId, userId, addressId } = req.body;

  try {
    const newOrder = new Order({
      orderId: uuidv4(), // Generate a unique orderId
      productId,
      userId,
      addressId,
    });

    const savedOrder = await newOrder.save();

    // Create Tracking

    const requestObject = {
      url: `http://localhost:5000/tracking`,
      method: "post",
      headers: getRequestHeaders(req),
      data: {
        orderId: savedOrder.orderId,
        status: "Order Placed",
        location: "Warehouse",
      },
    };

    const response = await axios(requestObject);

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific order by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findOne({orderId: id}).lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Error fetching order: " + err.message });
  }
});

//Get all orders of a specific user
// Get all orders of a particular user by userId
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId });
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error fetching orders: " + err.message });
  }
});

module.exports = router;
