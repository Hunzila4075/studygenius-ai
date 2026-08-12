import mongoose, { Schema, Document } from 'mongoose';

export type PlanType = 'Free' | 'Pro' | 'Premium';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';

export interface ISubscription {
  plan: PlanType;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  university?: string;
  degree?: string;
  semester?: string;
  profileImage?: string;
  subscription: ISubscription;
  settings?: {
    theme: 'light' | 'dark' | 'system';
    studyReminders: boolean;
    quizReminders: boolean;
    taskReminders: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    university: { type: String, default: 'National University' },
    degree: { type: String, default: 'Computer Science' },
    semester: { type: String, default: 'Semester 4' },
    profileImage: { type: String, default: '' },
    subscription: {
      plan: { type: String, enum: ['Free', 'Pro', 'Premium'], default: 'Free' },
      status: { type: String, enum: ['active', 'canceled', 'past_due', 'unpaid', 'trialing'], default: 'active' },
      stripeCustomerId: { type: String },
      stripeSubscriptionId: { type: String },
      currentPeriodStart: { type: Date, default: Date.now },
      currentPeriodEnd: { type: Date },
      cancelAtPeriodEnd: { type: Boolean, default: false },
    },
    settings: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      studyReminders: { type: Boolean, default: true },
      quizReminders: { type: Boolean, default: true },
      taskReminders: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
