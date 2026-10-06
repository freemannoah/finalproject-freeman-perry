import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/response.js';

export const activeTokens = new Set();

export const requireAuth = (req, res, next) => {

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {

    return sendResponse(res, 401, {}, "Authentication token missing or invalid", false);
  }

  const token = authHeader.split(' ')[1];

  if (!activeTokens.has(token)) {

    return sendResponse(res, 401, {}, "Session invalidated or logged out", false);
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } 
  catch (err) {
    
    activeTokens.delete(token);
    return sendResponse(res, 401, {}, "Session expired or invalid token", false);
  }
};