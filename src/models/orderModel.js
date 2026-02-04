const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" }, // ✅ match with Product model
      quantity: { type: Number, required: true },
      size: { type: String },
      price: { type: Number, required: true }
    }  
  ],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Date, default: Date.now }
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
      