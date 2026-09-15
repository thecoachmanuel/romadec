import mongoose from 'mongoose';
import { initialProducts, initialBusinessInfo } from '../seed/seedData.js';
import { Product } from '../models/Product.js';
import { BusinessInfo } from '../models/BusinessInfo.js';
import { Order } from '../models/Order.js';

let isConnected = false;
let cachedConnection = null;

// Fallback in-memory storage if MongoDB is temporarily unreachable
export const memoryStore = {
  products: initialProducts.map((p, index) => ({
    ...p,
    _id: `prod_${index + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  businessInfo: {
    _id: 'biz_1',
    ...initialBusinessInfo,
    updatedAt: new Date().toISOString(),
  },
  orders: [
    {
      _id: 'order_demo_1',
      orderNumber: 'ROM-1001',
      items: [
        {
          product: 'prod_1',
          title: 'Animi Dolor Pariatur',
          price: 15000,
          quantity: 1,
          image: '/assets/images/product-1.jpg',
        },
        {
          product: 'prod_6',
          title: 'Helen Chair',
          price: 104000,
          quantity: 2,
          image: '/assets/images/product-6.jpg',
        },
      ],
      customer: {
        fullName: 'Chinedu Okafor',
        email: 'chinedu.o@example.ng',
        phone: '+234 802 345 6789',
      },
      shippingAddress: {
        street: '45 Admiralty Way, Lekki Phase 1',
        city: 'Lekki',
        state: 'Lagos',
        country: 'Nigeria',
        postalCode: '105102',
      },
      totalAmount: 223000,
      paymentMethod: 'Paystack',
      paymentStatus: 'paid',
      paystackReference: 'PSTK_DEMO_998124',
      orderStatus: 'processing',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      paidAt: new Date(Date.now() - 3600000 * 23).toISOString(),
    },
  ],
};

export const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    isConnected = true;
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/romadec';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    cachedConnection = conn;
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${uri.replace(/:([^:@]+)@/, ':****@')}`);

    // Check and seed if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[MongoDB] Seeding initial 19 products into database...');
      await Product.insertMany(initialProducts);
      console.log('[MongoDB] Products seeded successfully.');
    }

    const bizCount = await BusinessInfo.countDocuments();
    if (bizCount === 0) {
      console.log('[MongoDB] Seeding default business info into database...');
      await BusinessInfo.create(initialBusinessInfo);
      console.log('[MongoDB] Business info seeded.');
    }
    return conn;
  } catch (err) {
    isConnected = false;
    console.warn(
      `[MongoDB] Notice: Could not connect to MongoDB (${err.message}).`
    );
    console.log(
      '[Storage] Operating in fallback memory mode. Configure MONGODB_URI to connect to MongoDB.'
    );
    return null;
  }
};

export const isMongoActive = () => isConnected;

// Repository abstractions supporting both MongoDB and fallback mode
export const ProductRepo = {
  async find(filter = {}) {
    if (isConnected) {
      const query = {};
      if (filter.category && filter.category !== 'all') {
        query.category = filter.category;
      }
      if (filter.search) {
        query.$or = [
          { title: { $regex: filter.search, $options: 'i' } },
          { category: { $regex: filter.search, $options: 'i' } },
          { description: { $regex: filter.search, $options: 'i' } },
        ];
      }
      return await Product.find(query).sort({ createdAt: -1 });
    }
    let list = [...memoryStore.products];
    if (filter.category && filter.category !== 'all') {
      list = list.filter((p) => p.category === filter.category);
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s) ||
          (p.description && p.description.toLowerCase().includes(s))
      );
    }
    return list;
  },

  async findById(id) {
    if (isConnected) {
      if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
        const byId = await Product.findById(id);
        if (byId) return byId;
      }
      return await Product.findOne({
        $or: [{ slug: id }, { title: new RegExp(`^${id}$`, 'i') }],
      });
    }
    return memoryStore.products.find(
      (p) =>
        String(p._id) === String(id) ||
        p.slug === id ||
        p.title.toLowerCase() === String(id).toLowerCase()
    );
  },

  async create(data) {
    if (isConnected) {
      return await Product.create(data);
    }
    const newProd = {
      ...data,
      _id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.products.unshift(newProd);
    return newProd;
  },

  async findByIdAndUpdate(id, data) {
    const updateData = { ...data };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if (isConnected) {
      if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
        return await Product.findByIdAndUpdate(id, updateData, { new: true });
      }
      return await Product.findOneAndUpdate({ slug: id }, updateData, { new: true });
    }
    const index = memoryStore.products.findIndex(
      (p) => String(p._id) === String(id) || p.slug === id
    );
    if (index === -1) return null;
    memoryStore.products[index] = {
      ...memoryStore.products[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return memoryStore.products[index];
  },

  async findByIdAndDelete(id) {
    if (isConnected) {
      if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
        return await Product.findByIdAndDelete(id);
      }
      return await Product.findOneAndDelete({ slug: id });
    }
    const index = memoryStore.products.findIndex(
      (p) => String(p._id) === String(id) || p.slug === id
    );
    if (index === -1) return null;
    const deleted = memoryStore.products.splice(index, 1);
    return deleted[0];
  },
};

export const OrderRepo = {
  async find() {
    if (isConnected) {
      return await Order.find().sort({ createdAt: -1 });
    }
    return [...memoryStore.orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  async findById(id) {
    if (isConnected) {
      if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
        const byId = await Order.findById(id);
        if (byId) return byId;
      }
      return await Order.findOne({ orderNumber: id });
    }
    return memoryStore.orders.find(
      (o) => String(o._id) === String(id) || o.orderNumber === id
    );
  },

  async create(data) {
    if (isConnected) {
      return await Order.create(data);
    }
    const newOrder = {
      ...data,
      _id: `order_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.orders.unshift(newOrder);
    return newOrder;
  },

  async updateStatus(id, status, paystackRef) {
    if (isConnected) {
      const updateData = { orderStatus: status };
      if (status === 'paid' || paystackRef) {
        updateData.paymentStatus = 'paid';
        updateData.paidAt = new Date();
      }
      if (paystackRef) {
        updateData.paystackReference = paystackRef;
      }
      if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id)) {
        return await Order.findByIdAndUpdate(id, updateData, { new: true });
      }
      return await Order.findOneAndUpdate({ orderNumber: id }, updateData, { new: true });
    }
    const order = memoryStore.orders.find(
      (o) => String(o._id) === String(id) || o.orderNumber === id
    );
    if (!order) return null;
    order.orderStatus = status;
    if (status === 'paid' || paystackRef) {
      order.paymentStatus = 'paid';
      order.paidAt = new Date().toISOString();
    }
    if (paystackRef) {
      order.paystackReference = paystackRef;
    }
    order.updatedAt = new Date().toISOString();
    return order;
  },
};

export const BusinessRepo = {
  async get() {
    if (isConnected) {
      let biz = await BusinessInfo.findOne();
      if (!biz) {
        biz = await BusinessInfo.create(initialBusinessInfo);
      }
      return biz;
    }
    return memoryStore.businessInfo;
  },

  async update(data) {
    const updateData = { ...data };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if (isConnected) {
      let biz = await BusinessInfo.findOne();
      if (!biz) {
        return await BusinessInfo.create(updateData);
      }
      return await BusinessInfo.findByIdAndUpdate(biz._id, updateData, { new: true });
    }
    memoryStore.businessInfo = {
      ...memoryStore.businessInfo,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return memoryStore.businessInfo;
  },
};
