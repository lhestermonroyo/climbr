import { UserInputError } from 'apollo-server';

import ShoeService from '../../services/shoe.service';
import { validateCreateShoe } from '../../middleware/validator.middleware';
import { checkAuth } from '../../utils/auth.util';

export default {
  Query: {
    async getAllShoes(_, __, ctx) {},
    async getShoesBy(_, { params }, ctx) {},
    async getShoe(_, { id }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const shoe = await ShoeService.getShoe({ id });

        if (!shoe) {
          throw new Error('Shoe not found.');
        }

        return shoe;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    async createShoe(_, { payload }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const { valid, errors } = validateCreateShoe(payload);

        if (!valid) {
          throw new UserInputError('Errors', { errors });
        }

        if (user.role !== 'admin') {
          throw new Error('Permission denied.');
        }

        const response = await ShoeService.createShoe(payload);

        if (response) {
          // fetch the newly created shoe
          const shoe = await ShoeService.getShoe({ id: payload.name });
          console.log(shoe);
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async updateShoe(_, { id, payload }, ctx) {},
    async deleteShoe(_, { id }, ctx) {},
  },
};
