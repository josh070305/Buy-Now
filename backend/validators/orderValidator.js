const Joi = require('joi');

const orderSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  variantId: Joi.string().hex().length(24).required(),
  emiPlanId: Joi.string().hex().length(24).required(),
  customerName: Joi.string().max(100).allow('', null),
  customerEmail: Joi.string().email().allow('', null)
});

module.exports = (req, res, next) => {
  const { error } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, error: { message: error.details.map(d => d.message).join(', ') } });
  }
  return next();
};
