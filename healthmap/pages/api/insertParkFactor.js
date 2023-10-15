import conn from '../../lib/db'

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '100mb' // Set desired value here
        }
    },
    maxDuration: 50,
}

export default async function handler(req, res) {
    
    let distances = req.body;
    
    try {
        let query = 'INSERT INTO park_factor(city_id, neg_factor_id, park_factor_id, distance) VALUES '
        for (let i = 0; i < distances.length; i++) {
            let d = distances[i]
            query += '(' + d.city_id + ',' + d.neg_factor_id + ',' + d.park_factor_id + ',' + d.distance + ')'
            if ((i+1) != distances.length) {
                query += ','
            }
        }
        const result = await conn.query(query);
        res.status(200).json(query);
    } catch (error) {
        console.log( "error: ", error );
    }
}
