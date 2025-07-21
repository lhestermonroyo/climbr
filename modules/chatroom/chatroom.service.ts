import { UserInputError } from 'apollo-server';
import ChatRoom from './chatroom.model';
import EventService from '../event/event.service';
import { populateChatRoom } from '../../utils/populate.util';
import { MessageInput } from '../../types';

export default {
  async createChatRoom(eventId: string) {
    const requests = [
      EventService.getActiveEventById(eventId),
      this.getActiveChatRoomById(eventId)
    ];

    const [event, chatroom] = await Promise.all(requests);

    if (!event) {
      throw new UserInputError('Event not found');
    }

    if (chatroom) {
      throw new UserInputError('Chat room already exists for this event');
    }

    const participants = event.joiners.map((participant) => participant.user);

    if (!eventId || !Array.isArray(participants) || participants.length === 0) {
      throw new UserInputError('Invalid input');
    }

    const newChatRoom = new ChatRoom({
      event: eventId,
      participants
    });

    return await (await newChatRoom.save()).populate(populateChatRoom);
  },
  async setChatRoomArchiveStatus(chatRoomId: string, isArchived: boolean) {
    const chatRoom = await this.getActiveChatRoomById(chatRoomId);

    if (!chatRoom) {
      throw new UserInputError('Chat room not found');
    }

    if (chatRoom.isArchived === isArchived) {
      throw new UserInputError('Chat room already has this archive status');
    }

    chatRoom.isArchived = isArchived;

    const updatedChatRoom = await chatRoom.save();
    return await updatedChatRoom.populate(populateChatRoom);
  },
  async sendMessage(
    chatRoomId: string,
    sender: string,
    messageInput: MessageInput
  ) {
    const chatRoom = await this.getActiveChatRoomById(chatRoomId);

    if (!chatRoom) {
      throw new UserInputError('Chat room not found');
    }

    const { content, files } = messageInput;

    if (!content && (!files || files.length === 0)) {
      throw new UserInputError('Message content or files must be provided');
    }

    const message = {
      sender,
      content,
      files: files || [],
      readBy: []
    };
    chatRoom.messages.push(message);

    const updatedChatRoom = await chatRoom.save();
    const newMessage =
      updatedChatRoom.messages[updatedChatRoom.messages.length - 1];
    return {
      id: newMessage._id,
      ...newMessage.toObject()
    };
  },
  async markMessageAsRead(
    chatRoomId: string,
    messageId: string,
    userId: string
  ) {
    const chatRoom = await this.getActiveChatRoomById(chatRoomId);

    if (!chatRoom) {
      throw new UserInputError('Chat room not found');
    }

    const message = chatRoom.messages.id(messageId);

    if (!message) {
      throw new UserInputError('Message not found');
    }

    if (message.readBy.includes(userId)) {
      throw new UserInputError('Message already marked as read by this user');
    }

    message.readBy.push(userId);
    await chatRoom.save();

    return chatRoom.populate(populateChatRoom);
  },
  async getActiveChatRoomByEventId(eventId: string) {
    return await ChatRoom.find({
      event: eventId,
      type: 'group',
      isArchived: false
    }).populate(populateChatRoom);
  },
  async getActiveChatRoomById(chatRoomId: string) {
    return await ChatRoom.findOne({
      _id: chatRoomId,
      isArchived: false
    }).populate(populateChatRoom);
  }
};
