import { test } from '@playwright/test';
import { GraphPage } from './pages/graph-page';

test.describe('Knowledge Graph Scenarios', () => {
  let graphPage: GraphPage;

  test.beforeEach(async ({ page }) => {
    graphPage = new GraphPage(page);
    await graphPage.goto();
  });

  test('Navigation to Knowledge Graph and basic smoke test', async () => {
    await graphPage.expectPageLoaded();
    // Project Alpha from seed: "AI Ethics Research Project"
    await graphPage.expectNodeVisible('AI Ethics Research Project');
  });

  test('Graph layout operations', async () => {
    // Wait for nodes to load
    await graphPage.expectNodeVisible('AI Ethics Research Project');

    await graphPage.setLayout('vertical');
    await graphPage.setLayout('horizontal');
  });

  test('Filtering in graph', async () => {
    // Initially, project and dataset nodes should be visible
    await graphPage.expectNodeVisible('AI Ethics Research Project'); // Project
    await graphPage.expectNodeVisible('Raw Survey Data'); // Dataset

    // Toggle Project filter (Uncheck)
    await graphPage.toggleFilter('Projects', false);

    // Project node should disappear, but dataset should remain
    await graphPage.expectNodeNotVisible('AI Ethics Research Project');
    await graphPage.expectNodeVisible('Raw Survey Data');

    // Toggle Dataset filter (Uncheck)
    await graphPage.toggleFilter('Datasets', false);
    await graphPage.expectNodeNotVisible('Raw Survey Data');

    // Re-check all
    await graphPage.toggleFilter('Projects', true);
    await graphPage.toggleFilter('Datasets', true);
    await graphPage.expectNodeVisible('AI Ethics Research Project');
    await graphPage.expectNodeVisible('Raw Survey Data');
  });

  test('Create a user-defined relationship between nodes', async () => {
    const customType = 'E2E_CUSTOM_REL';
    await graphPage.createRelationship(
      'AI Ethics Research Project',
      'Raw Survey Data',
      customType,
      'This project has a custom relationship (E2E Test)',
    );

    // Verification: The new edge with custom type should be visible in the graph
    await graphPage.expectEdgeVisible(customType);
  });
});
