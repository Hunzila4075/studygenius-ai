import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage {
  sender: 'user' | 'ai';
  text: string;
  saved?: boolean;
  timestamp: Date;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  subject?: string;
  title: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
