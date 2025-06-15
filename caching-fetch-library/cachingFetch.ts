import { useEffect, useState } from 'react';

const cache: Record<string, { data: unknown; error: Error | null; promise?: Promise<void> }> = {};

type UseCachingFetch = (url: string) => {
  isLoading: boolean;
  data: unknown;
  error: Error | null;
};

/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const useCachingFetch: UseCachingFetch = (url) => {
  const cached = cache[url];
  const [data, setData] = useState(cached?.data ?? null);
  const [error, setError] = useState<Error | null>(cached?.error ?? null);
  const [isLoading, setIsLoading] = useState(!cached);

  useEffect(() => {
    let cancelled = false;
    if (cache[url]) {
  
      setData(cache[url].data ?? null);
      setError(cache[url].error ?? null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    if (!cache[url]) {
  
      cache[url] = { data: null, error: null };
      cache[url].promise = fetch(url)
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
          const data = await res.json();
          cache[url].data = data;
          cache[url].error = null;
          if (!cancelled) {
            setData(data);
            setError(null);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          cache[url].data = null;
          cache[url].error = err instanceof Error ? err : new Error(String(err));
          if (!cancelled) {
            setData(null);
            setError(cache[url].error);
            setIsLoading(false);
          }
        })
        .finally(() => {
          delete cache[url].promise;
        });
    } else if (
      cache[url] &&
      (cache[url] as { promise?: Promise<void> }).promise
    ) {
      (cache[url] as { promise?: Promise<void> }).promise!.then(() => {
        if (!cancelled) {
          setData(cache[url].data ?? null);
          setError(cache[url].error ?? null);
          setIsLoading(false);
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { isLoading, data, error };
};

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
export const preloadCachingFetch = async (url: string): Promise<void> => {
  if (cache[url]?.data !== undefined || cache[url]?.promise) {
    return;
  }
  cache[url] = { data: null, error: null };
  cache[url].promise = fetch(url)
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      cache[url].data = data;
      cache[url].error = null;
    })
    .catch((err) => {
      cache[url].data = null;
      cache[url].error = err instanceof Error ? err : new Error(String(err));
    })
    .finally(() => {
      delete cache[url].promise;
    });
  await cache[url].promise;
};

/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const serializeCache = (): string => {
  const serializable: Record<string, { data: unknown; error: string | null }> = {};
  for (const [url, entry] of Object.entries(cache)) {
    if (entry.data !== undefined) {
      serializable[url] = {
        data: entry.data,
        error: entry.error ? entry.error.message : null,
      };
    }
  }
  const result = JSON.stringify(serializable);
  return result;
};

export const initializeCache = (serializedCache: string): void => {
  if (!serializedCache) return;
  try {
    const parsed: Record<string, { data: unknown; error: string | null }> = JSON.parse(serializedCache);
    for (const [url, entry] of Object.entries(parsed)) {
      cache[url] = {
        data: entry.data,
        error: entry.error ? new Error(entry.error) : null,
      };
    }

  } catch (e) {

  }
};

export const wipeCache = (): void => {
  for (const key in cache) {
    delete cache[key];
  }
};