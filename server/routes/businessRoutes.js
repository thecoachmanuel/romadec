import express from 'express';
import { BusinessRepo } from '../config/db.js';

const router = express.Router();

// GET /api/business - get current business info
router.get('/', async (req, res) => {
  try {
    const info = await BusinessRepo.get();
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve business info', error: error.message });
  }
});

// PUT /api/business - update business info
router.put('/', async (req, res) => {
  try {
    const updated = await BusinessRepo.update(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update business info', error: error.message });
  }
});

export default router;
