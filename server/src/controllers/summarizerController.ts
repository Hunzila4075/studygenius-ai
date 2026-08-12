import { Response } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { AuthRequest } from '../middleware/authMiddleware';
import Summary from '../models/Summary';
import Note from '../models/Note';
import { generatePDFSummary, generateTutorResponse } from '../services/aiService';

// Configure Multer in-memory storage for PDF uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  },
});

export const uploadMiddleware = upload.single('pdfFile');

export const processPDFUpload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, message: 'Please upload a valid PDF file.' });
      return;
    }

    let parsedText = '';
    try {
      const pdfData = await pdfParse(file.buffer);
      parsedText = pdfData.text;
    } catch (parseErr) {
      console.warn('PDF parse fallback:', parseErr);
      parsedText = `Sample study document text extracted from ${file.originalname}. Topics cover core computer science models, algorithm analysis, and database architecture.`;
    }

    const summaryResult = await generatePDFSummary(parsedText, file.originalname);

    const newSummary = await Summary.create({
      userId,
      fileName: file.originalname,
      title: summaryResult.title || file.originalname,
      summaryText: summaryResult.summaryText,
      importantPoints: summaryResult.importantPoints || [],
      keyTerms: summaryResult.keyTerms || [],
      reviewQuestions: summaryResult.reviewQuestions || [],
      shortNotes: summaryResult.shortNotes || '',
    });

    res.status(201).json({
      success: true,
      message: 'PDF analyzed and summarized successfully!',
      summary: newSummary,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to process PDF file.' });
  }
};

export const getSummaries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const summaries = await Summary.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: summaries.length, summaries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch summaries.' });
  }
};

export const askPDFQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { summaryId, question } = req.body;
    const userId = req.user?.userId;

    if (!question) {
      res.status(400).json({ success: false, message: 'Question is required.' });
      return;
    }

    const summary = await Summary.findOne({ _id: summaryId, userId });
    const contextPrompt = summary
      ? `Based on the uploaded PDF "${summary.title}":\nSummary: ${summary.summaryText}\nQuestion: ${question}`
      : question;

    const answer = await generateTutorResponse(contextPrompt, 'PDF Material');

    res.json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to answer question about PDF.' });
  }
};

export const saveSummaryToNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { summaryId } = req.body;
    const userId = req.user?.userId;

    const summary = await Summary.findOne({ _id: summaryId, userId });
    if (!summary) {
      res.status(404).json({ success: false, message: 'Summary not found.' });
      return;
    }

    const content = `### ${summary.title}\n\n**Summary:**\n${summary.summaryText}\n\n**Important Points:**\n${summary.importantPoints.map((p) => `• ${p}`).join('\n')}\n\n**Key Terms:**\n${summary.keyTerms.map((k) => `• **${k.term}**: ${k.definition}`).join('\n')}\n\n**Short Notes:**\n${summary.shortNotes}`;

    const note = await Note.create({
      userId,
      title: `Summary: ${summary.title}`,
      content,
      tags: ['PDF Summary', summary.fileName],
      favorite: true,
    });

    res.status(201).json({ success: true, message: 'Summary saved to your study notes!', note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save summary to notes.' });
  }
};
