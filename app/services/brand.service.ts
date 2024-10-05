import { v4 as uuidv4 } from 'uuid';

import query from '../lib/db';
import { formatColSet } from '../utils/common.util';

class BrandService {
  private tableName: string;

  constructor() {
    this.tableName = 'brand';
  }

  async getAllBrands() {
    try {
      const sql = `SELECT * FROM ${this.tableName} order by created_at desc`;

      return (await query(sql, [])) as any;
    } catch (error) {
      throw error;
    }
  }

  async getBrandsBy(params: any) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${colSet} order by created_at desc`;

      return (await query(sql, [...values])) as any;
    } catch (error) {
      throw error;
    }
  }

  async getBrand(params: any) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${colSet}`;

      const res = await query(sql, [...values]);
      return res[0] as any;
    } catch (error) {
      throw error;
    }
  }

  async createBrand(brand: any) {
    try {
      const id = uuidv4();
      const { creator, name, description, thumbnail } = brand;

      const sql = `INSERT INTO ${this.tableName} (id, creator, name, description, thumbnail) VALUES (?, ?, ?, ?, ?)`;
      const values = [id, creator, name, description, thumbnail];

      const { affectedRows } = (await query(sql, values)) as any;
      return affectedRows || 0;
    } catch (error) {
      throw error;
    }
  }

  async updateBrand(params: any, id: string) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `UPDATE ${this.tableName} SET ${colSet} WHERE id = ?`;
      const { affectedRows } = (await query(sql, [...values, id])) as any;

      return affectedRows || 0;
    } catch (error) {
      throw error;
    }
  }

  async deleteBrand(id: string) {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
      const { affectedRows } = (await query(sql, [id])) as any;

      return affectedRows || 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new BrandService();
