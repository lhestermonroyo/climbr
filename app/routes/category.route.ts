import express from 'express';

import { checkAuth } from '../utils/auth.util';
import { createCategoryValidator } from '../middleware/validator.middleware';

// import CategoryController from '../controllers/category.controller';

const router = express.Router();

// router.get('/', checkAuth, CategoryController.getCategories);
// router.get('/:id', checkAuth, CategoryController.getCategory);
// router.post('/', checkAuth, createCategoryValidator, CategoryController.createCategory);
// router.put('/:id', checkAuth, createCategoryValidator, CategoryController.updateCategory);
// router.delete('/:id', checkAuth, CategoryController.deleteCategory);

export default router;
