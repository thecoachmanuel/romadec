import express from 'express';
import { OrderRepo } from '../config/db.js';

const router = express.Router();

// GET /api/orders - get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await OrderRepo.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
  }
});

// GET /api/orders/:id - get single order by ID or orderNumber
router.get('/:id', async (req, res) => {
  try {
    const order = await OrderRepo.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve order', error: error.message });
  }
});

// POST /api/orders - place new order
router.post('/', async (req, res) => {
  try {
    const { items, customer, shippingAddress, totalAmount, paymentMethod, paystackReference } =
      req.body;

    if (!items || !items.length || !customer || !shippingAddress || !totalAmount) {
      return res.status(400).json({ message: 'Incomplete order payload' });
    }

    const orderNumber = `ROM-${Date.now().toString().slice(-6)}`;

    const newOrder = await OrderRepo.create({
      orderNumber,
      items,
      customer,
      shippingAddress: {
        street: shippingAddress.street || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || 'Lagos',
        country: shippingAddress.country || 'Nigeria',
        postalCode: shippingAddress.postalCode || '',
      },
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'Paystack',
      paymentStatus: paystackReference ? 'paid' : 'pending',
      paystackReference: paystackReference || '',
      orderStatus: 'pending',
      paidAt: paystackReference ? new Date() : null,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// PATCH /api/orders/:id/status - update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, paystackReference } = req.body;
    const updated = await OrderRepo.updateStatus(req.params.id, status, paystackReference);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

export default router;
