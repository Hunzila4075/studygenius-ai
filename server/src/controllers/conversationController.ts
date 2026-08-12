import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Conversation from '../models/Conversation';
import Note from '../models/Note';
import { generateTutorResponse } from '../services/aiService';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch conversations.' });
  }
};

export const createConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subject, title } = req.body;
    const userId = req.user?.userId;

    const conv = await Conversation.create({
      userId,
      subject: subject || 'General',
      title: title || `${subject || 'General'} Discussion`,
      messages: [],
    });

    res.status(201).json({ success: true, conversation: conv });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create conversation.' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, message, subject } = req.body;
    const userId = req.user?.userId;

    if (!message || message.trim() === '') {
      res.status(400).json({ success: false, message: 'Message content is required.' });
      return;
    }

    let conv;
    if (conversationId) {
      conv = await Conversation.findOne({ _id: conversationId, userId });
    }

    if (!conv) {
      conv = await Conversation.create({
        userId,
        subject: subject || 'General',
        title: message.length > 30 ? `${message.substring(0, 30)}...` : message,
        messages: [],
      });
    }

    // Append user message
    conv.messages.push({
      sender: 'user',
      text: message,
      timestamp: new Date(),
    });

    // Generate AI response
    const history = conv.messages.map((m) => ({ sender: m.sender, text: m.text }));
    const aiResponseText = await generateTutorResponse(message, conv.subject, history);

    conv.messages.push({
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date(),
    });

    await conv.save();

    res.json({
      success: true,
      conversationId: conv._id,
      aiResponse: aiResponseText,
      messages: conv.messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

export const saveResponseToNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text, title, subject } = req.body;
    const userId = req.user?.userId;

    if (!text) {
      res.status(400).json({ success: false, message: 'Content is required to save note.' });
      return;
    }

    const note = await Note.create({
      userId,
      title: title || 'Saved AI Tutor Explanation',
      content: text,
      tags: ['AI Tutor', subject || 'General'],
      favorite: false,
    });

    res.status(201).json({ success: true, message: 'AI response saved to notes!', note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save note.' });
  }
};

export const clearConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const conv = await Conversation.findOne({ _id: id, userId });
    if (!conv) {
      res.status(404).json({ success: false, message: 'Conversation not found.' });
      return;
    }

    conv.messages = [];
    await conv.save();

    res.json({ success: true, message: 'Conversation cleared.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear conversation.' });
  }
};

export const deleteConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    await Conversation.findOneAndDelete({ _id: id, userId });
    res.json({ success: true, message: 'Conversation deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete conversation.' });
  }
};
