import express from 'express';
import conn from '../../lib/db';

const router = express.Router();

router.get('/api/cities', async (req, res) => {
  try {
    const query = 'SELECT * FROM cities';
    const result = await conn.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;