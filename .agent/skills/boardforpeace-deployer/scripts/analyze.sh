#!/bin/bash
set -e

SKILL_DIR=$(dirname "$0")

echo "Running Larastan Static Analysis..."

mkdir -p public/reports

# Run PHPStan/Larastan — capture JSON output (exit code 1 if errors found, so || true)
./vendor/bin/phpstan analyse --error-format=json --no-progress --memory-limit=512M 2>/dev/null > /tmp/phpstan-output.json || true

# Copy result to reports
cp /tmp/phpstan-output.json public/reports/analysis-report.json

# Generate human-readable markdown report
php "$SKILL_DIR/generate-analysis-report.php"

echo ""
echo "Analysis Complete."
echo "JSON report:    public/reports/analysis-report.json"
echo "Analysis report: public/reports/analysis-report.md"
