import mongoose, { Schema } from 'mongoose';
const SubjectSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    color: { type: String, default: '#4F46E5' },
}, { timestamps: true });
SubjectSchema.index({ userId: 1, name: 1 }, { unique: true });
export default mongoose.model('Subject', SubjectSchema);
