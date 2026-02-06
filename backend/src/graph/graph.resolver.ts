import { Resolver, Query, Args } from '@nestjs/graphql';
import { GraphService } from './graph.service';
import { GraphData } from './dto/graph.model';

@Resolver(() => GraphData)
export class GraphResolver {
  constructor(private readonly graphService: GraphService) {}

  @Query(() => GraphData)
  async graph(
    @Args('filter', { nullable: true }) filter?: string,
  ): Promise<GraphData> {
    // Parsing filter string or object can be added later
    return this.graphService.getGraphData(filter);
  }
}
