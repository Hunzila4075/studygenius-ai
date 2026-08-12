import mongoose, { Schema } from 'mongoose';
const QuizSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', index: true },
    subjectName: { type: String, default: 'General' },
    topic: { type: String, required: true },
    questions: [
        {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: Number, required: true },
            explanation: { type: String, default: '' },
            userAnswer: { type: Number },
        },
    ],
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, default: 0 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    timeTakenSeconds: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model('Quiz', QuizSchema);
