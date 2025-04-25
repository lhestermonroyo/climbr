const { model, Schema } = require('mongoose');

const chatRoomSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: function () {
      return this.type === 'group';
    }
  },
  joiners: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
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
      createdAt: {
        type: String,
        default: new Date().toISOString()
      }
    }
  ],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
});

export default model('ChatRoom', chatRoomSchema);
