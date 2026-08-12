import mongoose, { Schema } from 'mongoose';
const SummarySchema = new Schema({
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
}, { timestamps: true });
export default mongoose.model('Summary', SummarySchema);
