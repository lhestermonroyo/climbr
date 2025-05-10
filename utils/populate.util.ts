const sessionUserProj = '_id email firstName lastName avatar';
const organizerProj = '_id name logo createdAt';

const populateOrganizer = [
  {
    path: 'members.user',
    select: sessionUserProj
  }
];

const populateEvent = [
  {
    path: 'organizer',
    select: organizerProj
  },
  {
    path: 'joiners.user',
    select: sessionUserProj
  }
];

export { populateOrganizer, populateEvent };
