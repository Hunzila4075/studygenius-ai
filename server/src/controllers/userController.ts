import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, university, degree, semester } = req.body;
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (name) user.name = name;
    if (university) user.university = university;
    if (degree) user.degree = degree;
    if (semester) user.semester = semester;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        degree: user.degree,
        semester: user.semester,
        settings: user.settings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { theme, studyReminders, quizReminders, taskReminders } = req.body;
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (!user.settings) {
      user.settings = { theme: 'system', studyReminders: true, quizReminders: true, taskReminders: true };
    }

    if (theme) user.settings.theme = theme;
    if (studyReminders !== undefined) user.settings.studyReminders = studyReminders;
    if (quizReminders !== undefined) user.settings.quizReminders = quizReminders;
    if (taskReminders !== undefined) user.settings.taskReminders = taskReminders;

    await user.save();

    res.json({ success: true, message: 'Settings saved.', settings: user.settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    await User.findByIdAndDelete(userId);
    res.clearCookie('token');
    res.json({ success: true, message: 'Account and associated data deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete account.' });
  }
};

