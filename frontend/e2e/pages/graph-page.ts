import { type Page, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class GraphPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/graph');
  }

  async expectPageLoaded() {
    await expect(this.page).toHaveURL(/\/graph/);
    await expect(this.page.getByTestId('graph-page')).toBeVisible();
    await expect(
      this.page.getByRole('heading', { name: 'Knowledge Graph' }),
    ).toBeVisible();
    await expect(this.page.getByTestId('graph-container')).toBeVisible();
  }

  async expectNodeVisible(label: string) {
    await expect(this.page.getByText(label).first()).toBeVisible({
      timeout: 10000,
    });
  }

  async expectNodeNotVisible(label: string) {
    await expect(this.page.getByText(label).first()).not.toBeVisible();
  }

  async setLayout(direction: 'vertical' | 'horizontal') {
    const btnId =
      direction === 'vertical'
        ? 'layout-vertical-button'
        : 'layout-horizontal-button';
    await this.page.getByTestId(btnId).click();
  }

  async toggleFilter(label: string, checked: boolean) {
    const checkbox = this.page.getByLabel(label);
    if (checked) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }

  async createRelationship(
    sourceLabel: string,
    targetLabel: string,
    type: string,
    description: string,
  ) {
    const projectNode = this.page
      .locator('[data-testid^="node-project-"]')
      .filter({ hasText: sourceLabel })
      .first();
    const datasetNode = this.page
      .locator('[data-testid^="node-dataset-"]')
      .filter({ hasText: targetLabel })
      .first();

    const sourceHandle = projectNode
      .locator('[data-testid^="handle-source-"]')
      .first();
    const targetHandle = datasetNode
      .locator('[data-testid^="handle-target-"]')
      .first();

    await sourceHandle.scrollIntoViewIfNeeded();
    await sourceHandle.dragTo(targetHandle);

    const dialog = this.page.getByTestId('create-relationship-dialog');
    await expect(dialog).toBeVisible();

    await this.page.getByTestId('relationship-type-select').click();
    await this.page.getByRole('option').filter({ hasText: 'Other' }).click();

    await this.page
      .getByTestId('custom-relationship-type-input')
      .locator('input')
      .fill(type);
    await this.page
      .getByTestId('relationship-description-input')
      .locator('textarea')
      .first()
      .fill(description);

    await this.page.getByTestId('relationship-dialog-submit-button').click();
    await expect(dialog).not.toBeVisible();
  }

  async expectEdgeVisible(label: string) {
    await expect(this.page.getByText(label).first()).toBeVisible({
      timeout: 10000,
    });
  }
}
