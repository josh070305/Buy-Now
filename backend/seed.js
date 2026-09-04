require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Variant = require('./models/Variant');
const EMIPlan = require('./models/EMIPlan');

const seedData = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected for seeding');
    await seedIntoExistingConnection();
    await mongoose.disconnect();
    console.log('Data seeded successfully and connection closed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

const seedIntoExistingConnection = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Variant.deleteMany({});
    await EMIPlan.deleteMany({});
    console.log('Existing data cleared');

    // 1. Create Products (at least 3 products as specified in requirement 3)
    const productsData = [
      {
        name: 'iPhone 17 Pro',
        slug: 'apple-iphone-17-pro',
        brand: 'Apple',
        description: 'Forged in titanium with industry-leading A19 Pro chip, Pro camera system with 48MP Fusion lens, and revolutionary Apple Intelligence built right in.',
        category: 'Smartphones'
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        brand: 'Samsung',
        description: 'Epic titanium design meets pro-grade 200MP camera, built-in S Pen, and groundbreaking Galaxy AI search, translation, and photo editing.',
        category: 'Smartphones'
      },
      {
        name: 'Google Pixel 9 Pro',
        slug: 'google-pixel-9-pro',
        brand: 'Google',
        description: 'Engineered by Google with Tensor G4 processor, advanced triple-lens camera system with 30x Super Res Zoom, and Gemini AI on-device assistant.',
        category: 'Smartphones'
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`Created ${createdProducts.length} products`);

    // 2. Create Variants with 2+ variants per product (color, finish, and storage)
    const variantsData = [
      // --- iPhone 17 Pro Variants (matches reference image: Cosmic Orange first) ---
      {
        productId: createdProducts[0]._id,
        label: '256GB Cosmic Orange',
        storage: '256GB',
        colorName: 'Cosmic Orange',
        colorHex: '#D96B27',
        mrp: 134900,
        price: 127400,
        images: ['/assets/iphone-orange.jpg', '/assets/iphone-desert.jpg'],
        stock: 15
      },
      {
        productId: createdProducts[0]._id,
        label: '256GB Natural Titanium',
        storage: '256GB',
        colorName: 'Natural Titanium',
        colorHex: '#9A948C',
        mrp: 134900,
        price: 127400,
        images: ['/assets/iphone-natural.jpg', '/assets/iphone-natural.svg'],
        stock: 12
      },
      {
        productId: createdProducts[0]._id,
        label: '256GB Black Titanium',
        storage: '256GB',
        colorName: 'Black Titanium',
        colorHex: '#2C2B2A',
        mrp: 134900,
        price: 127400,
        images: ['/assets/iphone-black.jpg', '/assets/iphone-black.svg'],
        stock: 8
      },
      {
        productId: createdProducts[0]._id,
        label: '512GB Cosmic Orange',
        storage: '512GB',
        colorName: 'Cosmic Orange',
        colorHex: '#D96B27',
        mrp: 154900,
        price: 147400,
        images: ['/assets/iphone-orange.jpg', '/assets/iphone-desert.jpg'],
        stock: 6
      },
      {
        productId: createdProducts[0]._id,
        label: '512GB Natural Titanium',
        storage: '512GB',
        colorName: 'Natural Titanium',
        colorHex: '#9A948C',
        mrp: 154900,
        price: 147400,
        images: ['/assets/iphone-natural.jpg', '/assets/iphone-natural.svg'],
        stock: 6
      },
      {
        productId: createdProducts[0]._id,
        label: '512GB Black Titanium',
        storage: '512GB',
        colorName: 'Black Titanium',
        colorHex: '#2C2B2A',
        mrp: 154900,
        price: 147400,
        images: ['/assets/iphone-black.jpg', '/assets/iphone-black.svg'],
        stock: 7
      },

      // --- Samsung Galaxy S24 Ultra Variants ---
      {
        productId: createdProducts[1]._id,
        label: '256GB Titanium Gray',
        storage: '256GB',
        colorName: 'Titanium Gray',
        colorHex: '#787679',
        mrp: 134999,
        price: 124999,
        images: ['/assets/s24-gray.jpg', '/assets/s24-gray.svg'],
        stock: 14
      },
      {
        productId: createdProducts[1]._id,
        label: '256GB Titanium Violet',
        storage: '256GB',
        colorName: 'Titanium Violet',
        colorHex: '#463F54',
        mrp: 134999,
        price: 124999,
        images: ['/assets/s24-violet.svg', '/assets/s24-gray.jpg'],
        stock: 10
      },
      {
        productId: createdProducts[1]._id,
        label: '512GB Titanium Gray',
        storage: '512GB',
        colorName: 'Titanium Gray',
        colorHex: '#787679',
        mrp: 149999,
        price: 139999,
        images: ['/assets/s24-gray.jpg', '/assets/s24-gray.svg'],
        stock: 5
      },

      // --- Google Pixel 9 Pro Variants ---
      {
        productId: createdProducts[2]._id,
        label: '128GB Porcelain',
        storage: '128GB',
        colorName: 'Porcelain',
        colorHex: '#E8E4DF',
        mrp: 109999,
        price: 99999,
        images: ['/assets/pixel-porcelain.jpg', '/assets/pixel-porcelain.svg'],
        stock: 16
      },
      {
        productId: createdProducts[2]._id,
        label: '128GB Obsidian',
        storage: '128GB',
        colorName: 'Obsidian',
        colorHex: '#282A2E',
        mrp: 109999,
        price: 99999,
        images: ['/assets/pixel-obsidian.svg', '/assets/pixel-porcelain.jpg'],
        stock: 11
      },
      {
        productId: createdProducts[2]._id,
        label: '256GB Porcelain',
        storage: '256GB',
        colorName: 'Porcelain',
        colorHex: '#E8E4DF',
        mrp: 124999,
        price: 114999,
        images: ['/assets/pixel-porcelain.jpg', '/assets/pixel-porcelain.svg'],
        stock: 8
      }
    ];

    const createdVariants = await Variant.insertMany(variantsData);
    console.log(`Created ${createdVariants.length} variants`);

    // 3. Create EMI Plans matching the reference image from assignment
    // In reference image:
    // 3m: ₹44,967 x 3 months, 0% interest, Additional cashback ₹7,500
    // 6m: ₹22,483 x 6 months, 0% interest, Additional cashback ₹7,500
    // 12m: ₹11,242 x 12 months, 0% interest, Additional cashback ₹7,500
    // 24m: ₹5,621 x 24 months, 0% interest, Additional cashback ₹7,500
    // 36m: ₹4,297 x 36 months, 10.5% interest, Additional cashback ₹7,500
    // 48m: ₹3,385 x 48 months, 10.5% interest, Additional cashback ₹7,500
    // 60m: ₹2,842 x 60 months, 10.5% interest, Additional cashback ₹7,500

    const emiPlansData = [];

    for (const variant of createdVariants) {
      const price = variant.price;
      const isBaseIphone = variant.productId.toString() === createdProducts[0]._id.toString() && variant.price === 127400;

      // Plan templates
      const planSpecs = [
        { tenure: 3, rate: 0, cashback: 7500, popular: false, fixedAmount: isBaseIphone ? 44967 : null },
        { tenure: 6, rate: 0, cashback: 7500, popular: true, fixedAmount: isBaseIphone ? 22483 : null },
        { tenure: 12, rate: 0, cashback: 7500, popular: true, fixedAmount: isBaseIphone ? 11242 : null },
        { tenure: 24, rate: 0, cashback: 7500, popular: false, fixedAmount: isBaseIphone ? 5621 : null },
        { tenure: 36, rate: 10.5, cashback: 7500, popular: false, fixedAmount: isBaseIphone ? 4297 : null },
        { tenure: 48, rate: 10.5, cashback: 7500, popular: false, fixedAmount: isBaseIphone ? 3385 : null },
        { tenure: 60, rate: 10.5, cashback: 7500, popular: false, fixedAmount: isBaseIphone ? 2842 : null }
      ];

      for (const spec of planSpecs) {
        let monthlyAmount;
        if (spec.fixedAmount) {
          monthlyAmount = spec.fixedAmount;
        } else if (spec.rate === 0) {
          monthlyAmount = Math.round(price / spec.tenure);
        } else {
          const monthlyRate = (spec.rate / 100) / 12;
          monthlyAmount = Math.round(
            (price * monthlyRate * Math.pow(1 + monthlyRate, spec.tenure)) /
            (Math.pow(1 + monthlyRate, spec.tenure) - 1)
          );
        }

        emiPlansData.push({
          variantId: variant._id,
          monthlyAmount,
          tenureMonths: spec.tenure,
          interestRate: spec.rate,
          cashback: spec.cashback,
          isPopular: spec.popular
        });
      }
    }

    const createdEMIPlans = await EMIPlan.insertMany(emiPlansData);
    console.log(`Created ${createdEMIPlans.length} EMI plans`);
    console.log('Seeding into connection complete');
  } catch (error) {
    console.error('Error in seedIntoExistingConnection:', error);
    throw error;
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
module.exports.seedIntoExistingConnection = seedIntoExistingConnection;
