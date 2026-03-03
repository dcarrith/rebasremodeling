---
name: boardforpeace-deployer
description: >
  Deploys the BoardForPeace Chia Pool application to a local Kubernetes cluster (kind) as microservices. Includes build, deployment, testing with coverage reports, security scanning with vulnerability reports, and Larastan static analysis. Use this skill when the user wants to deploy the application to a Kubernetes environment, run tests in a containerized environment, generate test, security, or analysis reports, or perform security scans on the application image.
---

# BoardForPeace Deployer Skill

Packages and deploys the BoardForPeace Chia Pool application to a Kubernetes cluster, runs tests with coverage, and performs security scanning.

## Prerequisites

- Docker installed and running
- `kind` cluster running (context: `kind-higgs-cluster`)
- `kubectl` installed and configured
- `php` and `composer` installed locally (for testing)
- `trivy` or `grype` installed (for security scanning)

## Workflows

### 1. Build and Deploy

```bash
./.agent/skills/boardforpeace-deployer/scripts/deploy.sh
```

Builds the Docker image (`boardforpeace-app:latest`), loads it into the kind cluster, applies K8s manifests, copies Chia secrets from `chia` to `boardforpeace` namespace, runs `migrate:fresh --seed` to refresh all farmer data and statistics with current timestamps, and waits for rollout.

After deployment: `kubectl port-forward service/boardforpeace-web -n boardforpeace 8989:80`

### 2. Run Tests with Reports

```bash
./.agent/skills/boardforpeace-deployer/scripts/test.sh
```

Runs all unit and feature tests and produces three outputs:

| Output | Path | Format |
|--------|------|--------|
| Coverage | `public/coverage/index.html` | HTML |
| JUnit results | `public/reports/test-results.xml` | XML |
| Test report | `public/reports/test-report.md` | Markdown |

**Test report** includes per-suite/per-test pass/fail status, assertion counts, and timing.

#### Test Coverage Areas (197 tests)

##### Unit Tests

| Suite | Tests | Covers |
|-------|-------|--------|
| FarmerModelTest | 9 | Name accessor, primary key, boolean casts, relationships, fillable, profile picture URL accessor (upload/NFT/fallback) |
| BlockModelTest | 6 | Fillable attributes, boolean cast, factory states, stored values, mass assignment protection |
| UserModelTest | 8 | Fillable, hidden attributes, datetime/hashed casts, factory states, mass assignment protection |
| PoolSettingModelTest | 10 | Factory creation, fillable attributes, `typed_value` accessor (integer/decimal/boolean/json/string/unknown), mass assignment |
| PayoutModelTest | 5 | XCH accessor, farmer/batch relationships, data casts |
| PartialModelTest | 2 | Farmer relationship, fillable attributes |
| PayoutBatchTest | 8 | Model status transitions, XCH accessors, relationships |
| PayoutServiceTest | 16 | Proportional distribution, minimums, batch submission, confirmation, exception handling |
| PoolSettingServiceTest | 13 | DB override, config fallback, typed values, caching, bulk updates |
| BlsServiceTest | 6 | Signature verify (success/fail/error/exception), hex prefix handling |
| ChiaServiceTest | 11 | Blockchain state, peak height, coin records, tx push, error handling, connection exceptions |
| WalletServiceTest | 14 | Balance, send tx, connection test, host resolution (sage/k8s/chia_cloud), exception handling |
| AdminMiddlewareTest | 4 | Admin pass-through, non-admin 403, unauthenticated 403, status code verification |
| HandleInertiaRequestsTest | 2 | Shares authenticated user data, null when guest |
| ProfileUpdateRequestTest | 5 | Email format validation, max length, unique scoping |
| AppServiceProviderTest | 1 | ChiaService singleton registration |

##### Feature Tests

| Suite | Tests | Covers |
|-------|-------|--------|
| AdminPanelTest | 17 | Auth gates, admin middleware, CRUD, validation, metrics |
| PoolLoginTest | 4 | Signature-based auth, expiry, invalid sigs |
| ProfileTest | 8 | Profile CRUD, pool settings, account deletion, profile picture upload, NFT PFP selection, payout CSV download |
| PoolControllerTest | 13 | Welcome page, login flow (5 scenarios), dashboard, docs, reports |
| CheckPayoutStatusCommandTest | 4 | No batches, confirmed, pending, stale warning |
| CollectRewardsCommandTest | 7 | Peak height, puzzle hash, coin records, dry-run, unconfirmed |
| CreatePayoutsCommandTest | 6 | Wallet unavail, no balance, dry-run, submit success/failure |
| GenerateLoginLinkCommandTest | 5 | Farmer not found, success, python error, parse error, custom port |
| LeaderboardTest | 4 | Auth guard, page rendering, pagination (25/page), descending sort order |

### 3. Security Scan

```bash
./.agent/skills/boardforpeace-deployer/scripts/scan.sh
```

Scans `boardforpeace-app:latest` with Trivy (preferred) or Grype. Produces two outputs:

| Output | Path | Format |
|--------|------|--------|
| Raw scan | `public/reports/security-scan.json` | JSON |
| Scan report | `public/reports/security-report.md` | Markdown |

