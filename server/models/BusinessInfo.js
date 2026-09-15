import mongoose from 'mongoose';

const businessInfoSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'Romadec Stores' },
    shortName: { type: String, default: 'Romadec' },
    tagline: { type: String, default: 'Get Quality Furniture' },
    email: { type: String, default: 'support@romadec.com' },
    phone: { type: String, default: '+234 (0) 808 760 8827' },
    address: {
      type: String,
      default: '93 Olojo Drive, Ojo, Lagos, Nigeria',
    },
    city: { type: String, default: 'Victoria Island, Lagos' },
    state: { type: String, default: 'Lagos' },
    country: { type: String, default: 'Nigeria' },
    currency: { type: String, default: 'NGN' },
    currencySymbol: { type: String, default: '₦' },
    aboutText: {
      type: String,
      default:
        'When you start with a portrait and search for a pure form, a clear volume, through successive eliminations, you arrive inevitably at the egg. Likewise, starting with the egg and following the same process in reverse, one finishes with the portrait.',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/romadec' },
      twitter: { type: String, default: 'https://twitter.com/romadec' },
      instagram: { type: String, default: 'https://instagram.com/romadec' },
    },
  },
  { timestamps: true }
);

export const BusinessInfo =
  mongoose.models.BusinessInfo || mongoose.model('BusinessInfo', businessInfoSchema);
