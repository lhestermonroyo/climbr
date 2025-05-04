import Organizer from '../../models/Organizer';
import { organizerSchema } from '../../middleware/validator.middleware';
import { populateOrganizer } from '../../utils/populate.util';
import { ContextType, OrganizerInput, RoleType } from '../../types';

export default {
  Mutation: {
    async createOrganizer(
      _: {},
      { organizerInput }: { organizerInput: OrganizerInput },
      ctx: ContextType
    ) {
      try {
        await organizerSchema.validate(organizerInput, {
          abortEarly: false
        });

        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const { name, description, logo, cover, phone, email, socials } =
          organizerInput;

        const organizer = await Organizer.findOne({ name });

        if (organizer) {
          throw new Error('Organizer already exists');
        }

        const newOrganizer = new Organizer({
          name,
          description,
          logo,
          cover,
          phone,
          email,
          socials,
          members: [
            {
              user: authUser._id,
              role: 'admin'
            }
          ]
        });
        const response = await newOrganizer.save();
        await response.populate(populateOrganizer);

        return {
          id: response._id,
          ...response.toObject()
        };
      } catch (error) {
        throw error;
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
        await organizerSchema.validate(organizerInput, {
          abortEarly: false
        });

        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const { name, description, logo, cover, phone, email, socials } =
          organizerInput;

        const organizer = await Organizer.findById(orgId);

        if (!organizer) {
          throw new Error('Organizer not found');
        }

        const updatedOrganizer = await Organizer.findByIdAndUpdate(
          orgId,
          {
            name,
            description,
            logo,
            cover,
            phone,
            email,
            socials
          },
          { new: true }
        );
        await updatedOrganizer.save();
        await updatedOrganizer.populate(populateOrganizer);

        return {
          id: updatedOrganizer._id,
          ...updatedOrganizer.toObject()
        };
      } catch (error) {
        throw error;
      }
    },
    async archiveOrganizer(
      _: {},
      { orgId }: { orgId: string },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const organizer = await Organizer.findById(orgId);

        if (!organizer) {
          throw new Error('Organizer not found');
        }

        const isAdmin = organizer.members.some(
          (member) =>
            member.user.toString() === authUser._id.toString() &&
            member.role === 'admin'
        );

        if (!isAdmin) {
          throw new Error(
            'Unauthorized: Only admins can archive the organizer'
          );
        }

        organizer.isArchived = true;
        await organizer.save();
        await organizer.populate(populateOrganizer);

        return {
          id: organizer._id,
          ...organizer.toObject()
        };
      } catch (error) {
        throw error;
      }
    },
    async unarchiveOrganizer(
      _: {},
      { orgId }: { orgId: string },
      ctx: ContextType
    ) {
      try {
        const { authUser } = ctx;

        if (!authUser) {
          throw new Error('Unauthorized');
        }

        const organizer = await Organizer.findById(orgId);

        if (!organizer) {
          throw new Error('Organizer not found');
        }

        const isAdmin = organizer.members.some(
          (member) =>
            member.user.toString() === authUser._id.toString() &&
            member.role === 'admin'
        );

        if (!isAdmin) {
          throw new Error(
            'Unauthorized: Only admins can unarchive the organizer'
          );
        }

        organizer.isArchived = false;
        await organizer.save();
        await organizer.populate(populateOrganizer);

        return {
          id: organizer._id,
          ...organizer.toObject()
        };
      } catch (error) {
        throw error;
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
          throw new Error('Unauthorized');
        }

        const organizer = await Organizer.findById(orgId);

        if (!organizer) {
          throw new Error('Organizer not found');
        }

        const memberExists = organizer.members.find(
          (member) => member.user.toString() === userId
        );

        if (memberExists) {
          throw new Error('User is already a member of this organizer');
        }

        organizer.members.push({ user: userId, role });
        await organizer.save();
        await organizer.populate(populateOrganizer);

        return {
          id: organizer._id,
          ...organizer.toObject()
        };
      } catch (error) {
        throw error;
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
        const organizer = await Organizer.findById(orgId);

        if (!organizer) {
          throw new Error('Organizer not found');
        }

        const member = organizer.members.find(
          (member) => member.user.toString() === userId
        );

        if (!member) {
          throw new Error('User is not a member of this organizer');
        }

        member.role = role;
        await organizer.save();
        await organizer.populate(populateOrganizer);

        return {
          id: organizer._id,
          ...organizer.toObject()
        };
      } catch (error) {
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
          throw new Error('Unauthorized');
        }

        const organizer = await Organizer.findById(orgId);

        if (!organizer) {
          throw new Error('Organizer not found');
        }

        const memberIndex = organizer.members.findIndex(
          (member) => member.user.toString() === userId
        );

        if (memberIndex === -1) {
          throw new Error('User is not a member of this organizer');
        }

        organizer.members.splice(memberIndex, 1);
        await organizer.save();
        await organizer.populate(populateOrganizer);

        return {
          id: organizer._id,
          ...organizer.toObject()
        };
      } catch (error) {
        throw error;
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
          throw new Error('Unauthorized');
        }

        const organizers = await Organizer.find({
          'members.user': userId
        })
          .populate(populateOrganizer)
          .sort({ createdAt: -1 });

        if (!organizers.length) {
          throw new Error('Organizers not found');
        }

        return organizers;
      } catch (error) {
        throw error;
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
          throw new Error('Unauthorized');
        }

        const organizer = await Organizer.findById(orgId).populate(
          populateOrganizer
        );

        if (!organizer) {
          throw new Error('Organizer not found');
        }

        return {
          id: organizer._id,
          ...organizer.toObject()
        };
      } catch (error) {
        throw error;
      }
    }
  }
};
