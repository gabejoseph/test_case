import React, { FC } from 'react';
import {
  preloadCachingFetch,
  useCachingFetch,
} from '../caching-fetch-library/cachingFetch';
import Person from './Person';
import { validateData } from './validation';
import './App.css';
import ErrorBoundary from './ErrorBoundary';

type Application = FC & {
  preLoadServerData?: () => Promise<void>;
};

const App: Application = () => {
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

  return (
    <ErrorBoundary>
      <div className="app-container">
        <h1 className="people-title">Welcome to the People Directory</h1>
        {data.map((person, index) => (
          <Person key={person.email} index={index} />
        ))}
      </div>
    </ErrorBoundary>
  );
};

App.preLoadServerData = async () => {
  await preloadCachingFetch(
    'https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole&seed=123',
  );
};

export default App;
