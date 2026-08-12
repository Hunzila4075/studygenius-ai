import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import Subject from '../models/Subject.js';
import Note from '../models/Note.js';
import Quiz from '../models/Quiz.js';
import StudyTask from '../models/StudyTask.js';
import StudySession from '../models/StudySession.js';

export const getSubjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const subjects = await Subject.find({ userId }).sort({ name: 1 });

    // Enhance each subject with calculated statistics
    const enhancedSubjects = await Promise.all(
      subjects.map(async (sub) => {
        const notesCount = await Note.countDocuments({ userId, subjectId: sub._id });
        const tasksCount = await StudyTask.countDocuments({ userId, subjectId: sub._id });
        const completedTasksCount = await StudyTask.countDocuments({ userId, subjectId: sub._id, completed: true });

        const quizzes = await Quiz.find({ userId, subjectId: sub._id, completed: true });
        const quizAvg = quizzes.length > 0
          ? Math.round(quizzes.reduce((acc, q) => acc + q.percentage, 0) / quizzes.length)
          : 0;

        const sessions = await StudySession.find({ userId, subjectId: sub._id });
        const totalStudyMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

        const progressPercentage = tasksCount > 0 ? Math.round((completedTasksCount / tasksCount) * 100) : 0;

        return {
          ...sub.toObject(),
          notesCount,
          tasksCount,
          completedTasksCount,
          quizAvg,
          studyTimeHours: (totalStudyMinutes / 60).toFixed(1),
          progressPercentage,
        };
      })
    );

    res.json({ success: true, subjects: enhancedSubjects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subjects.' });
  }
};

export const createSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, color } = req.body;
    const userId = req.user?.userId;

    if (!name) {
      res.status(400).json({ success: false, message: 'Subject name is required.' });
      return;
    }

    const existing = await Subject.findOne({ userId, name: name.trim() });
    if (existing) {
      res.status(400).json({ success: false, message: 'A subject with this name already exists.' });
      return;
    }

    const subject = await Subject.create({
      userId,
      name,
      description: description || '',
      color: color || '#4F46E5',
    });

    res.status(201).json({ success: true, message: 'Subject created.', subject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create subject.' });
  }
};

export const updateSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;
    const userId = req.user?.userId;

    const subject = await Subject.findOne({ _id: id, userId });
    if (!subject) {
      res.status(404).json({ success: false, message: 'Subject not found or unauthorized.' });
      return;
    }

    if (name) subject.name = name;
    if (description !== undefined) subject.description = description;
    if (color) subject.color = color;

    await subject.save();
    res.json({ success: true, message: 'Subject updated.', subject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update subject.' });
  }
};

export const deleteSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const subject = await Subject.findOneAndDelete({ _id: id, userId });
    if (!subject) {
      res.status(404).json({ success: false, message: 'Subject not found or unauthorized.' });
      return;
    }

    res.json({ success: true, message: 'Subject deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete subject.' });
  }
};
