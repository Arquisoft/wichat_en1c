// src/components/Footer.test.js
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('renders company name', () => {
  render(<Footer />);
  expect(screen.getByText(/ChattySW/i)).toBeInTheDocument();
});

test('renders project name', () => {
  render(<Footer />);
  expect(screen.getByText(/WIChat_en1c/i)).toBeInTheDocument();
});

test('renders documentation link with correct href', () => {
  render(<Footer />);
  const docsLink = screen.getByRole('link', { name: /docs/i });
  expect(docsLink).toBeInTheDocument();
  expect(docsLink).toHaveAttribute('href', 'https://arquisoft.github.io/wichat_en1c/');
});