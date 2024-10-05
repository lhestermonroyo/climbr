import { UserInputError } from 'apollo-server';

import BrandService from '../../services/brand.service';
import { checkAuth } from '../../utils/auth.util';
import { validateBrand } from '../../middleware/validator.middleware';

export default {
  Query: {
    async getAllBrands(_, __, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const brands = await BrandService.getAllBrands();

        return brands;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async getBrandsBy(_, { params }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const brands = await BrandService.getBrandsBy({ ...params });

        return brands;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async getBrand(_, { id }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const brand = await BrandService.getBrand({ id });

        return brand;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    async createBrand(_, { payload }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        if (user.role !== 'admin') {
          throw new Error('Permission denied.');
        }

        const { valid, errors } = validateBrand(payload);

        if (!valid) {
          throw new UserInputError('Errors', { errors });
        }

        const response = await BrandService.createBrand({
          ...payload,
          creator: user.username,
        });

        if (response) {
          const brand = await BrandService.getBrand({ name: payload.name });

          return brand;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async updateBrand(_, { id, payload }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        if (user.role !== 'admin') {
          throw new Error('Permission denied.');
        }

        const response = await BrandService.updateBrand(
          { ...payload, creator: user.username },
          id
        );

        if (response) {
          const brand = await BrandService.getBrand({ id });

          return brand;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async deleteBrand(_, { id }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        if (user.role !== 'admin') {
          throw new Error('Permission denied.');
        }

        const response = await BrandService.deleteBrand(id);

        if (response) {
          return await BrandService.getAllBrands();
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
