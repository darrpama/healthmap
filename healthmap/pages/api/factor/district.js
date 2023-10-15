import express from 'express';
import conn from '../../../lib/db';
import {useRouter} from 'next/router'

const router = express.Router();

router.post('/api/factor/district', async (req, res) => {
  try {
    let district_id = req.body.district_id
    let factor_type = req.body.factor_type
  
    const query = 'SELECT * FROM factors WHERE district_id = $1 AND type = $2'
    const values = [district_id, factor_type];
    const result = await conn.query(query, values);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;