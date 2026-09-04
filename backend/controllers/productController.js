const mongoose = require('mongoose');
const Product = require('../models/Product');
const Variant = require('../models/Variant');
const EMIPlan = require('../models/EMIPlan');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    const productsWithThumbnail = await Promise.all(
      products.map(async (product) => {
        // Find the variant with the lowest price for this product
        const variant = await Variant.findOne({ productId: product._id }).sort({ price: 1 });
        let thumbnail = '';
        let startingPrice = 0;
        if (variant && variant.images.length > 0) {
          thumbnail = variant.images[0];
          startingPrice = variant.price;
        } else {
          // If no variant, use picsum seeded placeholder based on product slug
          thumbnail = `https://picsum.photos/seed/${product.slug}/500/500`;
          startingPrice = 0;
        }

        return {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          description: product.description,
          category: product.category,
          thumbnail,
          startingPrice
        };
      })
    );

    res.json({ success: true, data: productsWithThumbnail });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'INTERNAL_SERVER_ERROR' } });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const identifier = req.params.slug || req.params.id;
    if (!identifier) {
      return res.status(400).json({ success: false, error: { message: 'Product identifier is required', code: 'BAD_REQUEST' } });
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(identifier) && /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };
    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({ success: false, error: { message: 'Product not found', code: 'NOT_FOUND' } });
    }

    const variants = await Variant.find({ productId: product._id });
    const variantsWithPlans = await Promise.all(
      variants.map(async (variant) => {
        const emiPlans = await EMIPlan.find({ variantId: variant._id });
        return {
          _id: variant._id,
          label: variant.label,
          mrp: variant.mrp,
          price: variant.price,
          images: variant.images,
          stock: variant.stock,
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          storage: variant.storage,
          emiPlans: emiPlans.map(plan => ({
            _id: plan._id,
            monthlyAmount: plan.monthlyAmount,
            tenureMonths: plan.tenureMonths,
            interestRate: plan.interestRate,
            cashback: plan.cashback,
            isPopular: plan.isPopular
          }))
        };
      })
    );

    const productData = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      description: product.description,
      category: product.category,
      variants: variantsWithPlans
    };

    res.json({ success: true, data: productData });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'INTERNAL_SERVER_ERROR' } });
  }
};

exports.getProductById = exports.getProductBySlug;
