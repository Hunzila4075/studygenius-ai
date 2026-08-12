import mongoose, { Schema } from 'mongoose';
const ConversationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, default: 'General' },
    title: { type: String, default: 'New Conversation' },
    messages: [
        {
            sender: { type: String, enum: ['user', 'ai'], required: true },
            text: { type: String, required: true },
            saved: { type: Boolean, default: false },
            timestamp: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });
export default mongoose.model('Conversation', ConversationSchema);
