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
        let query = 'INSERT INTO edu_factor(edu_factor_id, neg_factor_id, district_id, distance) VALUES '
        for (let i = 0; i < distances.length; i++) {
            let d = distances[i]
            query += '(' + d.edu_factor_id + ',' + d.neg_factor_id + ',' + d.district_id + ',' + d.distance + ')'
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
