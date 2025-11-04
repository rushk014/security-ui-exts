import { test as base } from '@playwright/test';

/**
 * Cluster context fixture:
 *  - Loads /home and waits for Rancher dashboard shell
 *  - Waits for cluster button (data-testid="menu-cluster-local")
 *  - Clicks it and explicitly waits for cluster dashboard to load
 *  - Provides the page already inside the cluster context
 */
export const test = base.extend<{ clusterPage: typeof base['page'] }>({
  clusterPage: async ({ page, baseURL }, use) => {
    const clusterName = process.env.CLUSTER_NAME || 'local';
    const clusterRegex = new RegExp(`/c/${clusterName}/`);
    const clusterButtonSelector = `[data-testid="menu-cluster-${clusterName}"]`;

    console.log('🔄 [Cluster Fixture] Navigating to /home ...');
    await page.goto(`${baseURL}/home`, { waitUntil: 'domcontentloaded' });

    // Wait for Rancher shell to initialize (header or any app chrome)
    console.log('⏳ [Cluster Fixture] Waiting for Rancher shell to render ...');
    await page.waitForSelector('header, [data-testid^="menu-cluster-"]', { timeout: 60000 });
    console.log('✅ [Cluster Fixture] Rancher shell visible');

    // Wait for the cluster button
    const clusterButton = page.locator(clusterButtonSelector);
    console.log(`⏳ [Cluster Fixture] Waiting for cluster button: ${clusterButtonSelector}`);
    await clusterButton.waitFor({ state: 'visible', timeout: 60000 });

    // Click it and explicitly wait for navigation
    console.log(`🖱️ [Cluster Fixture] Clicking cluster button for "${clusterName}" ...`);
    await Promise.all([
      page.waitForURL(clusterRegex, { timeout: 60000 }),
      clusterButton.click(),
    ]);

    console.log(`✅ [Cluster Fixture] Navigated to cluster dashboard (/c/${clusterName}/...)`);

    // Wait for cluster sidebar navigation (signals cluster UI ready)
    await page.waitForSelector('nav[role="navigation"]', { timeout: 60000 });
    console.log(`✅ [Cluster Fixture] Cluster sidebar navigation ready`);

    // Pass the page to the test
    await use(page);

    console.log(`🏁 [Cluster Fixture] Test finished in cluster "${clusterName}" context`);
  },
});
