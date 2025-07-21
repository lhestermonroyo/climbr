import {
  ApolloError,
  AuthenticationError,
  UserInputError
} from 'apollo-server';
import OrganizerService from './organizer.service';
import { organizerSchema } from '../../middleware/validator.middleware';
import { ContextType, OrganizerInput, RoleType } from '../../types';

export default {
  Mutation: {
    async createOrganizer(
      _: {},
      { organizerInput }: { organizerInput: OrganizerInput },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        await organizerSchema.validate(organizerInput, {
          abortEarly: false
        });

        const savedOrganizer = await OrganizerService.createOrganizer(
          authUser._id,
          organizerInput
        );

        return {
          id: savedOrganizer._id,
          ...savedOrganizer.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'ORGANIZER_CREATION_ERROR');
      }
    },
    async updateOrganizer(
      _: {},
      {
        orgId,
        organizerInput
      }: { orgId: string; organizerInput: OrganizerInput },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        await organizerSchema.validate(organizerInput, {
          abortEarly: false
        });

        const updatedOrganizer = await OrganizerService.updateOrganizer(
          orgId,
          organizerInput
        );

        return {
          id: updatedOrganizer._id,
          ...updatedOrganizer.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'ORGANIZER_UPDATE_ERROR');
      }
    },
    async setOrganizerArchiveStatus(
      _: {},
      { orgId, isArchived }: { orgId: string; isArchived: boolean },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const archivedOrganizer =
          await OrganizerService.setOrganizerArchiveStatus(orgId, isArchived);

        return {
          id: archivedOrganizer._id,
          ...archivedOrganizer.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'ORGANIZER_ARCHIVE_STATUS_ERROR');
      }
    },
    async addMember(
      _: {},
      {
        orgId,
        userId,
        role
      }: { orgId: string; userId: string; role: RoleType },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const updatedOrganizer = await OrganizerService.addMember(
          orgId,
          userId,
          role
        );

        return {
          id: updatedOrganizer._id,
          ...updatedOrganizer.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'ORGANIZER_ADD_MEMBER_ERROR');
      }
    },
    async updateMemberRole(
      _: {},
      {
        orgId,
        userId,
        role
      }: { orgId: string; userId: string; role: RoleType },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const updatedOrganizer = await OrganizerService.updateMemberRole(
          orgId,
          userId,
          role
        );

        return {
          id: updatedOrganizer._id,
          ...updatedOrganizer.toObject()
        };
      } catch (error) {
        console.error('Error updating member role:', error);
        throw error;
      }
    },
    async removeMember(
      _: {},
      { orgId, userId }: { orgId: string; userId: string },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const updatedOrganizer = await OrganizerService.removeMember(
          orgId,
          userId
        );

        return {
          id: updatedOrganizer._id,
          ...updatedOrganizer.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'ORGANIZER_REMOVE_MEMBER_ERROR');
      }
    }
  },
  Query: {
    async getOrganizersByUser(
      _: {},
      { userId }: { userId: string },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const organizers = await OrganizerService.getActiveOrganizersByUser(
          userId
        );

        if (!organizers) {
          throw new UserInputError('Organizer not found');
        }

        return organizers;
      } catch (error) {
        throw new ApolloError(error.message, 'ORGANIZERS_BY_USER_ERROR');
      }
    },
    async getOrganizerById(
      _: {},
      { orgId }: { orgId: string },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new AuthenticationError('Unauthorized');
        }

        const organizer = await OrganizerService.getActiveOrganizerById(orgId);

        if (!organizer) {
          throw new UserInputError('Organizer not found');
        }

        return {
          id: organizer._id,
          ...organizer.toObject()
        };
      } catch (error) {
        throw new ApolloError(error.message, 'ORGANIZER_BY_ID_ERROR');
      }
    }
  }
};
