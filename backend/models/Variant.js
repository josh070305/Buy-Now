const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  mrp: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    default: 0
  },
  colorName: {
    type: String,
    trim: true
  },
  colorHex: {
    type: String,
    trim: true
  },
  storage: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Variant', variantSchema);
