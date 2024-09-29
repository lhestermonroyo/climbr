import BrandModel from '../models/brand.model';

class BrandService {
  async getAllBrands() {
    try {
      return await BrandModel.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getBrands(params: any) {
    try {
      return await BrandModel.find(params);
    } catch (error) {
      throw error;
    }
  }

  async getBrand(params: any) {
    try {
      return await BrandModel.findOne(params);
    } catch (error) {
      throw error;
    }
  }

  async createBrand(brand: any) {
    try {
      return await BrandModel.create(brand);
    } catch (error) {
      throw error;
    }
  }

  async updateBrand(params: any, id: string) {
    try {
      return await BrandModel.update(params, id);
    } catch (error) {
      throw error;
    }
  }

  async deleteBrand(id: string) {
    try {
      return await BrandModel.delete(id);
    } catch (error) {
      throw error;
    }
  }
}

export default new BrandService();
