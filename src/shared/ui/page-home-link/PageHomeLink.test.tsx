import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { PageHomeLink } from './PageHomeLink';

vi.mock('@/shared/ui', () => ({
  LinkAsButton: ({ to, children }: { to: string; children: ReactNode }) => (
    <a href={to} data-testid="link">
      {children}
    </a>
  ),
}));

describe('PageHomeLink', () => {
  it('renders link with correct text', () => {
    render(<PageHomeLink />);

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders link with "/" href', () => {
    render(<PageHomeLink />);

    const link = screen.getByTestId('link');

    expect(link).toHaveAttribute('href', '/');
  });
});