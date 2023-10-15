import express from 'express';
import conn from '../../../lib/db';
import {useRouter} from 'next/router'

const router = express.Router();

router.post('/api/factor/city', async (req, res) => {
  try {
    let city_id = req.body.city_id
    let factor_type = req.body.factor_type
  
    const query = 'SELECT * FROM factors WHERE city_id = $1 AND type = $2'
    const values = [city_id, factor_type];
    const result = await conn.query(query, values);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;