const { model, Schema } = require('mongoose');

const eventFeedbackSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  // joiners can only leave feedback for events they have joined
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

export default model('EventFeedback', eventFeedbackSchema);
