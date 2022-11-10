import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CitiesData, getDistances } from 'src/mocks/database';
import getDistanceFromLatLonInKm from 'src/utils/getDistanceFromLatLonInLm';

import styles from './ResultPage.module.scss';

const ResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [cities, setCities] = useState<CitiesData>([]);
  const [status, setStatus] = useState('resolved');

  const fetchCities = async (cities: string[]) => {
    try {
      setStatus('loading');
      const data = await getDistances(cities);
      setStatus('resolved');
      setCities(data);
    } catch (e) {
      setStatus(e.message);
    }
  };

  useEffect(() => {
    const cityOfOrigin = searchParams.get('cityOfOrigin');
    const intermediateCities = searchParams.get('intermediateCities');
    const cityOfDestination = searchParams.get('cityOfDestination');

    if (cityOfOrigin && intermediateCities && cityOfDestination) {
      fetchCities([
        cityOfOrigin,
        ...intermediateCities.split(','),
        cityOfDestination,
      ]);
    }
  }, []);

  let totalDistance = 0;

  const distances =
    status === 'resolved' && cities.length > 0 ? (
      <ul>
        {cities.map((city, i) => {
          if (i === cities.length - 1) return;
          const distance = getDistanceFromLatLonInKm(
            city[1],
            city[2],
            cities[i + 1][1],
            cities[i + 1][2]
          );

          totalDistance += distance;

          const text = `${city[0]} -> ${
            cities[i + 1][0]
          } distance: ${distance.toFixed(2)} km`;
          return <li key={city[0]}>{text}</li>;
        })}
      </ul>
    ) : (
      <div>{status === 'resolved' ? 'No cities found' : status}</div>
    );

  let date = '';

  if (searchParams.get('dateOfTrip') === null) {
    date = 'data not passed';
  } else if (
    new Date(searchParams.get('dateOfTrip')!).toString() === 'Invalid Date'
  ) {
    date = 'incorrect date';
  } else {
    date = new Date(searchParams.get('dateOfTrip')!).toLocaleDateString();
  }

  let passengers = '';
  if (searchParams.get('passengers') === null) {
    passengers = 'number of passengers not passed';
  } else if (Number.isNaN(+searchParams.get('passengers')!)) {
    passengers = 'incorrect number';
  } else {
    passengers = searchParams.get('passengers')!;
  }

  return (
    <main className={styles.root}>
      <div>
        <h1>The distance of the route</h1>
        <div>
          <div>Date of the trip: {date}</div>
          <div>Number of passengers: {passengers}</div>
        </div>
        <div>Cities:</div>
        {status === 'loading' ? <div>Loading...</div> : distances}
        <div>Total distance: {totalDistance.toFixed(2)} km</div>
      </div>
    </main>
  );
};

export default ResultPage;
