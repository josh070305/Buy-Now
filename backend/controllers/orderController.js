const Order = require('../models/Order');
const Product = require('../models/Product');
const Variant = require('../models/Variant');
const EMIPlan = require('../models/EMIPlan');

exports.createOrder = async (req, res) => {
  try {
    const { productId, variantId, emiPlanId, customerName, customerEmail, paymentMethod } = req.body;

    if (!productId || !variantId || !emiPlanId) {
      return res.status(400).json({ success: false, error: { message: 'Missing required fields' } });
    }

    const product = await Product.findById(productId);
    const variant = await Variant.findById(variantId);
    const plan = await EMIPlan.findById(emiPlanId);

    if (!product || !variant || !plan) {
      return res.status(404).json({ success: false, error: { message: 'Invalid product/variant/plan' } });
    }

    const txPrefix = (paymentMethod || '').toLowerCase().includes('stripe') ? 'STP_TXN_' : 'RZP_MND_';
    const transactionId = txPrefix + Math.random().toString(36).substring(2, 10).toUpperCase();

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
      paymentMethod: paymentMethod || 'Razorpay UPI AutoPay',
      transactionId,
      status: 'CONFIRMED'
    });

    const saved = await order.save();

    res.status(201).json({
      success: true,
      data: {
        orderId: saved._id,
        status: saved.status,
        paymentMethod: saved.paymentMethod,
        transactionId: saved.transactionId,
        amount: saved.amount,
        tenureMonths: saved.tenureMonths
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('productId').populate('variantId').populate('emiPlanId');
    }
    if (!order) {
      return res.status(404).json({ success: false, error: { message: 'Order not found' } });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
