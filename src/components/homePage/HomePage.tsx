import React, { useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

import Dropdown from '../UI/Dropdown';

import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
  const [cityOfOrigin, setCityOfOrigin] = useState<string | null>(null);
  const [intermediateCities, setIntermediateCities] = useState<string[]>([]);
  const [cityOfDestination, setCityOfDestination] = useState<string | null>(
    null
  );
  const [dateOfTrip, setDateOfTrip] = useState<Dayjs | null>(null);
  const [passengers, setPassengers] = useState('');
  const [inputErrors, setInputErrors] = useState<Record<string, boolean>>({});

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const cityOfOrigin = searchParams.get('cityOfOrigin');
    const intermediateCities = searchParams.get('intermediateCities');
    const cityOfDestination = searchParams.get('cityOfDestination');
    const dateOfTrip = searchParams.get('dateOfTrip');
    const passengers = searchParams.get('passengers');

    if (cityOfOrigin) {
      setCityOfOrigin(cityOfOrigin);
    }
    if (intermediateCities) {
      setIntermediateCities(intermediateCities.split(','));
    }
    if (cityOfDestination) {
      setCityOfDestination(cityOfDestination);
    }
    if (
      typeof dateOfTrip === 'string' &&
      new Date(dateOfTrip).toString() !== 'Invalid Date'
    ) {
      // @ts-ignore
      setDateOfTrip(dateOfTrip);
    }
    if (typeof passengers === 'string' && +passengers !== NaN) {
      setPassengers(passengers);
    }
  }, []);

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const errors = {
      cityOfOrigin: !cityOfOrigin,
      cityOfDestination: !cityOfDestination,
      dateOfTrip: !dateOfTrip || inputErrors['dateOfTrip'],
      passengers: !passengers || inputErrors['passengers'],
    };

    setInputErrors(errors);

    if (
      errors['cityOfOrigin'] ||
      errors['cityOfDestination'] ||
      errors['dateOfTrip'] ||
      errors['passengers']
    ) {
      return;
    }

    // @ts-ignore
    navigate({
      pathname: 'result',
      search: createSearchParams({
        cityOfOrigin: cityOfOrigin,
        intermediateCities: intermediateCities,
        cityOfDestination: cityOfDestination,
        dateOfTrip: dateOfTrip,
        passengers: passengers,
      }).toString(),
    });
  };

  const cityOfOriginChangeHandler = (value) => {
    setInputErrors((prev) => ({
      ...prev,
      cityOfOrigin: !value,
    }));

    setCityOfOrigin(value);
  };

  const cityOfDestinationChangeHandler = (value) => {
    setInputErrors((prev) => ({
      ...prev,
      cityOfDestination: !value,
    }));

    setCityOfDestination(value);
  };

  const dateChangeHandler = (value) => {
    setInputErrors((prev) => ({
      ...prev,
      dateOfTrip: value['$d'] < new Date(),
    }));

    setDateOfTrip(value);
  };

  const passengersChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target.value;

    setInputErrors((prev) => ({
      ...prev,
      passengers: +value <= 0 && value.length > 0,
    }));

    setPassengers(value);
  };

  return (
    <main className={styles.root}>
      <h1>Plan your trip</h1>
      <form onSubmit={submitHandler}>
        <div>
          <Dropdown
            label="City of origin"
            isMultiple={false}
            isError={inputErrors['cityOfOrigin']}
            value={cityOfOrigin}
            setValue={cityOfOriginChangeHandler}
          />
          <Dropdown
            label="Intermediate cities"
            isMultiple={true}
            isError={inputErrors['intermediateCities']}
            value={intermediateCities}
            setValue={setIntermediateCities}
          />
          <Dropdown
            label="City of destination"
            isMultiple={false}
            isError={inputErrors['cityOfDestination']}
            value={cityOfDestination}
            setValue={cityOfDestinationChangeHandler}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of the trip"
              value={dateOfTrip}
              minDate={new Date(+new Date() + 86400000)}
              onChange={dateChangeHandler}
              renderInput={(params) => (
                <TextField {...params} error={inputErrors['dateOfTrip']} />
              )}
            />
          </LocalizationProvider>
          <TextField
            variant="outlined"
            type="number"
            label="Number of passengers"
            value={passengers}
            error={inputErrors['passengers']}
            onChange={passengersChangeHandler}
          />
        </div>
        <Button type="submit" variant="outlined">
          SUBMIT
        </Button>
      </form>
    </main>
  );
};

export default HomePage;
