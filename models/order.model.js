const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Install this library for UUID generation

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  addressId: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);