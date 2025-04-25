const { model, Schema } = require('mongoose');

const organizerFeedbackSchema = new Schema({
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'Organizer'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  photos: [String],
  createdAt: {
    type: String,
    default: new Date().toISOString()
  }
});

export default model('OrganizerFeedback', organizerFeedbackSchema);
