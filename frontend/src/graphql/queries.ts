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
      collectedAt
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

export const GET_GRAPH = gql`
  query GetGraph($filter: String) {
    graph(filter: $filter) {
      nodes {
        id
        label
        type
        data
      }
      edges {
        id
        source
        target
        type
        label
        data
      }
    }
  }
`;
