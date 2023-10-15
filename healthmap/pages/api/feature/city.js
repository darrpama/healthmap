import conn from '../../../lib/db';
import express from 'express';

const router = express.Router();

router.get('/api/feature/city', async (req, res) => {
  try {
    const query = `
      SELECT
        c.id AS city_id,
        c.name AS city_name,
        c.area AS city_area,
        COUNT(CASE WHEN f.type = 'positive' THEN 1 END) AS total_positive_amount,
        COUNT(CASE WHEN f.type = 'negative' THEN 1 END) AS total_negative_amount,
        COUNT(DISTINCT d.id) AS total_districts,
        COUNT(DISTINCT CASE WHEN f.type = 'positive' THEN d.id END) AS positive_total_districts,
        COUNT(DISTINCT CASE WHEN f.type = 'negative' THEN d.id END) AS negative_total_districts,
        COUNT(CASE WHEN f.type = 'park' AND f.type = 'negative' THEN 1 END) AS park_negative_amount
      FROM cities AS c
      LEFT JOIN districts AS d ON c.id = d.city_id
      LEFT JOIN factors AS f ON d.id = f.district_id
      GROUP BY c.id;
    `;
    const result = await conn.query(query);
    const data = result.rows.map(row => ({
      id: row.city_id,
      name: row.city_name,
      area: row.city_area,
      total_positive_amount: row.total_positive_amount,
      total_negative_amount: row.total_negative_amount,
      total_districts: row.total_districts,
      positive_total_districts: row.positive_total_districts,
      negative_total_districts: row.negative_total_districts,
      park_negative_amount: row.park_negative_amount
    }));
    res.status(200).json(data);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
