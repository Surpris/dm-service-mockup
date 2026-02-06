
import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      projectNumber
      description
      createdAt
    }
  }
`;

export const GET_DATASETS = gql`
  query GetDatasets {
    datasets {
      id
      datasetNo
      title
      accessPolicy
      createdAt
      project {
        projectNumber
      }
    }
  }
`;

export const GET_CONTRIBUTORS = gql`
  query GetContributors {
    contributors {
      id
      contributorId
      name
      # role is in intermediate table, might need separate handling or updated query
    }
  }
`;
