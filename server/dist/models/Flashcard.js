import mongoose, { Schema } from 'mongoose';
const FlashcardSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    learned: { type: Boolean, default: false },
    review: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model('Flashcard', FlashcardSchema);
