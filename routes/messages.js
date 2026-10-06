import express from 'express';
import crypto from 'crypto';
import { Message } from '../models/Message.js';
import { Post } from '../models/Post.js';
import { sendResponse } from '../utils/response.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();


router.post('/', requireAuth, async (req, res) => {

  try {

    const { post_id, recipient_id, body, imageData } = req.body;
    if (!post_id || !recipient_id || !body) {

      return sendResponse(res, 400, {}, "Missing required message fields", false);
    }

    const post = await Post.findOne({ post_id });
    if (!post) {

      return sendResponse(res, 404, {}, "Post does not exist", false);
    }

    const message_id = crypto.randomUUID();
    const newMessage = await Message.create({

      message_id,
      post_id,
      sender_id: req.user.user_id,
      recipient_id,
      body,
      imageData: imageData || '',
      time: new Date()
    });

    return sendResponse(res, 201, {

      message_id: newMessage.message_id,
      post_id: newMessage.post_id,
      sender_id: newMessage.sender_id,
      recipient_id: newMessage.recipient_id,
      body: newMessage.body,
      time: newMessage.time,
      imageData: newMessage.imageData
    }, "Message sent successfully", true);
  } 
  catch (error) {
    
    return sendResponse(res, 500, {}, error.message, false);
  }
});

export default router;