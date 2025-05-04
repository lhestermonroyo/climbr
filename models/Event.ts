const { model, Schema } = require('mongoose');

const eventSchema = new Schema({
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'Organizer'
  },
  title: String,
  description: String,
  location: String,
  difficultyLevel: String,
  trailLengthKm: Number,
  elevationGainM: Number,
  maxParticipants: Number,
  dates: {
    start: String,
    end: String
  },
  price: Number,
  itinerary: String,
  thumbnail: String,
  photos: [String],
  joiners: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      paid: {
        type: Boolean,
        default: false
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
      joinedAt: {
        type: String,
        default: new Date().toISOString()
      }
    }
  ],
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: String,
    default: new Date().toISOString()
  }
});

export default model('Event', eventSchema);
