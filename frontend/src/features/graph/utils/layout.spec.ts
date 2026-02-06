import { describe, it, expect } from 'vitest';
import { getLayoutedElements } from './layout';
import type { Node, Edge } from 'reactflow';

describe('getLayoutedElements', () => {
  it('should assign positions to nodes based on dagre layout', () => {
    const nodes: Node[] = [
      { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
      { id: '2', position: { x: 0, y: 0 }, data: { label: 'Node 2' } },
    ];
    const edges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges);

    // Positions should be modified from (0,0)
    // Dagre usually places the first node at top (or left) and second below (or right)
    // We expect some non-zero coordinates or relative positioning.
    const node1 = layoutedNodes.find((n) => n.id === '1');
    const node2 = layoutedNodes.find((n) => n.id === '2');

    expect(node1).toBeDefined();
    expect(node2).toBeDefined();

    // Check that they are not overlapping at 0,0 anymore
    // Note: Dagre might keep one at 0,0 but the other should move.
    // Or if center is adjusted.
    expect(
      node1?.position.x !== node2?.position.x ||
        node1?.position.y !== node2?.position.y,
    ).toBe(true);
  });

  it('should handle empty graph', () => {
    const { nodes, edges } = getLayoutedElements([], []);
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
  });
});
