const connectDB = require('./config/db');
const Variant = require('./models/Variant');

(async () => {
  try {
    await connectDB();
    const variants = await Variant.find({}).lean();
    console.log('Variants count:', variants.length);
    variants.forEach(v => {
      console.log('Variant:', v.label, 'images:', v.images);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();