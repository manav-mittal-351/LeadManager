import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { generateToken } from '../middleware/auth.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const errors = {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Registration validation failed',
        errors,
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
        errors: { email: 'Email is already registered' },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const insertStmt = db.prepare(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
    );
    const result = insertStmt.run(name.trim(), cleanEmail, passwordHash);
    const userId = Number(result.lastInsertRowid);

    const user = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
    };

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = generateToken(userData);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (err) {
    next(err);
  }
}

export function me(req, res) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    user,
  });
}

export function demoLogin(req, res, next) {
  try {
    let demoUser = db.prepare("SELECT id, name, email FROM users WHERE email = 'demo@merutech.com'").get();

    if (!demoUser) {
      const passwordHash = bcrypt.hashSync('demo123', 10);
      const insert = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
      const result = insert.run('Sales Rep Demo', 'demo@merutech.com', passwordHash);
      demoUser = { id: Number(result.lastInsertRowid), name: 'Sales Rep Demo', email: 'demo@merutech.com' };
    }

    const token = generateToken(demoUser);

    return res.status(200).json({
      success: true,
      message: 'Logged in as Demo User',
      token,
      user: demoUser,
    });
  } catch (err) {
    next(err);
  }
}
