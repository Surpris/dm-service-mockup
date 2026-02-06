import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum NodeType {
  PROJECT = 'PROJECT',
  DATASET = 'DATASET',
  CONTRIBUTOR = 'CONTRIBUTOR',
}

registerEnumType(NodeType, { name: 'NodeType' });

@ObjectType()
export class GraphNode {
  @Field(() => ID)
  id: string;

  @Field(() => NodeType)
  type: NodeType;

  @Field()
  label: string;

  @Field({ nullable: true })
  data?: string; // JSON string for properties
}

@ObjectType()
export class GraphEdge {
  @Field(() => ID)
  id: string;

  @Field()
  source: string; // Node ID

  @Field()
  target: string; // Node ID

  @Field()
  type: string; // Relationship Type (e.g., 'DERIVED_FROM', 'MANAGED_BY')

  @Field({ nullable: true })
  label?: string;

  @Field({ nullable: true })
  data?: string; // JSON string for properties
}

@ObjectType()
export class GraphData {
  @Field(() => [GraphNode])
  nodes: GraphNode[];

  @Field(() => [GraphEdge])
  edges: GraphEdge[];
}
