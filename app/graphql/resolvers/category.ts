import { UserInputError } from 'apollo-server';

import CategoryService from '../../services/category.service';
import { checkAuth } from '../../utils/auth.util';
import { validateCategory } from '../../middleware/validator.middleware';

export default {
  Query: {
    async getAllCategories(_, __, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const categories = await CategoryService.getAllCategories();

        return categories;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async getCategoriesBy(_, { params }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const categories = await CategoryService.getCategoriesBy({ ...params });

        return categories;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async getCategory(_, { id }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const category = await CategoryService.getCategory({ id });

        return category;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    async createCategory(_, { payload }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const { valid, errors } = validateCategory(payload);

        if (!valid) {
          throw new UserInputError('Errors', { errors });
        }

        const response = await CategoryService.createCategory({
          ...payload,
          creator: user.id,
        });

        if (response) {
          return await CategoryService.getCategory({ name: payload.name });
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async updateCategory(_, { category, id }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const response = await CategoryService.updateCategory(
          { ...category },
          id
        );

        if (response) {
          return await CategoryService.getCategory({ id });
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async deleteCategory(_, { id }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const response = await CategoryService.deleteCategory(id);

        if (response) {
          return await CategoryService.getAllCategories();
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
