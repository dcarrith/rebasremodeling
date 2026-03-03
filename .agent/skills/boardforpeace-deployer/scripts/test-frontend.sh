#!/bin/bash
set -e

SKILL_DIR=$(dirname "$0")

echo "Running Frontend Tests with Coverage..."

mkdir -p public/reports public/frontend-coverage

# Run Vitest with coverage, output JUnit XML + JSON summary
npx vitest run \
    --coverage \
    --reporter=default \
    --reporter=junit \
    --outputFile.junit=public/reports/frontend-test-results.xml \
    2>&1 | tee /tmp/frontend-test-output.txt

# Generate human-readable markdown report
php "$SKILL_DIR/generate-frontend-test-report.php"

echo ""
echo "Frontend Tests Complete."
echo "Coverage report:  public/frontend-coverage/index.html"
echo "Coverage JSON:    public/frontend-coverage/coverage-summary.json"
echo "JUnit XML:        public/reports/frontend-test-results.xml"
echo "Test report:      public/reports/frontend-test-report.md"
