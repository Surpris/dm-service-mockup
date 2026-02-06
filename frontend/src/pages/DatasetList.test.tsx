import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import DatasetList from './DatasetList';
import { GET_DATASETS } from '../graphql/queries';
import { describe, it, expect } from 'vitest';

const mocks = [
  {
    request: {
      query: GET_DATASETS,
    },
    result: {
      data: {
        datasets: [
          {
            id: '1',
            datasetNo: 123,
            title: 'Test Dataset',
            accessPolicy: 'PUBLIC',
            collectedAt: '2023-01-01T00:00:00Z',
            project: {
              projectNumber: 'P001',
            },
          },
        ],
      },
    },
  },
];

describe('DatasetList', () => {
  it('renders datasets data after successful load', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <DatasetList />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test Dataset')).toBeInTheDocument();
    });
    expect(screen.getByText('PUBLIC')).toBeInTheDocument();
    // Check project number (valueGetter)
    expect(screen.getByText('P001')).toBeInTheDocument();
  });

  it('handles dataset with no project correctly', async () => {
    const mocksNoProject = [
      {
        request: {
          query: GET_DATASETS,
        },
        result: {
          data: {
            datasets: [
              {
                id: '1',
                datasetNo: 123,
                title: 'Test Dataset',
                accessPolicy: 'PUBLIC',
                collectedAt: '2023-01-01T00:00:00Z',
                project: null,
              },
            ],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksNoProject}>
        <DatasetList />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test Dataset')).toBeInTheDocument();
    });
    // Should display '-' for project
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
