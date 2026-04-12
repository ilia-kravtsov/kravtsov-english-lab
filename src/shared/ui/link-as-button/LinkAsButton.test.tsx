import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { LinkAsButton } from '@/shared/ui';

import style from './LinkAsButton.module.scss';

describe('LinkAsButton', () => {
  function renderWithRouter(ui: ReactNode) {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  }

  it('renders children', () => {
    renderWithRouter(<LinkAsButton to="/home">Go home</LinkAsButton>);

    expect(screen.getByText('Go home')).toBeInTheDocument();
  });

  it('renders as link with correct href', () => {
    renderWithRouter(<LinkAsButton to="/profile">Profile</LinkAsButton>);

    const link = screen.getByRole('link', { name: 'Profile' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/profile');
  });

  it('applies className', () => {
    renderWithRouter(<LinkAsButton to="/home">Home</LinkAsButton>);

    const link = screen.getByRole('link', { name: 'Home' });

    expect(link).toHaveClass(style.linkAsButton);
  });

  it('applies external styles', () => {
    renderWithRouter(
      <LinkAsButton to="/home" style={{ width: '120px', fontSize: '18px' }}>
        Home
      </LinkAsButton>,
    );

    const link = screen.getByRole('link', { name: 'Home' });

    expect(link).toHaveStyle({
      width: '120px',
      fontSize: '18px',
    });
  });

  it('passes additional Link props', () => {
    renderWithRouter(
      <LinkAsButton to="/about" replace>
        About
      </LinkAsButton>,
    );

    const link = screen.getByRole('link', { name: 'About' });

    expect(link).toBeInTheDocument();
  });
});