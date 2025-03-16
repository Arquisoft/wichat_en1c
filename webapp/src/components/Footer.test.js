// src/components/Footer.test.js
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('renders Footer with correct information', () => {
  // Render the Footer only once
  render(<Footer />);

  // Check if the company name with the current year is rendered
  expect(screen.getByText(/ChattySW ©/i)).toBeInTheDocument(); 

  // Check if the project name link is rendered with correct href and security attributes
  const repoLink = screen.getByRole('link', { name: /WIChat_en1c/i });
  expect(repoLink).toBeInTheDocument();
  expect(repoLink).toHaveAttribute('href', 'https://github.com/Arquisoft/wichat_en1c');

  // Check if the documentation link is rendered with correct href and security attributes
  const docsLink = screen.getByRole('link', { name: /docs/i });
  expect(docsLink).toBeInTheDocument();
  expect(docsLink).toHaveAttribute('href', 'https://arquisoft.github.io/wichat_en1c/');
});