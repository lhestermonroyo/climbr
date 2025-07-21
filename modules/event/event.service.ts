import Event from './event.model';
import { EventInput, Joiner } from '../../types';
import { populateEvent } from '../../utils/populate.util';

export default {
  async createEvent(orgId: string, eventInput: EventInput) {
    const newEvent = new Event({
      organizer: orgId,
      ...eventInput
    });
    return await (await newEvent.save()).populate(populateEvent);
  },
  async updateEvent(eventId: string, eventInput: EventInput) {
    const event = await this.getActiveEventById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    Object.assign(event, {
      ...eventInput
    });

    const updatedEvent = await event.save();
    return await updatedEvent.populate(populateEvent);
  },
  async cancelEvent(eventId: string) {
    const event = await this.getActiveEventById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status === 'cancelled') {
      throw new Error('Event is already cancelled');
    }

    event.status = 'cancelled';

    const updatedEvent = await event.save();
    return await updatedEvent.populate(populateEvent);
  },
  async setEventArchiveStatus(eventId: string, isArchived: boolean) {
    const event = await this.getActiveEventById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.isArchived === isArchived) {
      throw new Error('Event already has this archive status');
    }

    event.isArchived = isArchived;

    const updatedEvent = await event.save();
    return await updatedEvent.populate(populateEvent);
  },
  async addJoiners(eventId: string, userIds: string[]) {
    const event = await this.getActiveEventById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    const totalJoiners = event.joiners.length + userIds.length;

    if (totalJoiners > event.maxParticipants) {
      throw new Error('Cannot add joiners: exceeds maximum participants');
    }

    const newJoiners = userIds.map((userId: string) => ({
      user: userId,
      paid: false,
      status: 'active',
      joinedAt: new Date().toISOString()
    }));
    event.joiners.push(...newJoiners);

    const updatedEvent = await event.save();
    return await updatedEvent.populate(populateEvent);
  },
  async removeJoiners(eventId: string, userIds: string[]) {
    const event = await this.getActiveEventById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    event.joiners = event.joiners.filter(
      (joiner: Joiner) => !userIds.includes(joiner.user.toString())
    );
    const updatedEvent = await event.save();
    return await updatedEvent.populate(populateEvent);
  },
  async updateJoinerStatus(eventId: string, userId: string, status: string) {
    const event = await this.getActiveEventById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }
    const joiner = event.joiners.find(
      (joiner: Joiner) => joiner.user.toString() === userId
    );

    if (!joiner) {
      throw new Error('User is not a joiner of this event');
    }

    joiner.status = status;

    const updatedEvent = await event.save();
    return await updatedEvent.populate(populateEvent);
  },
  async updateJoinerPayment(eventId: string, userId: string, paid: boolean) {
    const event = await this.getActiveEventById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    const joiner = event.joiners.find(
      (joiner: Joiner) => joiner.user.toString() === userId
    );

    if (!joiner) {
      throw new Error('User is not a joiner of this event');
    }

    joiner.paid = paid;

    const updatedEvent = await event.save();
    return await updatedEvent.populate(populateEvent);
  },
  async getEventsByOrganizer(orgId: string) {
    return await Event.find({
      organizer: orgId
    })
      .populate(populateEvent)
      .sort({ createdAt: -1 });
  },
  async getEventsByUser(userId: string) {
    return await Event.find({
      'joiners.user': userId
    })
      .populate(populateEvent)
      .sort({ createdAt: -1 });
  },
  async getActiveEventById(id: string) {
    return await Event.findById(id)
      .where({
        isArchived: false
      })
      .populate(populateEvent);
  }
};
