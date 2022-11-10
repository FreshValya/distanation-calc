import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

import { getCities } from 'src/mocks/database';

interface Props {
  label: string;
  isMultiple: boolean;
  isError: boolean;
  value: string | string[] | null;
  setValue: React.Dispatch<React.SetStateAction<string | string[] | null>>;
}

const Dropdown: React.FC<Props> = ({
  label,
  isMultiple,
  isError,
  value,
  setValue,
}) => {
  const [input, setInput] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCities()
      .then()
      .catch((e) => console.error(e));
  }, [input]);

  const fetchCities = async () => {
    setIsLoading(true);
    const data = await getCities(input);
    setIsLoading(false);
    setDropdownOptions(data);
  };

  const changeDropdownHandler = (
    _event: React.SyntheticEvent,
    value: string | string[] | null,
    _reason: string
  ) => {
    setValue(value);
  };

  const changeInputHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setInput(event.target.value);
  };

  return (
    <Autocomplete
      disablePortal
      multiple={isMultiple}
      value={value}
      options={dropdownOptions}
      onChange={changeDropdownHandler}
      sx={{ width: 300 }}
      loading={isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          error={isError}
          label={label}
          value={input}
          onChange={changeInputHandler}
        />
      )}
    />
  );
};

export default Dropdown;
