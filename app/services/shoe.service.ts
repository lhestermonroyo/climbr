import { v4 as uuidv4 } from 'uuid';

import query from '../lib/db';
import { formatColSet } from '../utils/common.util';

class ShoeService {
  private shoeTable: string;
  private shoeImageTable: string;
  private shoeLinkTable: string;

  constructor() {
    this.shoeTable = 'shoe';
    this.shoeImageTable = 'shoe_image';
    this.shoeLinkTable = 'shoe_link';
  }

  async getShoe(params: any) {
    try {
      const { colSet, values } = formatColSet(params);

      // create a query to select a shoe and join the shoe_image and shoe_link tables
      const sql = `SELECT * FROM ${this.shoeTable} INNER JOIN ${this.shoeImageTable} ON ${this.shoeTable}.id = ${this.shoeImageTable}.shoe_id INNER JOIN ${this.shoeLinkTable} ON ${this.shoeTable}.id = ${this.shoeLinkTable}.shoe_id WHERE ${colSet}`;
      const res = await query(sql, [...values]);
      return res[0] as any;
    } catch (error) {
      throw error;
    }
  }

  async createShoe(shoe: any) {
    try {
      const id = uuidv4();
      const {
        creator,
        brand,
        category,
        name,
        description,
        release_date,
        gender,
        shoe_images,
        shoe_links,
      } = shoe;

      const responses = await Promise.all([
        await query(
          `INSERT INTO ${this.shoeTable} (id, creator, brand, category, name, description, release, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            creator,
            brand,
            category,
            name,
            description,
            release_date,
            gender,
          ]
        ),

        await query(
          `INSERT INTO ${this.shoeImageTable} (shoe_id, image_url) VALUES (?, ?)`,
          shoe_images.map((image_url: any) => [id, image_url])
        ),
        await query(
          `INSERT INTO ${this.shoeLinkTable} (shoe_id, link) VALUES (?, ?)`,
          shoe_links.map((link: any) => [id, link])
        ),
      ]);

      return responses.every((response: any) => response.affectedRows > 0);
    } catch (error) {
      throw error;
    }
  }
}

export default new ShoeService();
