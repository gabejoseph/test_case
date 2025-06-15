import React, { FC } from 'react';
import { useCachingFetch } from '../caching-fetch-library/cachingFetch';
import { validateData } from './validation';
import Name from './Name';

const Person: FC<{ index: number }> = ({ index }) => {
  const {
    data: rawData,
    isLoading,
    error,
  } = useCachingFetch(
    'https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole&seed=123',
  );
  if (isLoading) return <div>Loading...</div>;
  if (error || rawData === null) return <div>Error: {error?.message}</div>;

  const data = validateData(rawData);

  const person = data[index];

  return (
    <div className="person-card">
      <div className="person-name">
        <Name index={index} />
      </div>
      <div className="person-email">{person.email}</div>
      <div className="person-address">{person.address}</div>
      <div className="person-balance">Balance: {person.balance}</div>
      <div style={{ color: '#888', fontSize: '0.92em', marginTop: '0.2em' }}>{person.created}</div>
    </div>
  );
};

export default Person;
