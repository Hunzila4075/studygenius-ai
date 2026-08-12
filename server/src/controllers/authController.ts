import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Subject from '../models/Subject';
import { generateToken } from '../utils/authUtils';
import { AuthRequest } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, confirmPassword, university, degree, semester } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide all required fields.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      university: university || 'National University',
      degree: degree || 'Computer Science',
      semester: semester || 'Semester 4',
    });

    // Seed default subjects for new student
    const defaultSubjects = [
      { name: 'Data Structures & Algorithms', color: '#6366F1', description: 'Core CS data structures, sorting, trees & graphs' },
      { name: 'Database Systems', color: '#10B981', description: 'SQL, NoSQL, Relational algebra & Normalization' },
      { name: 'Web Engineering', color: '#F59E0B', description: 'HTML, CSS, JS, REST APIs & Full Stack Dev' },
      { name: 'Human-Computer Interaction', color: '#EC4899', description: 'UI/UX design principles, usability & wireframing' },
      { name: 'Computer Networks', color: '#3B82F6', description: 'TCP/IP, OSI Layers, Routing & Network protocols' },
    ];

    for (const sub of defaultSubjects) {
      await Subject.create({ userId: newUser._id, ...sub });
    }

    const token = generateToken({ userId: newUser._id.toString(), email: newUser.email });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to StudyGenius AI.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        university: newUser.university,
        degree: newUser.degree,
        semester: newUser.semester,
        settings: newUser.settings,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please enter both email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const token = generateToken({ userId: user._id.toString(), email: user.email });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login successful!',
      token,
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    if (!user) {
      res.status(444).json({ success: false, message: 'User not found.' });
      return;
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current and new password are required.' });
      return;
    }

    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Incorrect current password.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
};
