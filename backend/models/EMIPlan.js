const mongoose = require('mongoose');

const emiPlanSchema = new mongoose.Schema({
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant',
    required: true
  },
  monthlyAmount: {
    type: Number,
    required: true
  },
  tenureMonths: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  cashback: {
    type: Number,
    default: null
  },
  isPopular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EMIPlan', emiPlanSchema);
