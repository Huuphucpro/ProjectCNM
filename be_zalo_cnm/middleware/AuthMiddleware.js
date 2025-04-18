import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { UsersModel } from '../models/UserModel.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log('Decoded token:', decoded);

      // Get user from the token
      const user = await UsersModel.findById(decoded._id).select('-password');
      console.log('Found user:', user ? 'Yes' : 'No', 'with ID:', decoded._id);
      
      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      // Set user in request
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
}); 