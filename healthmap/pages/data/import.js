import dynamic from 'next/dynamic'
import axios from 'axios'

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude to radians
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    // Calculate the differences between coordinates
    const latDiff = lat2Rad - lat1Rad;
    const lonDiff = lon2Rad - lon1Rad;

    // Calculate the distance using the Haversine formula
    const a =
        Math.sin(latDiff / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

export default function ImportDistricts() {
    const onSubmit = async () => {

        // import cities, districts and factors
        await axios
            .get('/api/data/import')
            .then((response) => {
                console.log(response.data.features);
            })
            .catch((e) => {
                console.log(e);
            });
        
        // import edu_factors park_factors
        const fetchDataPost = async(url, params) => {
            return await axios
                .post(url, params)
                .then((response) => response.data)
                .catch((e) => {
                    console.log(e);
                });
        }

        const fetchDataGet = async(url) => {
            return await axios
                .get(url)
                .then((response) => response.data)
                .catch((e) => {
                    console.log(e);
                });
        }

        const cities = await fetchDataGet('/api/cities')

        for (let l = 0; l < cities.length; l++) {
            let city_id = cities[l].id
            let districts = await fetchDataPost('/api/districts', {
                city_id: city_id
            });

            // insert edu_factor
            // ==============================
            let edu_distances = [];
            for (let k = 0; k < districts.length; k++) {
            
                let district_id = districts[k].id
                
                let neg_arr = await fetchDataPost('/api/factor/district', {
                    district_id: district_id, 
                    factor_type: 'negative'
                });
                
                let edu_arr = await fetchDataPost('/api/factor/district', {
                    district_id: district_id, 
                    factor_type: 'edu'
                });
    
                for (let i = 0; i < neg_arr.length; i++) {
                    let neg_factor = neg_arr[i];
        
                    let neg_factor_coordinates_lat = neg_factor.coordinates.split(",")[0]
                    let neg_factor_coordinates_lon = neg_factor.coordinates.split(",")[1]
                    let neg_factor_id              = neg_factor.id
                    
                    for (let j = 0; j < edu_arr.length; j++) {
                        let edu_factor = edu_arr[j];
        
                        let edu_factor_coordinates_lat = edu_factor.coordinates.split(",")[0]
                        let edu_factor_coordinates_lon = edu_factor.coordinates.split(",")[1]
                        let edu_factor_id              = edu_factor.id
        
                        let distance = calculateDistance(
                            parseFloat(neg_factor_coordinates_lat),
                            parseFloat(neg_factor_coordinates_lon),
                            parseFloat(edu_factor_coordinates_lat),
                            parseFloat(edu_factor_coordinates_lon)
                        );
        
                        edu_distances.push({
                            edu_factor_id: edu_factor_id,
                            neg_factor_id: neg_factor_id,
                            district_id: district_id,
                            distance: distance
                        });
                    }
                }
            }
            
            await axios
                .post('/api/insertEduFactor', edu_distances)
                .then((response) => {
                    // console.log(response);
                })
                .catch((e) => {
                    console.log(e);
                });


            // insert park_factor
            // ==============================
            let park_distances = [];

            let neg_arr = await fetchDataPost('/api/factor/city', {
                city_id: city_id, 
                factor_type: 'negative'
            });
            
            let park_arr = await fetchDataPost('/api/factor/city', {
                city_id: city_id, 
                factor_type: 'park'
            });

            for (let i = 0; i < neg_arr.length; i++) {
                let neg_factor = neg_arr[i];
    
                let neg_factor_coordinates_lat = neg_factor.coordinates.split(",")[0]
                let neg_factor_coordinates_lon = neg_factor.coordinates.split(",")[1]
                let neg_factor_id              = neg_factor.id
                
                for (let j = 0; j < park_arr.length; j++) {
                    let park_factor = park_arr[j];
    
                    let park_factor_coordinates_lat = park_factor.coordinates.split(",")[0]
                    let park_factor_coordinates_lon = park_factor.coordinates.split(",")[1]
                    let park_factor_id              = park_factor.id
    
                    let distance = calculateDistance(
                        parseFloat(neg_factor_coordinates_lat),
                        parseFloat(neg_factor_coordinates_lon),
                        parseFloat(park_factor_coordinates_lat),
                        parseFloat(park_factor_coordinates_lon)
                    );
    
                    park_distances.push({
                        city_id: city_id,
                        neg_factor_id: neg_factor_id,
                        park_factor_id: park_factor_id,
                        distance: distance
                    });
                }
            }
            
            await axios
                .post('/api/insertParkFactor', park_distances)
                .then((response) => {
                    // console.log(response);
                })
                .catch((e) => {
                    console.log(e);
                });  
        }
    };

    return (
        <>
            <button onClick={onSubmit}>Import</button>
        </>
    )
}