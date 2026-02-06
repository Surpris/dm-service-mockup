import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import ProjectList from './ProjectList';
import { GET_PROJECTS } from '../graphql/queries';
import { describe, it, expect } from 'vitest';

const mocks = [
  {
    request: {
      query: GET_PROJECTS,
    },
    result: {
      data: {
        projects: [
          {
            id: '1',
            projectNumber: 'P001',
            description: 'Test Project',
            createdAt: '2023-01-01T00:00:00Z',
          },
        ],
      },
    },
  },
];

const errorMocks = [
  {
    request: {
      query: GET_PROJECTS,
    },
    error: new Error('An error occurred'),
  },
];

describe('ProjectList', () => {
  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={[]}>
        <ProjectList />
      </MockedProvider>,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders projects data after successful load', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <ProjectList />
      </MockedProvider>,
    );

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(screen.getByText('P001')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    // Check formatted date
    expect(
      screen.getByText(new Date('2023-01-01T00:00:00Z').toLocaleString()),
    ).toBeInTheDocument();
  });

  it('renders error message on failure', async () => {
    render(
      <MockedProvider mocks={errorMocks}>
        <ProjectList />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading projects:/)).toBeInTheDocument();
    });
    expect(screen.getByText(/An error occurred/)).toBeInTheDocument();
  });
});
