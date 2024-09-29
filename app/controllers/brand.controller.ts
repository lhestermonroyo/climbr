import { validationResult } from 'express-validator';

import BrandService from '../services/brand.service';

class BrandController {
  async getBrands(req: any, res: any) {
    try {
      const brands: any = await BrandService.getAllBrands();

      return res.status(200).json(brands);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getBrand(req: any, res: any) {
    try {
      const { id } = req.params;
      const brand: any = await BrandService.getBrand({ id });

      return res.status(200).json(brand);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createBrand(req: any, res: any) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, role } = req.user;

      if (role !== 'admin') {
        return res
          .status(403)
          .json({ message: 'You are not authorized to create a brand.' });
      }

      const brand = req.body;

      const response = await BrandService.createBrand({
        creator: username,
        ...brand,
      });

      if (response) {
        return res.status(201).json({ message: 'Brand created successfully.' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateBrand(req: any, res: any) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { role } = req.user;

      if (role !== 'admin') {
        return res
          .status(403)
          .json({ message: 'You are not authorized to update a brand.' });
      }

      const { username } = req.user;
      const { id } = req.params;
      const brand = req.body;

      const response = await BrandService.updateBrand(
        { creator: username, ...brand },
        id
      );

      if (response) {
        return res.status(200).json({ message: 'Brand updated successfully.' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteBrand(req: any, res: any) {
    try {
      const { id } = req.params;

      const response = await BrandService.deleteBrand(id);

      if (response) {
        return res.status(200).json({ message: 'Brand deleted successfully.' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new BrandController();
