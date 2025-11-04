## Setup

From the `tests/` directory:

```bash
cd tests
yarn install
yarn playwright install --with-deps
```

---

## Environment Variables

```bash
export RANCHER_URL=https://localhost:8005
export RANCHER_USERNAME=<your-username>
export RANCHER_PASSWORD=<your-password>
export CLUSTER_NAME=local
```

These are used by `global-setup.ts` to authenticate and store a session (`storageState.json`).

---

## Running Tests

Start the Rancher dashboard with the extension loaded:

```bash
API=https://your-dev-rancher yarn dev
```

Then in a separate window run:

```bash
cd tests
yarn playwright test --headed
```

Playwright will log in, enter the configured cluster (`local`), open the **SBOMScanner** extension, and verify that the dashboard loads.
