import { describe, it, expect } from 'vitest';
import { mapGraphDataToReactFlow } from './mapper';

describe('mapGraphDataToReactFlow', () => {
  it('should map nodes and edges correctly', () => {
    const backendData = {
      nodes: [
        {
          id: 'p1',
          label: 'Project 1',
          type: 'PROJECT',
          data: '{"projectNumber": "P123"}',
        },
        {
          id: 'd1',
          label: 'Dataset 1',
          type: 'DATASET',
          data: '{"datasetNo": 1}',
        },
      ],
      edges: [
        {
          id: 'e1',
          source: 'p1',
          target: 'd1',
          type: 'HAS_DATASET',
          label: 'has dataset',
          data: null,
        },
      ],
    };

    const result = mapGraphDataToReactFlow(backendData);

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);

    const p1 = result.nodes.find((n) => n.id === 'p1');
    expect(p1).toBeDefined();
    expect(p1?.type).toBe('project'); // Lowercase for mapping to custom node
    expect(p1?.data).toEqual({ label: 'Project 1', projectNumber: 'P123' });
    expect(p1?.position).toBeDefined(); // Should have default position

    const d1 = result.nodes.find((n) => n.id === 'd1');
    expect(d1?.type).toBe('dataset');

    const e1 = result.edges.find((e) => e.id === 'e1');
    expect(e1).toBeDefined();
    expect(e1?.source).toBe('p1');
    expect(e1?.target).toBe('d1');
    // We might want to use custom edge type or default
    // For now let's assume default unless specified
  });

  it('should handle invalid JSON in data field', () => {
    const backendData = {
      nodes: [
        {
          id: 'n1',
          label: 'Node 1',
          type: 'PROJECT',
          data: 'invalid-json',
        },
      ],
      edges: [],
    };

    const result = mapGraphDataToReactFlow(backendData);
    const n1 = result.nodes.find((n) => n.id === 'n1');
    expect(n1?.data).toEqual({ label: 'Node 1' }); // Should fall back to just label
  });
});
