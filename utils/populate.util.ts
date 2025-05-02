const sessionUserProj = '_id email firstName lastName avatar';

const populateOrganizer = [
  {
    path: 'members.user',
    select: sessionUserProj
  }
];

export { populateOrganizer };
