import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['accessory', 'decoration', 'furniture'],
      default: 'decoration',
    },
    price: { type: Number, required: true }, // in NGN (Naira)
    delPrice: { type: Number }, // original/strikethrough price in NGN
    image: { type: String, required: true },
    badge: { type: String, default: null }, // e.g., 'Sale', '-10%'
    badgeColor: { type: String, default: 'orange' }, // 'orange' or 'cyan'
    cardBadge: { type: String, default: null }, // e.g., 'Out of Stock'
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 20 },
    description: { type: String, default: '' },
    dimensions: { type: String, default: 'Standard' },
    material: { type: String, default: 'Premium Wood / Glass / Fabric' },
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 12 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
