import { test, expect } from '@playwright/test';

test.describe('Knowledge Graph Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto('/');
  });

  test('Navigation to Knowledge Graph and basic smoke test', async ({
    page,
  }) => {
    // Navigate to Graph page
    await page.getByTestId('nav-link-knowledge-graph').click();

    // Check if we are on the graph page
    await expect(page).toHaveURL(/\/graph/);
    await expect(page.getByTestId('graph-page')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Knowledge Graph' }),
    ).toBeVisible();

    // Check if graph container is visible
    await expect(page.getByTestId('graph-container')).toBeVisible();

    // Check if nodes are loaded (Wait for at least one node to be visible)
    // Project Alpha from seed: "AI Ethics Research Project"
    await expect(
      page.getByText('AI Ethics Research Project').first(),
    ).toBeVisible({ timeout: 10000 });
  });

  test('Graph layout operations', async ({ page }) => {
    await page.goto('/graph');

    // Wait for nodes to load
    await expect(
      page.getByText('AI Ethics Research Project').first(),
    ).toBeVisible();

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
    await expect(
      page.getByText('AI Ethics Research Project').first(),
    ).toBeVisible(); // Project
    await expect(page.getByText('Raw Survey Data').first()).toBeVisible(); // Dataset

    // Toggle Project filter (Uncheck)
    await page.getByLabel('Projects').uncheck();

    // Project node should disappear, but dataset should remain
    await expect(
      page.getByText('AI Ethics Research Project').first(),
    ).not.toBeVisible();
    await expect(page.getByText('Raw Survey Data').first()).toBeVisible();

    // Toggle Dataset filter (Uncheck)
    await page.getByLabel('Datasets').uncheck();
    await expect(page.getByText('Raw Survey Data')).not.toBeVisible();

    // Re-check all
    await page.getByLabel('Projects').check();
    await page.getByLabel('Datasets').check();
    await expect(
      page.getByText('AI Ethics Research Project').first(),
    ).toBeVisible();
    await expect(page.getByText('Raw Survey Data').first()).toBeVisible();
  });

  test('Create a user-defined relationship between nodes', async ({ page }) => {
    await page.goto('/graph');

    // Wait for nodes to load
    const projectNode = page
      .locator('[data-testid^="node-project-"]')
      .filter({ hasText: 'AI Ethics Research Project' })
      .first();
    const datasetNode = page
      .locator('[data-testid^="node-dataset-"]')
      .filter({ hasText: 'Raw Survey Data' })
      .first();

    await expect(projectNode).toBeVisible();
    await expect(datasetNode).toBeVisible();

    // Find handles
    const sourceHandle = projectNode
      .locator('[data-testid^="handle-source-"]')
      .first();
    const targetHandle = datasetNode
      .locator('[data-testid^="handle-target-"]')
      .first();

    // Drag from source handle to target handle to trigger relationship dialog
    await sourceHandle.scrollIntoViewIfNeeded();
    await sourceHandle.dragTo(targetHandle);

    // Dialog should appear
    const dialog = page.getByTestId('create-relationship-dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByText('Create Relationship')).toBeVisible();

    // Fill the form
    // Select "Other (User Defined)" to test custom relationship
    await page.getByTestId('relationship-type-select').click();
    await page.getByRole('option').filter({ hasText: 'Other' }).click();

    // Enter custom type
    const customType = 'E2E_CUSTOM_REL';
    await page
      .getByTestId('custom-relationship-type-input')
      .locator('input')
      .fill(customType);

    await page
      .getByTestId('relationship-description-input')
      .locator('textarea')
      .first()
      .fill('This project has a custom relationship (E2E Test)');

    // Submit
    await page.getByTestId('relationship-dialog-submit-button').click();

    // Dialog should close
    await expect(dialog).not.toBeVisible();

    // Verification: The new edge with custom type should be visible in the graph
    // React Flow renders edge labels as separate elements
    await expect(page.getByText(customType).first()).toBeVisible({
      timeout: 10000,
    });

    // In a real scenario, we would check if a new edge appears.
    // React Flow edges have class .react-flow__edge
    // We can also verify that the snackbar or refresh happened if implemented.
  });
});
