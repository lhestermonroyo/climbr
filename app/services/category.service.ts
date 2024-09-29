import CategoryModel from '../models/category.model';

class CategoryService {
  async getAllCategories() {
    try {
      return await CategoryModel.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getCategories(params: any) {
    try {
      return await CategoryModel.find(params);
    } catch (error) {
      throw error;
    }
  }

  async getCategory(params: any) {
    try {
      return await CategoryModel.findOne(params);
    } catch (error) {
      throw error;
    }
  }

  async createCategory(category: any) {
    try {
      return await CategoryModel.create(category);
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(params: any, id: string) {
    try {
      return await CategoryModel.update(params, id);
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      return await CategoryModel.delete(id);
    } catch (error) {
      throw error;
    }
  }
}

export default new CategoryService();
