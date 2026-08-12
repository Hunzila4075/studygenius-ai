import mongoose, { Schema } from 'mongoose';
const StudySessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', index: true },
    durationMinutes: { type: Number, required: true },
    date: { type: String, required: true, index: true },
}, { timestamps: true });
export default mongoose.model('StudySession', StudySessionSchema);
