import { Page, expect } from '@playwright/test';

/**
 * Navigate to a cluster-level extension in the Rancher UI.
 * 
 * @param page Playwright Page instance
 * @param name Visible label of the extension in the sidebar
 * @param opts Optional: verifyText, e.g. "Scanning stats"
 */
export async function navigateToExtension(page: Page, name: string, opts?: { verifyText?: string }) {
  const verifyText = opts?.verifyText || 'Scanning stats';

  // Ensure we're inside a cluster context
  await expect(page).toHaveURL(/\/c\/.*\//, { timeout: 30000 });

  // Expand burger menu if collapsed
  const burger = page.locator('header button[aria-label="menu"]').first();
  if (await burger.isVisible()) {
    console.log('📂 [Navigation] Expanding collapsed sidebar ...');
    await burger.click();
  }

  // Wait for sidebar navigation
  await page.waitForSelector('nav[role="navigation"]', { timeout: 30000 });

  // Locate the extension entry
  console.log(`🧭 [Navigation] Looking for extension menu entry: "${name}"`);
  const extensionEntry = page.locator(`text=${name}`).first();
  await extensionEntry.waitFor({ state: 'visible', timeout: 30000 });

  // Click and wait for navigation to complete
  console.log(`🖱️ [Navigation] Clicking extension "${name}" ...`);
  await Promise.all([
    page.waitForLoadState('networkidle'),
    extensionEntry.click(),
  ]);

  // Wait for the extension dashboard URL to appear (SBOMScanner route)
  await page.waitForURL(/\/imageScanner/, { timeout: 60000 });

  // Verify that a known text appears on the dashboard
  console.log(`🔎 [Navigation] Waiting for extension UI element with text: "${verifyText}"`);
  await expect(page.locator(`text=${verifyText}`)).toBeVisible({ timeout: 20000 });

  console.log(`✅ [Navigation] Successfully loaded extension "${name}"`);
}
