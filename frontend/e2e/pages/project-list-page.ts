import { type Page, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class ProjectListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/projects');
  }

  async expectPageLoaded() {
    await expect(this.page.getByTestId('project-list-page')).toBeVisible();
    await expect(
      this.page.getByRole('heading', { name: 'Projects' }),
    ).toBeVisible();
  }

  async clickProjectRow(projectNumber: string) {
    await this.page.getByRole('row', { name: projectNumber }).click();
  }

  async clickViewButton(projectNumber: string) {
    const row = this.page.getByRole('row', { name: projectNumber });
    await row.getByRole('button', { name: 'View' }).click();
  }

  async getProjectRow(projectNumber: string) {
    return this.page.getByRole('row', { name: projectNumber });
  }
}
