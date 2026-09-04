const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Variant = require('../models/Variant');
const EMIPlan = require('../models/EMIPlan');

router.get('/counts', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const variantCount = await Variant.countDocuments();
    const emiCount = await EMIPlan.countDocuments();
    res.json({ success: true, data: { productCount, variantCount, emiCount } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Development-only: trigger seeding into the existing connection
router.post('/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, error: 'Not allowed in production' });
  }

  try {
    const seed = require('../seed');
    if (seed && seed.seedIntoExistingConnection) {
      await seed.seedIntoExistingConnection();
    } else if (typeof seed === 'function') {
      await seed();
    } else {
      throw new Error('No seed function available');
    }
    res.json({ success: true, message: 'Seeded into existing connection' });
  } catch (err) {
    console.error('Seed route error:', err);
    res.status(500).json({ success: false, error: err.message || err });
  }
});

module.exports = router;
