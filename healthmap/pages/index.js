import Link from 'next/link';
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch('/api/cities')
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Head>
        <title>HealthMap 0.1</title>
        <meta name="description" content="Оценка городской инфраструктуры, влияющей на здоровье населения" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>

        <div className={styles.center}>
          <h1>HealthMap</h1>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 w-100 mx-auto">
          {cities.map((city) => (
            <div className="col" key={city.id}>
              <div className="card w-100 text-center h-100">
                <img
                  src={city.logo}
                  className="card-img-top p-4 mx-auto"
                  style={{ maxHeight: 200, width: 'auto' }}
                  alt="..."
                />
                <div className="card-body">
                  <h3 className="card-title">{city.name}</h3>
                  <p className="card-text">Площадь: {city.area}</p>
                  <Link 
                    href={{
                      pathname: `/city/[id]`,
                      query: {
                        city_name: city.name,
                        city_area: city.area,
                      },
                    }}
                    as={`/city/${city.id}`}
                    className="btn stretched-link"></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
