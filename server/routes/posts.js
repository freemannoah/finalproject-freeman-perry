import express from 'express';
import crypto from 'crypto';
import { Post } from '../models/Post.js';
import { Message } from '../models/Message.js';
import { sendResponse } from '../utils/response.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();


router.get('/board', requireAuth, async (req, res) => {

  try {

    const posts = await Post.find().sort({ created: -1 });
    const boardData = {};
    posts.forEach(post => {

      boardData[post.post_id] = {

        post_id: post.post_id,
        user_id: post.user_id,
        title: post.title,
        isResolved: post.isResolved,
        created: post.created,
        imageData: post.imageData || ''
      };
    });

    return sendResponse(res, 200, boardData, "Board retrieved successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.post('/post', requireAuth, async (req, res) => {

  try {

    const { title, description, imageData } = req.body;
    if (!title) {

      return sendResponse(res, 400, {}, "Title is required", false);
    }

    const post_id = crypto.randomUUID();
    const newPost = await Post.create({

      post_id,
      user_id: req.user.user_id,
      title,
      description: description || '',
      isResolved: false,
      imageData: imageData || '',
      created: new Date()
    });

    return sendResponse(res, 201, {

      post_id: newPost.post_id,
      user_id: newPost.user_id,
      title: newPost.title,
      description: newPost.description,
      isResolved: newPost.isResolved,
      messages: [],
      imageData: newPost.imageData
    }, "Post created successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.get('/post/:post_id', requireAuth, async (req, res) => {

  try {

    const post = await Post.findOne({ post_id: req.params.post_id });
    if (!post) {

      return sendResponse(res, 404, {}, "Post not found", false);
    }

    const currentUserId = req.user.user_id;

    const messages = await Message.find({

      post_id: post.post_id,
      $or: [

        { sender_id: currentUserId },
        { recipient_id: currentUserId }
      ]
    }).sort({ time: 1 });

    return sendResponse(res, 200, {

      post_id: post.post_id,
      user_id: post.user_id,
      title: post.title,
      description: post.description,
      isResolved: post.isResolved,
      created: post.created,
      messages,
      imageData: post.imageData
    }, "Post retrieved successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.post('/post/resolve/:post_id', requireAuth, async (req, res) => {

  try {

    const post = await Post.findOne({ post_id: req.params.post_id });
    if (!post) return sendResponse(res, 404, {}, "Post not found", false);
    if (post.user_id !== req.user.user_id) {

      return sendResponse(res, 403, {}, "Unauthorized to resolve this post", false);
    }

    post.isResolved = true;
    await post.save();

    const messages = await Message.find({ post_id: post.post_id }).sort({ time: 1 });
    return sendResponse(res, 200, {

      post_id: post.post_id,
      user_id: post.user_id,
      title: post.title,
      description: post.description,
      isResolved: post.isResolved,
      messages,
      imageData: post.imageData
    }, "Post resolved successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.post('/post/edit', requireAuth, async (req, res) => {

  try {

    const { post_id, title, description, imageData } = req.body;
    const post = await Post.findOne({ post_id });
    if (!post) return sendResponse(res, 404, {}, "Post not found", false);
    if (post.user_id !== req.user.user_id) {

      return sendResponse(res, 403, {}, "Unauthorized to edit this post", false);
    }
    if (post.isResolved) {

      return sendResponse(res, 400, {}, "Cannot edit a resolved post", false);
    }

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    if (imageData !== undefined) post.imageData = imageData;
    await post.save();

    const messages = await Message.find({ post_id: post.post_id }).sort({ time: 1 });
    return sendResponse(res, 200, {

      post_id: post.post_id,
      user_id: post.user_id,
      title: post.title,
      description: post.description,
      isResolved: post.isResolved,
      messages,
      imageData: post.imageData
    }, "Post updated successfully", true);
  } 
  catch (error) {

    return sendResponse(res, 500, {}, error.message, false);
  }
});


router.delete('/post/:post_id', requireAuth, async (req, res) => {

  try {

    const post = await Post.findOne({ post_id: req.params.post_id });
    if (!post) return sendResponse(res, 404, {}, "Post not found", false);
    if (post.user_id !== req.user.user_id) {

      return sendResponse(res, 403, {}, "Unauthorized to delete this post", false);
    }

    await Message.deleteMany({ post_id: post.post_id });
    await Post.deleteOne({ post_id: post.post_id });

    return sendResponse(res, 200, {

      post_id: post.post_id,
      user_id: post.user_id,
      title: post.title,
      isResolved: post.isResolved,
      imageData: post.imageData
    }, "Post and associated messages deleted successfully", true);
  } 
  catch (error) {
    
    return sendResponse(res, 500, {}, error.message, false);
  }
});

export default router;