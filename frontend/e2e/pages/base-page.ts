import { type Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  async navigateViaSidebar(label: string) {
    await this.page.getByTestId(`nav-link-${label}`).click();
  }
}
