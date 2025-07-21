const { model, Schema } = require('mongoose');

const chatRoomSchema = new Schema({
  type: {
    type: String,
    enum: ['group', 'private'],
    required: true
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: function () {
      return this.type === 'group';
    }
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  messages: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      content: {
        type: String,
        required: true
      },
      files: [
        {
          type: String
        }
      ],
      readBy: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      sentAt: {
        type: String,
        default: new Date().toISOString()
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

export default model('ChatRoom', chatRoomSchema);
