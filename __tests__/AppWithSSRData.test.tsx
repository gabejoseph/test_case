import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import App from '../application/App';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { first: 'Alice', last: 'Smith', email: 'alice@example.com', address: '123 Main St', balance: '$1,000.00' },
        { first: 'Bob', last: 'Jones', email: 'bob@example.com', address: '456 Oak Ave', balance: '$2,000.00' },
      ]),
  })
) as jest.Mock;

describe('/appWithSSRData', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});