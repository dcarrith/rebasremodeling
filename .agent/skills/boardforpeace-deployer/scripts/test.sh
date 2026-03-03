#!/bin/bash
set -e

SKILL_DIR=$(dirname "$0")

echo "Running Unit Tests with Coverage & Reports..."

mkdir -p public/reports

# Run tests with JUnit XML logging + HTML coverage + Clover XML
XDEBUG_MODE=coverage php artisan test \
    --coverage-html public/coverage \
    --coverage-clover public/reports/coverage-clover.xml \
    --log-junit public/reports/test-results.xml \
    2>&1 | tee /tmp/test-output.txt

# Generate a human-readable markdown test report
php "$SKILL_DIR/generate-test-report.php"

# Append coverage stats to rolling history
php "$SKILL_DIR/generate-coverage-history.php"

echo ""
echo "Tests Complete."
echo "Coverage report: public/coverage/index.html"
echo "Clover XML:      public/reports/coverage-clover.xml"
echo "Coverage history:public/reports/coverage-history.json"
echo "JUnit XML:       public/reports/test-results.xml"
echo "Test report:     public/reports/test-report.md"
