import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the pages
vi.mock('./pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));
vi.mock('./pages/ProjectList', () => ({
  default: () => <div data-testid="project-list-page">ProjectList Page</div>,
}));
vi.mock('./pages/DatasetList', () => ({
  default: () => <div data-testid="dataset-list-page">DatasetList Page</div>,
}));
vi.mock('./pages/ContributorList', () => ({
  default: () => (
    <div data-testid="contributor-list-page">ContributorList Page</div>
  ),
}));

// Mock the client
vi.mock('./graphql/client', () => ({
  client: {
    query: vi.fn(),
    watchQuery: vi.fn(),
    mutate: vi.fn(),
  },
}));

describe('App', () => {
  it('renders layout and default page', () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    // Check Header
    expect(screen.getByText('RDM Service Mockup')).toBeInTheDocument();
    // Check Sidebar items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();

    // Check default page
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('navigates to Projects page', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/');
    render(<App />);

    await user.click(screen.getByText('Projects'));

    expect(screen.getByTestId('project-list-page')).toBeInTheDocument();
  });

  it('navigates to Datasets page', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/');
    render(<App />);

    await user.click(screen.getByText('Datasets'));

    expect(screen.getByTestId('dataset-list-page')).toBeInTheDocument();
  });
});