**Scan report** includes severity breakdown (CRITICAL/HIGH/MEDIUM/LOW), scan targets (OS, Composer, npm, pip), and a vulnerability table with CVE IDs, affected packages, and fix versions.

### 3b. Network Vulnerability Scan (Nuclei)

```bash
./.agent/skills/boardforpeace-deployer/scripts/vuln-scan.sh
```

Deploys a Nuclei scanner as a K8s Job to probe live services across the cluster (boardforpeace, chia, ingress-nginx, default namespaces). Produces:

| Output | Path | Format |
|--------|------|--------|
| Raw scan | `public/reports/vuln-scan.json` | JSON |
| Scan report | `public/reports/vuln-scan-report.md` | Markdown |
| JSONL findings | `public/reports/vuln-scan.jsonl` | JSONL |
| Scan log | `public/reports/scan-log.txt` | Text |

**Scan report** includes per-service severity breakdown, template IDs, matched URLs, and detailed finding descriptions.

### 4. Static Analysis (Larastan)

```bash
./.agent/skills/boardforpeace-deployer/scripts/analyze.sh
```

Runs Larastan (PHPStan for Laravel) at level 6. Produces two outputs:

| Output | Path | Format |
|--------|------|--------|
| Raw analysis | `public/reports/analysis-report.json` | JSON |
| Analysis report | `public/reports/analysis-report.md` | Markdown |

**Analysis report** includes total errors, files with errors, and per-file error breakdown with line numbers.

### 5. Frontend Tests with Coverage

```bash
./.agent/skills/boardforpeace-deployer/scripts/test-frontend.sh
```

Runs all React component, hook, and context tests using Vitest + React Testing Library. Produces:

| Output | Path | Format |
|--------|------|--------|
| Coverage | `public/frontend-coverage/index.html` | HTML |
| Coverage JSON | `public/frontend-coverage/coverage-summary.json` | JSON |
| JUnit results | `public/reports/frontend-test-results.xml` | XML |
| Test report | `public/reports/frontend-test-report.md` | Markdown |

#### Frontend Test Suites (56 tests)

| Suite | Tests | Covers |
|-------|-------|--------|
| PixelAvatar | 10 | SVG rendering, deterministic characters, aria-label, size prop, className, all 8 character types |
| StatCard | 6 | Label/value/sub rendering, themed styling across all 3 themes |
| InputError | 5 | Message display, hidden when empty/undefined, className, red styling |
| Checkbox | 4 | Renders checkbox, unchecked default, toggle interaction, className |
| Footer | 5 | Renders, branding content, matrix/plasma/void theme rendering |
| ThemeContext | 19 | Default theme, initialTheme, chart colors, switching, localStorage, server persist, invalid themes, theme keys validation, useTheme outside provider |
| useWsGlow | 7 | No glow on mount, glow on change, fade after duration, custom duration/color, rapid re-triggers, same-value stability |

### 6. Sync Reports to K8s Pods

```bash
./.agent/skills/boardforpeace-deployer/scripts/sync-reports.sh
```

Copies all locally-generated reports and coverage HTML into every running `boardforpeace-web` pod. Run this after test, scan, and analyze to make reports visible in the deployed application.

### 7. Full CI Pipeline

Run all steps in sequence:

```bash
./.agent/skills/boardforpeace-deployer/scripts/deploy.sh && \
./.agent/skills/boardforpeace-deployer/scripts/test.sh && \
./.agent/skills/boardforpeace-deployer/scripts/test-frontend.sh && \
./.agent/skills/boardforpeace-deployer/scripts/scan.sh && \
./.agent/skills/boardforpeace-deployer/scripts/vuln-scan.sh && \
./.agent/skills/boardforpeace-deployer/scripts/analyze.sh && \
./.agent/skills/boardforpeace-deployer/scripts/sync-reports.sh
```

All reports are generated in `public/reports/` and synced to the K8s pods.

## Architecture

- **boardforpeace-web**: Nginx + PHP-FPM serving HTTP requests
- **boardforpeace-worker**: PHP Artisan Queue worker for async tasks (payout calculations, reward collection)
- **Database**: MariaDB via `higgs-db` service
- **Redis**: Caching and queue backend
- **Ingress**: Nginx Ingress controller routing `boardforpeace.foundation` to the web service
- **HPA**: Horizontal Pod Autoscaler for the web deployment
- **Storage**: PersistentVolumeClaim for application storage (profile pictures, uploads)

## Frontend Pages (Inertia/React)

- Welcome, Dashboard, Docs, DevLogin
- Leaderboard with pagination
- FarmerProfile — tabbed view with partials (24h), harvesters, blocks, effort/luck stats
- Admin panel — Dashboard, Settings, WalletConfig
- Profile — Edit, password, pool settings, profile picture, payout CSV download
- Reports — Testing page with tabbed Coverage/Security/Analysis views

## Configuration

K8s ConfigMaps and Secrets in `resources/k8s/`. Ensure `boardforpeace-config` and `boardforpeace-secrets` are present or created by `deploy.sh`.
