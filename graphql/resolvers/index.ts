import userResolver from './user';

export default {
  Mutation: {
    ...userResolver.Mutation
  },
  Query: {
    ...userResolver.Query
  }
};
