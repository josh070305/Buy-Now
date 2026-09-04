const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  getAllEMIPlans,
  createEMIPlan,
  updateEMIPlan,
  deleteEMIPlan
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// @route   GET /admin/products
// @desc    Get all products (admin view with variants and EMI plans)
// @access  Private/Admin
router.get('/products', getAllProducts);

// @route   POST /admin/products
// @desc    Create a new product
// @access  Private/Admin
router.post('/products', createProduct);

// @route   PUT /admin/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/products/:id', updateProduct);

// @route   DELETE /admin/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/products/:id', deleteProduct);

// @route   GET /admin/products/:id
// @desc    Get product by ID with full details
// @access  Private/Admin
router.get('/products/:id', getProductById);

// @route   GET /admin/variants
// @desc    Get all variants
// @access  Private/Admin
router.get('/variants', getAllVariants);

// @route   POST /admin/variants
// @desc    Create a new variant
// @access  Private/Admin
router.post('/variants', createVariant);

// @route   PUT /admin/variants/:id
// @desc    Update a variant
// @access  Private/Admin
router.put('/variants/:id', updateVariant);

// @route   DELETE /admin/variants/:id
// @desc    Delete a variant
// @access  Private/Admin
router.delete('/variants/:id', deleteVariant);

// @route   GET /admin/emi-plans
// @desc    Get all EMI plans
// @access  Private/Admin
router.get('/emi-plans', getAllEMIPlans);

// @route   POST /admin/emi-plans
// @desc    Create a new EMI plan
// @access  Private/Admin
router.post('/emi-plans', createEMIPlan);

// @route   PUT /admin/emi-plans/:id
// @desc    Update an EMI plan
// @access  Private/Admin
router.put('/emi-plans/:id', updateEMIPlan);

// @route   DELETE /admin/emi-plans/:id
// @desc    Delete an EMI plan
// @access  Private/Admin
router.delete('/emi-plans/:id', deleteEMIPlan);

module.exports = router;
