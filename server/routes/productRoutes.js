import express from 'express';
import { ProductRepo } from '../config/db.js';

const router = express.Router();

// GET /api/products - get all products (supports ?category=&search=)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const products = await ProductRepo.find({ category, search });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// GET /api/products/:id - get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await ProductRepo.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error: error.message });
  }
});

// POST /api/products - create new product
router.post('/', async (req, res) => {
  try {
    const {
      title,
      category,
      price,
      delPrice,
      image,
      badge,
      badgeColor,
      cardBadge,
      inStock,
      stockQuantity,
      description,
      dimensions,
      material,
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: 'Title, price, and category are required' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProduct = await ProductRepo.create({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      category,
      price: Number(price),
      delPrice: delPrice ? Number(delPrice) : null,
      image: image || '/assets/images/product-1.jpg',
      badge: badge || null,
      badgeColor: badgeColor || 'orange',
      cardBadge: cardBadge || (inStock === false || Number(stockQuantity) === 0 ? 'Out of Stock' : null),
      inStock: inStock !== undefined ? inStock : (Number(stockQuantity) > 0),
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 15,
      description: description || '',
      dimensions: dimensions || 'Standard',
      material: material || 'Quality Materials',
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// PUT /api/products/:id - update product
router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.price !== undefined) data.price = Number(data.price);
    if (data.delPrice !== undefined && data.delPrice !== null && data.delPrice !== '') {
      data.delPrice = Number(data.delPrice);
    } else if (data.delPrice === '') {
      data.delPrice = null;
    }
    if (data.stockQuantity !== undefined) {
      data.stockQuantity = Number(data.stockQuantity);
      if (data.stockQuantity <= 0) {
        data.inStock = false;
        data.cardBadge = 'Out of Stock';
      }
    }

    const updated = await ProductRepo.findByIdAndUpdate(req.params.id, data);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// DELETE /api/products/:id - delete product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ProductRepo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

export default router;
