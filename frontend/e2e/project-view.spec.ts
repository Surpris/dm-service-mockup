import { test } from '@playwright/test';
import { ProjectListPage } from './pages/project-list-page';
import { ProjectDetailPage } from './pages/project-detail-page';

test.describe('Project View Scenarios', () => {
  let projectListPage: ProjectListPage;
  let projectDetailPage: ProjectDetailPage;

  test.beforeEach(({ page }) => {
    projectListPage = new ProjectListPage(page);
    projectDetailPage = new ProjectDetailPage(page);
  });

  test('Navigate from Project List to Project Detail and verify information', async () => {
    // 1. Go to project list
    await projectListPage.goto();
    await projectListPage.expectPageLoaded();

    // 2. Select a project (P-ALPHA)
    const projectNumber = 'P-ALPHA';
    const description = 'AI Ethics Research Project';

    // Check if the project is in the list
    await projectListPage.getProjectRow(projectNumber);

    // 3. Click the project row to navigate to detail page
    await projectListPage.clickProjectRow(projectNumber);

    // 4. Verify detail page
    await projectDetailPage.expectPageLoaded(projectNumber);
    await projectDetailPage.expectBasicInfo(projectNumber, description);

    // 5. Verify datasets are listed
    await projectDetailPage.expectDatasetVisible('Raw Survey Data');
    await projectDetailPage.expectDatasetVisible('Analyzing Script');

    // 6. Verify contributors are listed
    await projectDetailPage.expectContributorVisible(
      'Alice (PI)',
      'PRINCIPAL_INVESTIGATOR',
    );
    await projectDetailPage.expectContributorVisible(
      'Bob (Co-Investigator)',
      'CO_INVESTIGATOR',
    );
  });

  test('Navigate using the View button', async () => {
    await projectListPage.goto();

    const projectNumber = 'P-BETA';
    await projectListPage.clickViewButton(projectNumber);

    await projectDetailPage.expectPageLoaded(projectNumber);
    await projectDetailPage.expectBasicInfo(
      projectNumber,
      'Climate Change Analysis',
    );
    await projectDetailPage.expectDatasetVisible('Satellite Images');
  });
});
