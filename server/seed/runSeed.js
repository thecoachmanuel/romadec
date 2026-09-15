import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { initialProducts, initialBusinessInfo } from './seedData.js';
import { Product } from '../models/Product.js';
import { BusinessInfo } from '../models/BusinessInfo.js';

dotenv.config();

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ERROR: MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB at: ${uri.replace(/:([^:@]+)@/, ':****@')}`);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('MongoDB connection successful!');

    // 1. Seed Products
    console.log(`Deleting old products (if any)...`);
    await Product.deleteMany({});

    console.log(`Inserting ${initialProducts.length} products with Nigerian Naira pricing...`);
    const inserted = await Product.insertMany(initialProducts);
    console.log(`Successfully seeded ${inserted.length} products!`);

    // 2. Seed Business Info
    console.log('Updating Business Info...');
    await BusinessInfo.deleteMany({});
    const biz = await BusinessInfo.create(initialBusinessInfo);
    console.log(`Successfully seeded business info for: ${biz.storeName}`);

    console.log('\n--- ALL PRODUCTS AND STORE INFO SEEDED SUCCESSFULLY ---');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed with error:', err.message);
    process.exit(1);
  }
};

seed();
