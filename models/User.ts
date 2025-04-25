import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  firstName: String,
  lastName: String,
  pronouns: String,
  location: String,
  birthdate: String,
  bio: String,
  avatar: String,
  socials: {
    facebook: String,
    twitter: String,
    tiktok: String,
    instagram: String,
    threads: String,
    youtube: String
  },
  createdAt: {
    type: String,
    default: new Date().toISOString()
  }
});

export default model('User', userSchema);
