import express from 'express'
import conn from '../../../lib/db'
import fs from 'fs'

async function uploadAndInsertData(city_id, city_slug, district_slug, district_id, factorType) {
  const jsonData = fs.readFileSync(
    process.cwd() + '/dataset/raw/'+ city_slug +'/'+ district_slug +'/'+factorType+'.json', 
    'utf-8'
  )
  const data = JSON.parse(jsonData)

  for (const element of data.features) {
    let name = element.properties.name
    let coordinates = element.geometry.coordinates.toString()

    const query = 'INSERT INTO factors (district_id, name, type, coordinates, city_id) VALUES ($1, $2, $3, $4, $5)';
    const values = [district_id, name ?? 'noname' , factorType, coordinates, city_id];
    await conn.query(query, values);
  };
}

async function insertData(tablename, columns, template, values) {
  const query = 'INSERT INTO '+ tablename +' (' + columns + ') VALUES ' + template + ' RETURNING id'
  const result = await conn.query(query, values)
  
  return result.rows[0].id
}

export default async function handler(req, res) {
  const jsonData = fs.readFileSync(process.cwd() + '/dataset/cities_districts.json', 'utf-8')
  const metadata = JSON.parse(jsonData)

  try {
    for (const city of metadata) {
      let city_name = city.name
      let city_slug = city.slug
      let city_area = city.area
      let city_logo = city.logo

      // insert cities
      let city_id = await insertData('cities', 'name, area, logo', '($1, $2, $3)', [city_name, city_area, city_logo])
      
      for (const district of city.districts) {
        let district_name = district.name
        let district_slug = district.slug
        let district_area = district.area
        
        // insert districts
        let district_id = await insertData('districts', 'name, city_id, area', '($1, $2, $3)', [district_name, parseInt(city_id), parseFloat(district_area)])

        // insert factors
        uploadAndInsertData(city_id, city_slug, district_slug, district_id, 'positive')
        uploadAndInsertData(city_id, city_slug, district_slug, district_id, 'negative')
        uploadAndInsertData(city_id, city_slug, district_slug, district_id, 'edu')
        uploadAndInsertData(city_id, city_slug, district_slug, district_id, 'park')
      }
    }

    res.status(200).json("ok");
  } catch (error) {
    console.log( "error: ", error );
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
