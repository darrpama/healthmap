import dynamic from 'next/dynamic'
import axios from 'axios'

export default function CalculateEduFactor() {
    const onSubmit = async () => {

        const fetchData = async(url, params) => {
            return await axios
                .get(url, params)
                .then((response) => response.data)
                .catch((e) => {
                    console.log(e);
                });
        }
        
        const districts = await fetchData('/api/feature/city');

        console.log(districts)
    };

    return (
        <>
            <br/>
            <button className='p-4 m-4' onClick={onSubmit}>get data for Mintimir</button>
        </>
    )
}