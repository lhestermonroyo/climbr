import express from 'express';

import BrandController from '../controllers/brand.controller';
import { createBrandValidator } from '../middleware/validator.middleware';
import { checkAuth } from '../utils/auth.util';

const router = express.Router();

router.get('/', checkAuth, BrandController.getBrands);
router.get('/:id', checkAuth, BrandController.getBrand);
router.post('/', checkAuth, createBrandValidator, BrandController.createBrand);
router.put('/:id', checkAuth, BrandController.updateBrand);
router.delete('/:id', checkAuth, BrandController.deleteBrand);

export default router;
