import express from 'express';

const router = express.Router();

// POST /api/auth/login - Admin Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@romadec.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (
    email.toLowerCase().trim() === adminEmail.toLowerCase().trim() &&
    password === adminPassword
  ) {
    return res.json({
      status: true,
      token: `romadec_adm_${Date.now()}`,
      user: {
        email: adminEmail,
        role: 'admin',
        store: 'Romadec Stores',
      },
    });
  }

  return res.status(401).json({
    status: false,
    message: 'Invalid administrator email or password',
  });
});

export default router;
