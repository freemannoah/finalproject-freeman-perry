import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    
  message_id: { type: String, required: true, unique: true },
  post_id: { type: String, required: true, ref: 'Post' },
  sender_id: { type: String, required: true, ref: 'User' },
  recipient_id: { type: String, required: true, ref: 'User' },
  body: { type: String, required: true },
  imageData: { type: String, default: '' },
  time: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);