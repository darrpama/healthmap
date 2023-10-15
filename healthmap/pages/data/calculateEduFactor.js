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

export default function CalculateEduFactor() {
    const onSubmit = async () => {

        const fetchData = async(url, params) => {
            return await axios
                .post(url, params)
                .then((response) => response.data)
                .catch((e) => {
                    console.log(e);
                });
        }

        const city_id = 2; // TODO DELETE
        
        const districts = await fetchData('/api/districts', {
            city_id: city_id
        });

        let distances = [];
        
        for (let k = 0; k < districts.length; k++) {
            
            let district_id = districts[k].id
            
            let neg_arr = await fetchData('/api/factor/district', {
                district_id: district_id, 
                factor_type: 'negative'
            });
            
            let edu_arr = await fetchData('/api/factor/district', {
                district_id: district_id, 
                factor_type: 'edu'
            });

            console.log(neg_arr.length)
            console.log(edu_arr.length)

            for (let i = 0; i < neg_arr.length; i++) {
                let neg_factor = neg_arr[i];
    
                let neg_factor_coordinates_lat = neg_factor.coordinates.split(",")[0]
                let neg_factor_coordinates_lon = neg_factor.coordinates.split(",")[1]
                let neg_factor_id              = neg_factor.id
                let neg_factor_name            = neg_factor.name
                
                for (let j = 0; j < edu_arr.length; j++) {
                    let edu_factor = edu_arr[j];
    
                    let edu_factor_coordinates_lat = edu_factor.coordinates.split(",")[0]
                    let edu_factor_coordinates_lon = edu_factor.coordinates.split(",")[1]
                    let edu_factor_id              = edu_factor.id
                    let edu_factor_name            = edu_factor.name
    
                    let distance = calculateDistance(
                        parseFloat(neg_factor_coordinates_lat),
                        parseFloat(neg_factor_coordinates_lon),
                        parseFloat(edu_factor_coordinates_lat),
                        parseFloat(edu_factor_coordinates_lon)
                    );
    
                    distances.push({
                        edu_factor_id: edu_factor_id,
                        neg_factor_id: neg_factor_id,
                        district_id: district_id,
                        distance: distance
                    });
                }
            }
        }

        axios
            .post('/api/insertEduFactor', distances)
            .then((response) => {
                console.log(response);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <>
            <br/>
            <button className='p-4 m-4' onClick={onSubmit}>Calculate</button>
        </>
    )
}