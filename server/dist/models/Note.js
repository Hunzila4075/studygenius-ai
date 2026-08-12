import mongoose, { Schema } from 'mongoose';
const NoteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    favorite: { type: Boolean, default: false },
}, { timestamps: true });
NoteSchema.index({ userId: 1, title: 'text', content: 'text', tags: 'text' });
export default mongoose.model('Note', NoteSchema);
