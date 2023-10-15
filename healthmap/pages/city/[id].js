import Link from 'next/link';
import {useRouter} from 'next/router'
import { useEffect, useState } from 'react';


export async function getServerSideProps(context) {
  console.log(context.query) 
  return {
      props: { 
         city_name: context.query.city_name,
         city_area: context.query.city_area
      }
  }
}

export default function Page(props) {
  const city_name = props.city_name
  const city_area = props.city_area
  const router = useRouter()
  const id = router.query.id
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if(!id) {
      return;
    }
    const fetchDistricts = async () => {
      fetch('/api/districts', {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({city_id: router.query.id})
      }).then((response) => response.json())
        .then((data) => {
          setDistricts(data)
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetchDistricts()
  }, [id]);

  return (
      <>
        <div style={{ minHeight: "100vh" }}>
          <div className='p-4'>
              <h5>
                <Link className="d-flex align-items-center text-secondary" href="/">
                  <i className="bi bi-arrow-left p-2"></i>
                  <span>НАЗАД К ГОРОДАМ</span>
                </Link>
              </h5>
          </div>


          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 w-100 mx-auto">
            <div className="col">
              <div className="card w-100 text-center h-100 p-4">
                <div className="card-body">
                  <h3 className="card-title">{city_name}</h3>
                  <p className="card-text">Площадь: {city_area}</p>
                  <Link href={`/districts/1`} className="btn stretched-link"></Link>
                </div>
              </div>
            </div>
            {districts.map((district) => (
              <div className="col" key={district.id}>
                <div className="card w-100 text-center h-100 p-4">
                  <div className="card-body">
                    <h3 className="card-title">{district.name}</h3>
                    <p className="card-text">Площадь: {district.area}</p>
                    <Link href={`/districts/${district.id}`} className="btn stretched-link"></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
  ) 
}