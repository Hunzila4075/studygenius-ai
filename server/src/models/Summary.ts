import mongoose, { Schema, Document } from 'mongoose';

export interface ISummary extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  title: string;
  summaryText: string;
  importantPoints: string[];
  keyTerms: { term: string; definition: string }[];
  reviewQuestions: string[];
  shortNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

const SummarySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fileName: { type: String, required: true },
    title: { type: String, required: true },
    summaryText: { type: String, required: true },
    importantPoints: [{ type: String }],
    keyTerms: [
      {
        term: { type: String, required: true },
        definition: { type: String, required: true },
      },
    ],
    reviewQuestions: [{ type: String }],
    shortNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ISummary>('Summary', SummarySchema);
