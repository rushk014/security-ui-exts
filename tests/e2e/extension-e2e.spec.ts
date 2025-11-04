import { test } from '../fixtures/cluster-context';
import { navigateToExtension } from '../utils/navigation';

test('SBOMScanner extension (e2e) - can open from cluster nav', async ({ clusterPage }) => {
  const page = clusterPage;

  // Use the helper and verify that the dashboard loaded
  await navigateToExtension(page, 'SBOMScanner', { verifyText: 'Scanning stats' });
});
