import conn from '../../../lib/db';
import express from 'express';

const router = express.Router();

router.get('/api/feature/district', async (req, res) => {
  try {
    const query = `
      SELECT
        c.id AS city_id,
        c.name AS city_name,
        c.area AS city_area,
        d.id AS district_id,
        d.name AS district_name,
        d.area,
        COUNT(CASE WHEN f.type = 'positive' THEN 1 END) AS total_positive_amount,
        COUNT(CASE WHEN f.type = 'negative' THEN 1 END) AS total_negative_amount,
        COUNT(CASE WHEN f.type = 'negative' AND f.type = 'edu' THEN 1 END) AS edu_negative_amount
      FROM cities AS c
      INNER JOIN districts AS d ON c.id = d.city_id
      LEFT JOIN factors AS f ON d.id = f.district_id
      GROUP BY c.id, d.id;
    `;
    const result = await conn.query(query);
    const data = [];

    result.rows.forEach(row => {
      const city = {
        id: row.city_id,
        name: row.city_name,
        area: row.city_area,
        districts: [
          {
            id: row.district_id,
            name: row.district_name,
            area: row.area,
            total_positive_amount: row.total_positive_amount,
            total_negative_amount: row.total_negative_amount,
            edu_negative_amount: row.edu_negative_amount
          }
        ]
      };

      const existingCity = data.find(item => item.id === city.id);
      if (existingCity) {
        existingCity.districts.push(city.districts[0]);
      } else {
        data.push(city);
      }
    });

    res.status(200).json(data);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;