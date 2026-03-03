import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the storefront brand', () => {
  render(<App />);
  const brand = screen.getByText(/VintageCaps/i);
  expect(brand).toBeInTheDocument();
});
