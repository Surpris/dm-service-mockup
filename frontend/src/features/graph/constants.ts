export const SYSTEM_RELATIONSHIP_TYPES = {
  HAS_DATASET: 'HAS_DATASET',
  COLLECTED_BY: 'COLLECTED_BY',
  MANAGED_BY: 'MANAGED_BY',
  PROJECT_MEMBER: 'PROJECT_MEMBER',
} as const;

export type SystemRelationshipType =
  (typeof SYSTEM_RELATIONSHIP_TYPES)[keyof typeof SYSTEM_RELATIONSHIP_TYPES];

export const RELATIONSHIP_OPTIONS: Record<string, Record<string, string[]>> = {
  project: {
    dataset: [SYSTEM_RELATIONSHIP_TYPES.HAS_DATASET],
    contributor: [SYSTEM_RELATIONSHIP_TYPES.PROJECT_MEMBER],
  },
  dataset: {
    contributor: [
      SYSTEM_RELATIONSHIP_TYPES.COLLECTED_BY,
      SYSTEM_RELATIONSHIP_TYPES.MANAGED_BY,
    ],
  },
  // Add reverse or other combinations if needed
};
