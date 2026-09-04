const Product = require('../models/Product');
const Variant = require('../models/Variant');
const EMIPlan = require('../models/EMIPlan');
const asyncHandler = require('express-async-handler');

// @desc    Get all products with full details (admin view)
// @route   GET /admin/products
// @access  Private/Admin
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Create a new product
// @route   POST /admin/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, slug, brand, description, category } = req.body;

  // Validation
  if (!name || !slug || !brand || !description || !category) {
    return res.status(400).json({
      success: false,
      error: { message: 'Please provide all required fields', code: 'VALIDATION_ERROR' }
    });
  }

  // Check if product already exists
  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    return res.status(400).json({
      success: false,
      error: { message: 'Product with this slug already exists', code: 'DUPLICATE_ERROR' }
    });
  }

  const product = await Product.create({
    name,
    slug,
    brand,
    description,
    category
  });

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update a product
// @route   PUT /admin/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: { message: 'Product not found', code: 'NOT_FOUND' }
    });
  }

  const { name, slug, brand, description, category } = req.body;
  
  product.name = name || product.name;
  product.slug = slug || product.slug;
  product.brand = brand || product.brand;
  product.description = description || product.description;
  product.category = category || product.category;

  const updatedProduct = await product.save();

  res.json({
    success: true,
    data: updatedProduct
  });
});

// @desc    Delete a product
// @route   DELETE /admin/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: { message: 'Product not found', code: 'NOT_FOUND' }
    });
  }

  await product.deleteOne();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Get product by ID with full details
// @route   GET /admin/products/:id
// @access  Private/Admin
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: { message: 'Product not found', code: 'NOT_FOUND' }
    });
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

  res.json({
    success: true,
    data: {
      ...product._doc,
      variants: variantsWithPlans
    }
  });
});

// @desc    Get all variants
// @route   GET /admin/variants
// @access  Private/Admin
exports.getAllVariants = asyncHandler(async (req, res) => {
  const variants = await Variant.find({}).populate('productId', 'name slug brand');
  
  res.json({
    success: true,
    count: variants.length,
    data: variants
  });
});

// @desc    Create a new variant
// @route   POST /admin/variants
// @access  Private/Admin
exports.createVariant = asyncHandler(async (req, res) => {
  const { productId, label, mrp, price, images, stock } = req.body;

  // Validation
  if (!productId || !label || !mrp || !price || !images) {
    return res.status(400).json({
      success: false,
      error: { message: 'Please provide all required fields', code: 'VALIDATION_ERROR' }
    });
  }

  // Check if product exists
  const productExists = await Product.findById(productId);
  if (!productExists) {
    return res.status(404).json({
      success: false,
      error: { message: 'Product not found', code: 'NOT_FOUND' }
    });
  }

  const variant = await Variant.create({
    productId,
    label,
    mrp,
    price,
    images: images.split(',').map(img => img.trim()).filter(img => img),
    stock: stock || 0
  });

  res.status(201).json({
    success: true,
    data: variant
  });
});

// @desc    Update a variant
// @route   PUT /admin/variants/:id
// @access  Private/Admin
exports.updateVariant = asyncHandler(async (req, res) => {
  const variant = await Variant.findById(req.params.id);

  if (!variant) {
    return res.status(404).json({
      success: false,
      error: { message: 'Variant not found', code: 'NOT_FOUND' }
    });
  }

  const { productId, label, mrp, price, images, stock } = req.body;
  
  variant.productId = productId || variant.productId;
  variant.label = label || variant.label;
  variant.mrp = mrp || variant.mrp;
  variant.price = price || variant.price;
  variant.images = images !== undefined ? (images.split(',').map(img => img.trim()).filter(img => img) || variant.images) : variant.images;
  variant.stock = stock !== undefined ? stock : variant.stock;

  const updatedVariant = await variant.save();

  res.json({
    success: true,
    data: updatedVariant
  });
});

// @desc    Delete a variant
// @route   DELETE /admin/variants/:id
// @access  Private/Admin
exports.deleteVariant = asyncHandler(async (req, res) => {
  const variant = await Variant.findById(req.params.id);

  if (!variant) {
    return res.status(404).json({
      success: false,
      error: { message: 'Variant not found', code: 'NOT_FOUND' }
    });
  }

  await variant.deleteOne();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Get all EMI plans
// @route   GET /admin/emi-plans
// @access  Private/Admin
exports.getAllEMIPlans = asyncHandler(async (req, res) => {
  const emiPlans = await EMIPlan.find({}).populate('variantId', 'label price');
  
  res.json({
    success: true,
    count: emiPlans.length,
    data: emiPlans
  });
});

// @desc    Create a new EMI plan
// @route   POST /admin/emi-plans
// @access  Private/Admin
exports.createEMIPlan = asyncHandler(async (req, res) => {
  const { variantId, monthlyAmount, tenureMonths, interestRate, cashback, isPopular } = req.body;

  // Validation
  if (!variantId || monthlyAmount === undefined || tenureMonths === undefined) {
    return res.status(400).json({
      success: false,
      error: { message: 'Please provide required fields (variantId, monthlyAmount, tenureMonths)', code: 'VALIDATION_ERROR' }
    });
  }

  // Check if variant exists
  const variantExists = await Variant.findById(variantId);
  if (!variantExists) {
    return res.status(404).json({
      success: false,
      error: { message: 'Variant not found', code: 'NOT_FOUND' }
    });
  }

  const emiPlan = await EMIPlan.create({
    variantId,
    monthlyAmount,
    tenureMonths,
    interestRate: interestRate || 0,
    cashback: cashback || 0,
    isPopular: isPopular || false
  });

  res.status(201).json({
    success: true,
    data: emiPlan
  });
});

// @desc    Update an EMI plan
// @route   PUT /admin/emi-plans/:id
// @access  Private/Admin
exports.updateEMIPlan = asyncHandler(async (req, res) => {
  const emiPlan = await EMIPlan.findById(req.params.id);

  if (!emiPlan) {
    return res.status(404).json({
      success: false,
      error: { message: 'EMI plan not found', code: 'NOT_FOUND' }
    });
  }

  const { variantId, monthlyAmount, tenureMonths, interestRate, cashback, isPopular } = req.body;
  
  emiPlan.variantId = variantId || emiPlan.variantId;
  emiPlan.monthlyAmount = monthlyAmount !== undefined ? monthlyAmount : emiPlan.monthlyAmount;
  emiPlan.tenureMonths = tenureMonths !== undefined ? tenureMonths : emiPlan.tenureMonths;
  emiPlan.interestRate = interestRate !== undefined ? interestRate : emiPlan.interestRate;
  emiPlan.cashback = cashback !== undefined ? cashback : emiPlan.cashback;
  emiPlan.isPopular = isPopular !== undefined ? isPopular : emiPlan.isPopular;

  const updatedEmiPlan = await emiPlan.save();

  res.json({
    success: true,
    data: updatedEmiPlan
  });
});

// @desc    Delete an EMI plan
// @route   DELETE /admin/emi-plans/:id
// @access  Private/Admin
exports.deleteEMIPlan = asyncHandler(async (req, res) => {
  const emiPlan = await EMIPlan.findById(req.params.id);

  if (!emiPlan) {
    return res.status(404).json({
      success: false,
      error: { message: 'EMI plan not found', code: 'NOT_FOUND' }
    });
  }

  await emiPlan.deleteOne();

  res.json({
    success: true,
    data: {}
  });
});
