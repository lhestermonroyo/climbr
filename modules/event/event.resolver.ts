import {
  ApolloError,
  AuthenticationError,
  UserInputError
} from 'apollo-server';
import EventService from './event.service';
import { eventSchema } from '../../middleware/validator.middleware';
import { ContextType, EventInput } from '../../types';

export default {
  Mutation: {
    async createEvent(
      _: {},
      { orgId, eventInput }: { orgId: string; eventInput: EventInput },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        await eventSchema.validate(eventInput, {
          abortEarly: false
        });

        const savedEvent = await EventService.createEvent(orgId, eventInput);

        return {
          id: savedEvent._id,
          ...savedEvent.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'EVENT_CREATION_ERROR');
      }
    },
    async updateEvent(
      _: {},
      { eventId, eventInput }: { eventId: string; eventInput: EventInput },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        await eventSchema.validate(eventInput, {
          abortEarly: false
        });

        const updatedEvent = await EventService.updateEvent(
          eventId,
          eventInput
        );

        return {
          id: updatedEvent._id,
          ...updatedEvent.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'EVENT_UPDATE_ERROR');
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
          throw new AuthenticationError('Unauthorized');
        }

        const cancelledEvent = await EventService.cancelEvent(eventId);

        return {
          id: cancelledEvent._id,
          ...cancelledEvent.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'EVENT_CANCELLATION_ERROR');
      }
    },
    async setEventArchiveStatus(
      _: {},
      {
        eventId,
        isArchived
      }: {
        eventId: string;

        isArchived: boolean;
      },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const updatedEvent = await EventService.setEventArchiveStatus(
          eventId,
          isArchived
        );
        return {
          id: updatedEvent._id,
          ...updatedEvent.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'EVENT_ARCHIVE_STATUS_ERROR');
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
          throw new AuthenticationError('Unauthorized');
        }

        if (!Array.isArray(userIds) || userIds.length === 0) {
          throw new UserInputError('User IDs must be a non-empty array');
        }

        const updatedEvent = await EventService.addJoiners(eventId, userIds);

        return {
          id: updatedEvent._id,
          ...updatedEvent.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'EVENT_ADD_JOINERS_ERROR');
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
          throw new AuthenticationError('Unauthorized');
        }

        if (!Array.isArray(userIds) || userIds.length === 0) {
          throw new UserInputError('User IDs must be a non-empty array');
        }

        const updatedEvent = await EventService.removeJoiners(eventId, userIds);

        return {
          id: updatedEvent._id,
          ...updatedEvent.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'EVENT_REMOVE_JOINERS_ERROR');
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
          throw new AuthenticationError('Unauthorized');
        }

        const updatedEvent = await EventService.updateJoinerStatus(
          eventId,
          userId,
          status
        );

        return {
          id: updatedEvent._id,
          ...updatedEvent.toObject()
        };
      } catch (error) {
        throw new ApolloError(
          error.message,
          'EVENT_UPDATE_JOINER_STATUS_ERROR'
        );
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
          throw new AuthenticationError('Unauthorized');
        }

        const updatedEvent = await EventService.updateJoinerPayment(
          eventId,
          userId,
          paid
        );
        return {
          id: updatedEvent._id,
          ...updatedEvent.toObject()
        };
      } catch (error) {
        throw new ApolloError(
          error.message,
          'EVENT_UPDATE_JOINER_PAYMENT_ERROR'
        );
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
          throw new AuthenticationError('Unauthorized');
        }

        const events = await EventService.getEventsByOrganizer(orgId);

        return events.map((event) => ({
          id: event._id,
          ...event.toObject()
        }));
      } catch (error) {
        throw new ApolloError(error.message, 'EVENTS_BY_ORGANIZER_ERROR');
      }
    },
    async getEventsByUser(
      _: {},
      { userId }: { userId: string },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const events = await EventService.getEventsByUser(userId);

        return events.map((event) => ({
          id: event._id,
          ...event.toObject()
        }));
      } catch (error) {
        throw new ApolloError(error.message, 'EVENTS_BY_USER_ERROR');
      }
    },
    async getEventById(_: {}, { id }: { id: string }, ctx: ContextType) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const event = await EventService.getActiveEventById(id);

        if (!event) {
          throw new UserInputError('Event not found');
        }

        return {
          id: event._id,
          ...event.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'EVENT_NOT_FOUND');
      }
    }
  }
};
