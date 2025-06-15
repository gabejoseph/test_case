# People Directory App

A demo project featuring a React application, a custom caching fetch library, and a minimal framework for SSR and client hydration.

---

## Project Structure

- `/application` – React app components (UI)
- `/caching-fetch-library` – Caching fetch hook and helpers
- `/framework` – SSR/client framework and mock server

---

## UI Overview

The UI displays a simple directory of people.  
- On `/appWithoutSSRData`, you see a list of people fetched on the client.
- On `/appWithSSRData`, you see the same list, but rendered server-side (SSR).
- Each person entry shows their name, email, address, and balance.

---

## Getting Started

### Prerequisites

- Node.js
- npm

### Setup

```bash
npm install
npm start
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Development

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

### Type Checking

```bash
npm run type-check
```

### Testing

Jest and React Testing Library are set up for unit and integration testing.

- The test environment is configured to use `jsdom` for DOM support.
- Tests are located in the `__tests__` folder and use `.test.tsx` naming.
- Fetch is mocked in tests to provide predictable data.
- Example test: `/appWithSSRData` renders a list of people and checks for their presence in the DOM.

To run all tests:

```bash
npm test
```

#### Example: Testing `/appWithSSRData`

- Renders the `<App />` component using React Testing Library.
- Mocks the fetch API to return a fake people list.
- Asserts that the people list is present in the rendered output.

See the `__tests__` folder for examples and add your own tests as needed.

---

## Caching Fetch Library

Located in `/caching-fetch-library/cachingFetch.ts`.  
Implements:
- `useCachingFetch(url)`: React hook for cached data fetching.
- `preloadCachingFetch(url)`: Preloads data for SSR.
- `serializeCache()`, `initializeCache()`, `wipeCache()`: Cache management utilities.

---

## Error Handling

A basic error boundary is implemented in `application/ErrorBoundary.tsx` and used in the main `App` component.  
If a rendering error occurs anywhere in the component tree, a user-friendly error message will be displayed.

## Known Issues / Next Steps

- Basic unit and integration tests are implemented using Jest and React Testing Library (see `__tests__`), but no e2e tests yet.
- Basic professional styling has been added using CSS.
- Basic error handling is implemented via an error boundary.
- No production build script.
- No deployment configuration.
- No authentication or authorization.
- Consider adding CI/CD (e.g., GitHub Actions).
- Consider stricter TypeScript settings.

---

## License

MIT