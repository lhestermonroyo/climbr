import Event from '../../models/Event';
import { eventSchema } from '../../middleware/validator.middleware';
import { ContextType, EventInput, JoinerInput } from '../../types';
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
    }
    // async addJoiners(
    //   _: {},
    //   {
    //     eventId,
    //     joinersInput
    //   }: { eventId: string; joinersInput: JoinerInput[] },
    //   ctx: ContextType
    // ) {
    //   try {
    //     const { authUser } = ctx;

    //     if (!authUser) {
    //       throw new Error('Unauthorized');
    //     }

    //     const event = await Event.findById(eventId);

    //     if (!event) {
    //       throw new Error('Event not found');
    //     }

    //     if (
    //       event.joiners.length + joinersInput.length >
    //       event.maxParticipants
    //     ) {
    //       throw new Error('Exceeding maximum participants');
    //     }

    //     // check if some user already joined
    //     const alreadyJoined = event.joiners.some((joiner) =>
    //       userIds.includes(joiner.user.toString())
    //     );
    //     if (alreadyJoined) {
    //       throw new Error('Some users already joined the event');
    //     }

    //     const updatedEvent = await Event.findByIdAndUpdate(
    //       eventId,
    //       { $addToSet: { joiners: { $each: userIds } } },
    //       { new: true }
    //     ).populate(populateEvent);

    //     if (!updatedEvent) {
    //       throw new Error('Event not found');
    //     }

    //     return {
    //       id: updatedEvent._id,
    //       ...updatedEvent.toObject()
    //     };
    //   } catch (error) {
    //     console.log('Error adding joiners:', error);
    //     throw error;
    //   }
    // },
    // async removeJoiners(
    //   _: {},
    //   { eventId, userIds }: { eventId: string; userIds: string[] },
    //   ctx: ContextType
    // ) {
    //   try {
    //     const { authUser } = ctx;

    //     if (!authUser) {
    //       throw new Error('Unauthorized');
    //     }

    //     const event = await Event.findById(eventId);

    //     if (!event) {
    //       throw new Error('Event not found');
    //     }

    //     const updatedEvent = await Event.findByIdAndUpdate(
    //       eventId,
    //       { $pull: { joiners: { $in: userIds } } },
    //       { new: true }
    //     ).populate(populateEvent);

    //     if (!updatedEvent) {
    //       throw new Error('Event not found');
    //     }

    //     return {
    //       id: updatedEvent._id,
    //       ...updatedEvent.toObject()
    //     };
    //   } catch (error) {
    //     console.log('Error removing joiners:', error);
    //     throw error;
    //   }
    // }
  },
  Query: {}
};
