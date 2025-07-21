import { Schema, model } from 'mongoose';

const organizerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  logo: String,
  cover: String,
  phone: String,
  email: String,
  socials: {
    facebook: String,
    twitter: String,
    tiktok: String,
    instagram: String,
    threads: String,
    youtube: String
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      role: {
        type: String,
        enum: ['admin', 'editor'],
        default: 'admin'
        // admin: can manage all aspects of the organization
        // editor: can manage events and content but not organization settings
      }
    }
  ],
  isArchived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: String,
    default: new Date().toISOString()
  }
});

export default model('Organizer', organizerSchema);
