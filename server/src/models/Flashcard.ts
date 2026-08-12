import mongoose, { Schema, Document } from 'mongoose';

export interface IFlashcard extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  learned: boolean;
  review: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FlashcardSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    learned: { type: Boolean, default: false },
    review: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);

