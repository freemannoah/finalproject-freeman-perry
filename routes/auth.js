import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sendResponse } from '../utils/response.js';
import { requireAuth, activeTokens } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {

  try {

    const { username, password } = req.body;
    if (!username || !password) {

      return sendResponse(res, 400, {}, "Username and password are required", false);
    }

    const user = await User.findOne({ username });
    if (!user) {

      return sendResponse(res, 401, {}, "Invalid credentials", false);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {

      return sendResponse(res, 401, {}, "Invalid credentials", false);
    }

    const token = jwt.sign(

      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    activeTokens.add(token);

    return sendResponse(res, 200, { Token: token }, "Login successful", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});

router.get('/logout', requireAuth, (req, res) => {
  
  activeTokens.delete(req.token);
  return sendResponse(res, 200, {}, "Logged out successfully", true);
});

export default router;