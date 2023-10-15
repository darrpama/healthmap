import conn from '../../lib/db'

export default async function handler(req, res) {
  try {
    const query = 'INSERT INTO cities(name, area, logo) VALUES($1, $2, $3)'
    const values = [req.body.name, req.body.area, req.body.logo];
    const result = await conn.query(query, values);
    console.log( "result: ", result );
  } catch (error) {
    console.log( "error: ", error );
  }
}
