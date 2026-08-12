import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import Flashcard from '../models/Flashcard.js';
import { generateFlashcardsAI } from '../services/aiService.js';

export const getFlashcards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { subjectId, filter } = req.query;

    const query: any = { userId };
    if (subjectId) query.subjectId = subjectId;
    if (filter === 'learned') query.learned = true;
    if (filter === 'review') query.review = true;

    const flashcards = await Flashcard.find(query).populate('subjectId', 'name color').sort({ createdAt: -1 });
    res.json({ success: true, count: flashcards.length, flashcards });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch flashcards.' });
  }
};

export const createFlashcard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { question, answer, subjectId } = req.body;
    const userId = req.user?.userId;

    if (!question || !answer) {
      res.status(400).json({ success: false, message: 'Question and answer are required.' });
      return;
    }

    const flashcard = await Flashcard.create({
      userId,
      subjectId: subjectId || null,
      question,
      answer,
      learned: false,
      review: false,
    });

    const populated = await Flashcard.findById(flashcard._id).populate('subjectId', 'name color');
    res.status(201).json({ success: true, message: 'Flashcard created.', flashcard: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create flashcard.' });
  }
};

export const generateAIFlashcards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { topic, subjectId, count } = req.body;
    const userId = req.user?.userId;

    if (!topic) {
      res.status(400).json({ success: false, message: 'Topic is required.' });
      return;
    }

    const cardCount = parseInt(count) || 6;
    const cardsData = await generateFlashcardsAI(topic, cardCount);

    const createdCards: any[] = [];
    for (const card of cardsData) {
      const fc = await Flashcard.create({
        userId,
        subjectId: subjectId || null,
        question: card.question || card.front || 'Question',
        answer: card.answer || card.back || 'Answer',
        learned: false,
        review: false,
      });
      const populated = await Flashcard.findById(fc._id).populate('subjectId', 'name color');
      createdCards.push(populated || fc);
    }

    res.status(201).json({ success: true, message: `Generated ${createdCards.length} flashcards!`, flashcards: createdCards, count: createdCards.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate AI flashcards.' });
  }
};

export const updateFlashcardStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, learned, review } = req.body;
    const userId = req.user?.userId;

    const flashcard = await Flashcard.findOne({ _id: id, userId });
    if (!flashcard) {
      res.status(404).json({ success: false, message: 'Flashcard not found.' });
      return;
    }

    if (status === 'Mastered') {
      flashcard.learned = true;
      flashcard.review = false;
    } else if (status === 'Learning' || review) {
      flashcard.learned = false;
      flashcard.review = true;
    } else if (status === 'New') {
      flashcard.learned = false;
      flashcard.review = false;
    } else {
      if (typeof learned === 'boolean') flashcard.learned = learned;
      if (typeof review === 'boolean') flashcard.review = review;
    }

    await flashcard.save();
    const populated = await Flashcard.findById(flashcard._id).populate('subjectId', 'name color');
    res.json({ success: true, flashcard: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update flashcard status.' });
  }
};

export const toggleLearned = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const flashcard = await Flashcard.findOne({ _id: id, userId });
    if (!flashcard) {
      res.status(404).json({ success: false, message: 'Flashcard not found.' });
      return;
    }

    flashcard.learned = !flashcard.learned;
    if (flashcard.learned) flashcard.review = false;
    await flashcard.save();

    res.json({ success: true, learned: flashcard.learned });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update flashcard.' });
  }
};

export const toggleReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const flashcard = await Flashcard.findOne({ _id: id, userId });
    if (!flashcard) {
      res.status(404).json({ success: false, message: 'Flashcard not found.' });
      return;
    }

    flashcard.review = !flashcard.review;
    if (flashcard.review) flashcard.learned = false;
    await flashcard.save();

    res.json({ success: true, review: flashcard.review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update flashcard.' });
  }
};

export const deleteFlashcard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const flashcard = await Flashcard.findOneAndDelete({ _id: id, userId });
    if (!flashcard) {
      res.status(404).json({ success: false, message: 'Flashcard not found.' });
      return;
    }

    res.json({ success: true, message: 'Flashcard deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete flashcard.' });
  }
};
