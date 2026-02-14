export interface Project {
  id: string;
  projectNumber: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  datasets?: Dataset[];
  contributors?: ProjectContributor[];
}

export interface ProjectContributor {
  id: string;
  role: string;
  contributor: {
    id: string;
    name: string;
  };
}

export interface Dataset {
  id: string;
  datasetNo: number;
  title: string;
  accessPolicy: string;
  collectedAt: string;
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

export interface ProjectData {
  project: Project;
}

export interface DatasetsData {
  datasets: Dataset[];
}

export interface ContributorsData {
  contributors: Contributor[];
}
