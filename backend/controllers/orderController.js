const Order = require('../models/Order');
const Product = require('../models/Product');
const Variant = require('../models/Variant');
const EMIPlan = require('../models/EMIPlan');

exports.createOrder = async (req, res) => {
  try {
    const { productId, variantId, emiPlanId, customerName, customerEmail } = req.body;

    if (!productId || !variantId || !emiPlanId) {
      return res.status(400).json({ success: false, error: { message: 'Missing required fields' } });
    }

    const product = await Product.findById(productId);
    const variant = await Variant.findById(variantId);
    const plan = await EMIPlan.findById(emiPlanId);

    if (!product || !variant || !plan) {
      return res.status(404).json({ success: false, error: { message: 'Invalid product/variant/plan' } });
    }

    const order = new Order({
      productId: product._id,
      variantId: variant._id,
      emiPlanId: plan._id,
      amount: plan.monthlyAmount,
      tenureMonths: plan.tenureMonths,
      interestRate: plan.interestRate,
      cashback: plan.cashback,
      customerName,
      customerEmail,
      status: 'CONFIRMED'
    });

    const saved = await order.save();

    res.status(201).json({ success: true, data: { orderId: saved._id, status: saved.status } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
