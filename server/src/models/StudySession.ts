import mongoose, { Schema, Document } from 'mongoose';

export interface IStudySession extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  durationMinutes: number;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudySessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', index: true },
    durationMinutes: { type: Number, required: true },
    date: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStudySession>('StudySession', StudySessionSchema);

