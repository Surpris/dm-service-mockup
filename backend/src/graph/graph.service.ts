import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GraphData, GraphNode, GraphEdge, NodeType } from './dto/graph.model';
import { EntityType } from '@prisma/client';

@Injectable()
export class GraphService {
  constructor(private prisma: PrismaService) {}

  async getGraphData(filter?: any): Promise<GraphData> {
    const [
      projects,
      datasets,
      contributors,
      projectContributors,
      userRelations,
    ] = await Promise.all([
      this.prisma.client.project.findMany({ where: { deletedAt: null } }),
      this.prisma.client.dataset.findMany({ where: { deletedAt: null } }),
      this.prisma.client.contributor.findMany({ where: { deletedAt: null } }),
      this.prisma.client.projectContributor.findMany({
        where: { deletedAt: null },
      }),
      this.prisma.client.userDefinedRelationship.findMany({
        where: { deletedAt: null },
      }),
    ]);

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // 1. Nodes
    projects.forEach((p) => {
      nodes.push({
        id: p.id,
        type: NodeType.PROJECT,
        label: p.projectNumber,
        data: JSON.stringify({ description: p.description }),
      });
    });

    datasets.forEach((d) => {
      nodes.push({
        id: d.id,
        type: NodeType.DATASET,
        label: d.title,
        data: JSON.stringify({ datasetNo: d.datasetNo }),
      });
    });

    contributors.forEach((c) => {
      nodes.push({
        id: c.id,
        type: NodeType.CONTRIBUTOR,
        label: c.name,
        data: JSON.stringify({ contributorId: c.contributorId }),
      });
    });

    // 2. System Edges
    // Project -> Dataset
    datasets.forEach((d) => {
      edges.push({
        id: `sys-proj-data-${d.projectId}-${d.id}`,
        source: d.projectId,
        target: d.id,
        type: 'HAS_DATASET',
        label: 'Has Dataset',
      });
    });

    // Dataset -> Contributor (CollectedBy)
    datasets.forEach((d) => {
      if (d.collectedById) {
        edges.push({
          id: `sys-data-collected-${d.id}-${d.collectedById}`,
          source: d.id,
          target: d.collectedById,
          type: 'COLLECTED_BY',
          label: 'Collected By',
        });
      }
      if (d.managedById) {
        edges.push({
          id: `sys-data-managed-${d.id}-${d.managedById}`,
          source: d.id,
          target: d.managedById,
          type: 'MANAGED_BY',
          label: 'Managed By',
        });
      }
    });

    // Project -> Contributor (ProjectContributor)
    projectContributors.forEach((pc) => {
      edges.push({
        id: pc.id, // Use PC id
        source: pc.projectId,
        target: pc.contributorId,
        type: 'PROJECT_MEMBER',
        label: pc.role, // Use Role as label
        data: JSON.stringify({ role: pc.role }),
      });
    });

    // 3. User Defined Edges
    userRelations.forEach((ur) => {
      edges.push({
        id: ur.id,
        source: ur.sourceId,
        target: ur.targetId,
        type: ur.relationshipType,
        label: ur.relationshipType,
        data: ur.properties
          ? typeof ur.properties === 'string'
            ? ur.properties
            : JSON.stringify(ur.properties)
          : undefined,
      });
    });

    return { nodes, edges };
  }
}
