const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant', required: true },
  emiPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'EMIPlan', required: true },
  amount: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  cashback: { type: Number },
  customerName: { type: String },
  customerEmail: { type: String },
  status: { type: String, default: 'PENDING' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
