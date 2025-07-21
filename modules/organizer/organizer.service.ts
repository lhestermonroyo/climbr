import { UserInputError } from 'apollo-server';
import Organizer from './organizer.model';
import { populateOrganizer } from '../../utils/populate.util';
import { MemberType, OrganizerInput, RoleType } from '../../types';

export default {
  async createOrganizer(adminId: string, organizerInput: OrganizerInput) {
    const organizer = await this.getActiveOrganizerByName(organizerInput.name);

    if (organizer) {
      throw new UserInputError('Organizer already exists');
    }

    const newOrganizer = new Organizer({
      ...organizerInput,
      members: [
        {
          user: adminId,
          role: 'admin'
        }
      ]
    });
    return await (await newOrganizer.save()).populate(populateOrganizer);
  },
  async updateOrganizer(orgId: string, organizerInput: OrganizerInput) {
    const organizer = await this.getActiveOrganizerById(orgId);

    if (!organizer) {
      throw new Error('Organizer not found');
    }

    if (organizer.name !== name) {
      const existingOrganizer = await this.getActiveOrganizerByName(name);

      if (existingOrganizer) {
        throw new UserInputError('Organizer with this name already exists');
      }
    }

    Object.assign(organizer, {
      ...organizerInput
    });

    const updatedOrganizer = await organizer.save();
    return await updatedOrganizer.populate(populateOrganizer);
  },
  async setOrganizerArchiveStatus(orgId: string, isArchived: boolean) {
    const organizer = await this.getActiveOrganizerById(orgId);

    if (!organizer) {
      throw new Error('Organizer not found');
    }

    if (organizer.isArchived === isArchived) {
      throw new Error('Organizer already has this archive status');
    }

    organizer.isArchived = isArchived;

    const updatedOrganizer = await organizer.save();
    return await updatedOrganizer.populate(populateOrganizer);
  },
  async addMember(orgId: string, userId: string, role: string) {
    const organizer = await this.getActiveOrganizerById(orgId);

    if (!organizer) {
      throw new Error('Organizer not found');
    }

    const existingMember = organizer.members.find(
      (member: MemberType) => member.user.toString() === userId
    );

    if (existingMember) {
      throw new Error('User is already a member of the organizer');
    }

    organizer.members.push({
      user: userId,
      role
    });

    const updatedOrganizer = await organizer.save();
    return await updatedOrganizer.populate(populateOrganizer);
  },
  async updateMemberRole(orgId: string, userId: string, role: RoleType) {
    const organizer = await this.getActiveOrganizerById(orgId);

    if (!organizer) {
      throw new Error('Organizer not found');
    }

    const member = organizer.members.find(
      (member: MemberType) => member.user.toString() === userId
    );

    if (!member) {
      throw new Error('User is not a member of the organizer');
    }

    member.role = role;

    const updatedOrganizer = await organizer.save();
    return await updatedOrganizer.populate(populateOrganizer);
  },
  async removeMember(orgId: string, userId: string) {
    const organizer = await this.getActiveOrganizerById(orgId);

    if (!organizer) {
      throw new Error('Organizer not found');
    }

    const memberIndex = organizer.members.findIndex(
      (member: MemberType) => member.user.toString() === userId
    );

    if (memberIndex === -1) {
      throw new Error('User is not a member of the organizer');
    }

    organizer.members.splice(memberIndex, 1);

    const updatedOrganizer = await organizer.save();
    return await updatedOrganizer.populate(populateOrganizer);
  },
  async getActiveOrganizersByUser(userId: string) {
    return await Organizer.find({
      members: {
        $elemMatch: {
          user: userId
        }
      },
      isArchived: false
    })
      .populate(populateOrganizer)
      .sort({ createdAt: -1 });
  },
  async getActiveOrganizerByName(name: string) {
    return (
      await Organizer.findOne({ name }).where({ isArchived: false })
    ).populate(populateOrganizer);
  },
  async getActiveOrganizerById(id: string) {
    return (await Organizer.findById(id).where({ isArchived: false })).populate(
      populateOrganizer
    );
  }
};
