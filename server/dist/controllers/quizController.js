import Quiz from '../models/Quiz.js';
import Subject from '../models/Subject.js';
import { generateQuizAI } from '../services/aiService.js';
export const generateQuiz = async (req, res) => {
    try {
        const { subjectId, subjectName, topic, numQuestions, difficulty } = req.body;
        const userId = req.user?.userId;
        if (!topic) {
            res.status(400).json({ success: false, message: 'Topic is required to generate quiz.' });
            return;
        }
        let resolvedSubjectName = subjectName || 'General';
        if (subjectId) {
            const sub = await Subject.findOne({ _id: subjectId, userId });
            if (sub)
                resolvedSubjectName = sub.name;
        }
        const questionCount = parseInt(numQuestions) || 5;
        const selectedDifficulty = difficulty || 'Medium';
        const questions = await generateQuizAI(resolvedSubjectName, topic, questionCount, selectedDifficulty);
        const quiz = await Quiz.create({
            userId,
            subjectId: subjectId || null,
            subjectName: resolvedSubjectName,
            topic,
            questions,
            totalQuestions: questions.length,
            difficulty: selectedDifficulty,
            completed: false,
        });
        res.status(201).json({ success: true, quiz });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate quiz.' });
    }
};
export const submitQuizResults = async (req, res) => {
    try {
        const { id } = req.params;
        const { userAnswers, timeTakenSeconds } = req.body;
        const userId = req.user?.userId;
        const quiz = await Quiz.findOne({ _id: id, userId });
        if (!quiz) {
            res.status(404).json({ success: false, message: 'Quiz not found or unauthorized.' });
            return;
        }
        let score = 0;
        quiz.questions.forEach((q, index) => {
            const ans = userAnswers[index];
            q.userAnswer = ans;
            if (ans === q.correctAnswer) {
                score += 1;
            }
        });
        const percentage = Math.round((score / quiz.questions.length) * 100);
        quiz.score = score;
        quiz.percentage = percentage;
        quiz.timeTakenSeconds = timeTakenSeconds || 60;
        quiz.completed = true;
        await quiz.save();
        res.json({
            success: true,
            message: 'Quiz results recorded.',
            quiz: {
                id: quiz._id,
                topic: quiz.topic,
                subjectName: quiz.subjectName,
                score,
                totalQuestions: quiz.totalQuestions,
                percentage,
                timeTakenSeconds: quiz.timeTakenSeconds,
                questions: quiz.questions,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to submit quiz results.' });
    }
};
export const getQuizHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const quizzes = await Quiz.find({ userId, completed: true }).sort({ createdAt: -1 });
        res.json({ success: true, count: quizzes.length, quizzes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch quiz history.' });
    }
};
