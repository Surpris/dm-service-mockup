import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import ContributorList from './ContributorList';
import { GET_CONTRIBUTORS } from '../graphql/queries';
import { describe, it, expect } from 'vitest';

const mocks = [
  {
    request: {
      query: GET_CONTRIBUTORS,
    },
    result: {
      data: {
        contributors: [
          {
            id: '1',
            contributorId: 'C001',
            name: 'John Doe',
          },
        ],
      },
    },
  },
];

describe('ContributorList', () => {
  it('renders contributors data after successful load', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <ContributorList />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    expect(screen.getByText('C001')).toBeInTheDocument();
  });
});
