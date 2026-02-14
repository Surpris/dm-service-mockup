import { test, expect } from '@playwright/test';

test.describe('Knowledge Graph Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto('/');
  });

  test('Navigation to Knowledge Graph and basic smoke test', async ({ page }) => {
    // Navigate to Graph page
    await page.getByTestId('nav-link-knowledge-graph').click();
    
    // Check if we are on the graph page
    await expect(page).toHaveURL(/\/graph/);
    await expect(page.getByTestId('graph-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Knowledge Graph' })).toBeVisible();
    
    // Check if graph container is visible
    await expect(page.getByTestId('graph-container')).toBeVisible();
    
    // Check if nodes are loaded (Wait for at least one node to be visible)
    // Project Alpha from seed: "AI Ethics Research Project"
    await expect(page.getByText('AI Ethics Research Project')).toBeVisible({ timeout: 10000 });
  });

  test('Graph layout operations', async ({ page }) => {
    await page.goto('/graph');
    
    // Wait for nodes to load
    await expect(page.getByText('AI Ethics Research Project')).toBeVisible();
    
    // Click layout buttons
    const verticalBtn = page.getByTestId('layout-vertical-button');
    const horizontalBtn = page.getByTestId('layout-horizontal-button');
    
    await expect(verticalBtn).toBeVisible();
    await expect(horizontalBtn).toBeVisible();
    
    await verticalBtn.click();
    // We could check positions here if we wanted to be very thorough, 
    // but for a smoke test, ensuring no crash is good.
    
    await horizontalBtn.click();
  });

  test('Filtering in graph', async ({ page }) => {
    await page.goto('/graph');
    
    // Initially, project and dataset nodes should be visible
    await expect(page.getByText('AI Ethics Research Project')).toBeVisible(); // Project
    await expect(page.getByText('Raw Survey Data')).toBeVisible(); // Dataset
    
    // Toggle Project filter (Uncheck)
    await page.getByLabel('Projects').uncheck();
    
    // Project node should disappear, but dataset should remain
    await expect(page.getByText('AI Ethics Research Project')).not.toBeVisible();
    await expect(page.getByText('Raw Survey Data')).toBeVisible();
    
    // Toggle Dataset filter (Uncheck)
    await page.getByLabel('Datasets').uncheck();
    await expect(page.getByText('Raw Survey Data')).not.toBeVisible();
    
    // Re-check all
    await page.getByLabel('Projects').check();
    await page.getByLabel('Datasets').check();
    await expect(page.getByText('AI Ethics Research Project')).toBeVisible();
    await expect(page.getByText('Raw Survey Data')).toBeVisible();
  });

  test('Create a user-defined relationship between nodes', async ({ page }) => {
    await page.goto('/graph');
    
    // Wait for nodes to load
    const projectNode = page.locator('[data-testid^="node-project-"]').filter({ hasText: 'AI Ethics Research Project' });
    const datasetNode = page.locator('[data-testid^="node-dataset-"]').filter({ hasText: 'Raw Survey Data' });
    
    await expect(projectNode).toBeVisible();
    await expect(datasetNode).toBeVisible();
    
    // Find handles
    const sourceHandle = projectNode.locator('[data-testid^="handle-source-"]');
    const targetHandle = datasetNode.locator('[data-testid^="handle-target-"]');
    
    // Drag from source handle to target handle to trigger relationship dialog
    await sourceHandle.hover();
    await page.mouse.down();
    await targetHandle.hover();
    await page.mouse.up();
    
    // Dialog should appear
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByText('Create New Relationship')).toBeVisible();
    
    // Fill the form
    await page.getByLabel('Relationship Type').click();
    await page.getByRole('option', { name: 'CONTAINS' }).click();
    
    await page.getByLabel('Description').fill('This project contains this dataset (E2E Test)');
    
    // Submit
    await page.getByRole('button', { name: 'Create' }).click();
    
    // Dialog should close
    await expect(dialog).not.toBeVisible();
    
    // In a real scenario, we would check if a new edge appears.
    // React Flow edges have class .react-flow__edge
    // We can also verify that the snackbar or refresh happened if implemented.
  });
});
