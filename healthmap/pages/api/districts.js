import express from 'express';
import conn from '../../lib/db';

const router = express.Router();

router.post('/api/districts', async (req, res) => {
  console.log(req.body.city_id);
  try {
    const query = 'SELECT * FROM districts WHERE city_id = $1';
    const values = [req.body.city_id];
    const result = await conn.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;