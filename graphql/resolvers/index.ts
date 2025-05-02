import userResolver from './user';
import organizerResolver from './organizer';

export default {
  Mutation: {
    ...userResolver.Mutation,
    ...organizerResolver.Mutation
  },
  Query: {
    ...userResolver.Query,
    ...organizerResolver.Query
  }
};
