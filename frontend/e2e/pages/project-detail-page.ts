import { type Page, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class ProjectDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectPageLoaded(projectNumber: string) {
    await expect(this.page.getByTestId('project-detail-page')).toBeVisible();
    await expect(
      this.page.getByRole('heading', {
        name: `Project Details: ${projectNumber}`,
      }),
    ).toBeVisible();
  }

  async expectBasicInfo(projectNumber: string, description?: string) {
    // Check in Basic Information section specifically to avoid strict mode violation
    // since the project number appears in breadcrumbs and heading too.
    const basicInfo = this.page
      .locator('h6:has-text("Basic Information")')
      .locator('..');
    await expect(basicInfo.getByText(projectNumber)).toBeVisible();
    if (description) {
      await expect(basicInfo.getByText(description)).toBeVisible();
    }
  }

  async expectDatasetVisible(title: string) {
    const section = this.page.locator('h6:has-text("Datasets")').locator('..');
    await expect(section.getByText(new RegExp(title)).first()).toBeVisible();
  }

  async expectContributorVisible(name: string, role: string) {
    const section = this.page
      .locator('h6:has-text("Contributors")')
      .locator('..');
    await expect(section.getByText(name).first()).toBeVisible();
    await expect(
      section.getByText(new RegExp(`Role: ${role}`)).first(),
    ).toBeVisible();
  }
}
