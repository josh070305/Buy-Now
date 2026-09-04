const connectDB = require('../config/db');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Variant = require('../models/Variant');
const EMIPlan = require('../models/EMIPlan');
const productController = require('../controllers/productController');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  await Product.deleteMany({});
  await Variant.deleteMany({});
  await EMIPlan.deleteMany({});
});

function createResMock() {
  const res = {};
  res.json = jest.fn((data) => { res._json = data; return res; });
  res.status = jest.fn(() => res);
  return res;
}

test('getAllProducts returns products with thumbnails', async () => {
  const prod = await Product.create({ name: 'T1', slug: 't1', brand: 'B', description: 'd', category: 'c' });
  await Variant.create({ productId: prod._id, label: 'v1', mrp: 100, price: 90, images: ['/assets/test.svg'], stock: 5 });

  const req = {};
  const res = createResMock();

  await productController.getAllProducts(req, res);

  expect(res.json).toHaveBeenCalled();
  expect(res._json.success).toBe(true);
  expect(Array.isArray(res._json.data)).toBe(true);
  expect(res._json.data.length).toBeGreaterThan(0);
  expect(res._json.data[0]).toHaveProperty('thumbnail');
});

test('getProductBySlug resolves by both slug and ObjectId', async () => {
  const prod = await Product.create({ name: 'Phone X', slug: 'phone-x', brand: 'Apple', description: 'desc', category: 'Smartphones' });
  const variant = await Variant.create({
    productId: prod._id,
    label: '256GB Gold',
    mrp: 1000,
    price: 900,
    images: ['/assets/test.svg'],
    stock: 5,
    colorName: 'Gold',
    colorHex: '#FFD700',
    storage: '256GB'
  });
  await EMIPlan.create({
    variantId: variant._id,
    monthlyAmount: 300,
    tenureMonths: 3,
    interestRate: 0,
    cashback: 100,
    isPopular: true
  });

  // Query by slug
  const reqSlug = { params: { slug: 'phone-x' } };
  const resSlug = createResMock();
  await productController.getProductBySlug(reqSlug, resSlug);

  expect(resSlug._json.success).toBe(true);
  expect(resSlug._json.data.name).toBe('Phone X');
  expect(resSlug._json.data.variants[0].emiPlans.length).toBe(1);

  // Query by ObjectId
  const reqId = { params: { slug: prod._id.toString() } };
  const resId = createResMock();
  await productController.getProductBySlug(reqId, resId);

  expect(resId._json.success).toBe(true);
  expect(resId._json.data.name).toBe('Phone X');
  expect(resId._json.data.variants[0].colorName).toBe('Gold');
});
