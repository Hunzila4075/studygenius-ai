import mongoose, { Schema, Document } from 'mongoose';

export interface IStudyTask extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  title: string;
  date: string;
  startTime?: string;
  duration: number;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudyTaskSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', index: true },
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, index: true },
    startTime: { type: String, default: '10:00' },
    duration: { type: Number, default: 45 },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    completed: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStudyTask>('StudyTask', StudyTaskSchema);

