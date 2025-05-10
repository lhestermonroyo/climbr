import Event from '../../models/Event';
import { eventSchema } from '../../middleware/validator.middleware';
import { ContextType, EventInput, Joiner } from '../../types';
import { populateEvent } from '../../utils/populate.util';

export default {
  Mutation: {
    async createEvent(
      _: {},
      { orgId, eventInput }: { orgId: string; eventInput: EventInput },
      ctx: ContextType
    ) {
      try {
        await eventSchema.validate(eventInput, {
          abortEarly: false
        });

        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const {
          title,
          description,
          location,
          difficultyLevel,
          trailLengthKm,
          elevationGainM,
          maxParticipants,
          dates,
          price,
          itinerary,
          thumbnail,
          photos
        } = eventInput;

        const newEvent = new Event({
          organizer: orgId,
          title,
          description,
          location,
          difficultyLevel,
          trailLengthKm,
          elevationGainM,
          maxParticipants,
          dates,
          price,
          itinerary,
          thumbnail,
          photos
        });
        const response = await newEvent.save();
        await response.populate(populateEvent);

        return {
          id: response._id,
          ...response.toObject()
        };
      } catch (error) {
        console.log('Error creating event:', error);
        throw error;
      }
    },
    async updateEvent(
      _: {},
      { eventId, eventInput }: { eventId: string; eventInput: EventInput },
      ctx: ContextType
    ) {
      try {
        await eventSchema.validate(eventInput, {
          abortEarly: false
        });

        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const {
          title,
          description,
          location,
          difficultyLevel,
          trailLengthKm,
          elevationGainM,
          maxParticipants,
          dates,
          price,
          itinerary,
          thumbnail,
          photos
        } = eventInput;

        const updatedEvent = await Event.findByIdAndUpdate(
          eventId,
          {
            title,
            description,
            location,
            difficultyLevel,
            trailLengthKm,
            elevationGainM,
            maxParticipants,
            dates,
            price,
            itinerary,
            thumbnail,
            photos
          },
          { new: true }
        ).populate(populateEvent);

        if (!updatedEvent) {
          throw new Error('Event not found');
        }

        return {
          id: updatedEvent._id,
          ...updatedEvent.toObject()
        };
      } catch (error) {
        console.log('Error updating event:', error);
        throw error;
      }
    },
    async cancelEvent(
      _: {},
      { eventId }: { eventId: string },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const canceledEvent = await Event.findByIdAndUpdate(
          eventId,
          { status: 'canceled' },
          { new: true }
        ).populate(populateEvent);

        if (!canceledEvent) {
          throw new Error('Event not found');
        }

        return {
          id: canceledEvent._id,
          ...canceledEvent.toObject()
        };
      } catch (error) {
        console.log('Error canceling event:', error);
        throw error;
      }
    },
    async setEventArchiveStatus(
      _: {},
      { eventId, isArchived }: { eventId: string; isArchived: boolean },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const archivedEvent = await Event.findByIdAndUpdate(
          eventId,
          { isArchived },
          { new: true }
        ).populate(populateEvent);

        if (!archivedEvent) {
          throw new Error('Event not found');
        }

        return {
          id: archivedEvent._id,
          ...archivedEvent.toObject()
        };
      } catch (error) {
        console.log('Error archiving/unarchiving event:', error);
        throw error;
      }
    },
    async addJoiners(
      _: {},
      { eventId, userIds }: { eventId: string; userIds: string[] },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const event = await Event.findById(eventId);

        if (!event) {
          throw new Error('Event not found');
        }

        if (event.joiners.length + userIds.length > event.maxParticipants) {
          throw new Error('Exceeding maximum participants');
        }

        // check if some user already joined
        const alreadyJoined = event.joiners.some((joiner: Joiner) =>
          userIds.includes(joiner.user.id.toString())
        );
        if (alreadyJoined) {
          throw new Error('Some users already joined the event');
        }

        const updatedEvent = await Event.findByIdAndUpdate(
          eventId,
          {
            $addToSet: {
              joiners: {
                $each: {
                  $map: (userId: string) => ({
                    user: userId,
                    paid: false,
                    status: 'pending'
                  }),
                  userIds
                }
              }
            }
          },
          { new: true }
        ).populate(populateEvent);

        if (!updatedEvent) {
          throw new Error('Event not found');
        }

        return {
          id: updatedEvent._id,
          ...updatedEvent.toObject()
        };
      } catch (error) {
        console.log('Error adding joiners:', error);
        throw error;
      }
    },
    async removeJoiners(
      _: {},
      { eventId, userIds }: { eventId: string; userIds: string[] },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const event = await Event.findById(eventId);

        if (!event) {
          throw new Error('Event not found');
        }

        const updatedEvent = await Event.findByIdAndUpdate(
          eventId,
          {
            $pull: {
              joiners: {
                $in: userIds.map((userId) => ({
                  user: userId
                }))
              }
            }
          },
          { new: true }
        ).populate(populateEvent);

        if (!updatedEvent) {
          throw new Error('Event not found');
        }

        return {
          id: updatedEvent._id,
          ...updatedEvent.toObject()
        };
      } catch (error) {
        console.log('Error removing joiners:', error);
        throw error;
      }
    },
    async updateJoinerStatus(
      _: {},
      {
        eventId,
        userId,
        status
      }: { eventId: string; userId: string; status: string },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const updatedEvent = await Event.findOneAndUpdate(
          {
            _id: eventId,
            'joiners.user': userId
          },
          {
            $set: {
              'joiners.$.status': status
            }
          },
          { new: true }
        ).populate(populateEvent);

        if (!updatedEvent) {
          throw new Error('Event not found');
        }

        return {
          id: updatedEvent._id,
          ...updatedEvent.toObject()
        };
      } catch (error) {
        console.log('Error updating joiner status:', error);
        throw error;
      }
    },
    async updateJoinerPayment(
      _: {},
      {
        eventId,
        userId,
        paid
      }: { eventId: string; userId: string; paid: boolean },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const updatedEvent = await Event.findOneAndUpdate(
          {
            _id: eventId,
            'joiners.user': userId
          },
          {
            $set: {
              'joiners.$.paid': paid
            }
          },
          { new: true }
        ).populate(populateEvent);

        if (!updatedEvent) {
          throw new Error('Event not found');
        }

        return {
          id: updatedEvent._id,
          ...updatedEvent.toObject()
        };
      } catch (error) {
        console.log('Error updating joiner payment:', error);
        throw error;
      }
    }
  },
  Query: {
    async getEventsByOrganizer(
      _: {},
      { orgId }: { orgId: string },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const events = await Event.find({ organizer: orgId })
          .populate(populateEvent)
          .sort({ createdAt: -1 });

        if (!events.length) {
          throw new Error('Events not found');
        }

        return events.map((event) => ({
          id: event._id,
          ...event.toObject()
        }));
      } catch (error) {
        console.log('Error fetching events:', error);
        throw error;
      }
    },
    getEventsJoinedByUser: async (
      _: {},
      { userId }: { userId: string },
      ctx: ContextType
    ) => {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const events = await Event.find({
          'joiners.user': userId
        })
          .populate(populateEvent)
          .sort({ createdAt: -1 });

        if (!events.length) {
          throw new Error('Events not found');
        }

        return events.map((event) => ({
          id: event._id,
          ...event.toObject()
        }));
      } catch (error) {
        console.log('Error fetching joined events:', error);
        throw error;
      }
    },
    async getEventById(
      _: {},
      { eventId }: { eventId: string },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const event = await Event.findById(eventId).populate(populateEvent);

        if (!event) {
          throw new Error('Event not found');
        }

        return {
          id: event._id,
          ...event.toObject()
        };
      } catch (error) {
        console.log('Error fetching event:', error);
        throw error;
      }
    }
  }
};
