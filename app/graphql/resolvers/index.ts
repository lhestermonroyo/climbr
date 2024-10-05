import userResolver from './user';
import brandResolver from './brand';
import categoryResolver from './category';
import shoeResolver from './shoe';

export default {
  Query: {
    ...userResolver.Query,
    ...brandResolver.Query,
    ...categoryResolver.Query,
    ...shoeResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...brandResolver.Mutation,
    ...categoryResolver.Mutation,
    ...shoeResolver.Mutation,
  },
};
