export interface Project {
  id: string;
  projectNumber: string;
  description: string;
  createdAt: string;
}

export interface Dataset {
  id: string;
  datasetNo: number;
  title: string;
  accessPolicy: string;
  createdAt: string;
  project: {
    projectNumber: string;
  };
}

export interface Contributor {
  id: string;
  contributorId: string;
  name: string;
}

export interface ProjectsData {
  projects: Project[];
}

export interface DatasetsData {
  datasets: Dataset[];
}

export interface ContributorsData {
  contributors: Contributor[];
}
