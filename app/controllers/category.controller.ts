import { validationResult } from 'express-validator';

import CategoryService from '../services/category.service';

class CategoryController {
  async getCategories(req: any, res: any) {
    try {
      const categories: any = await CategoryService.getAllCategories();

      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getCategory(req: any, res: any) {
    try {
      const { id } = req.params;
      const category: any = await CategoryService.getCategory({ id });

      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new CategoryController();
