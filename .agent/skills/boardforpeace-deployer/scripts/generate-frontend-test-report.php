<?php

/**
 * Generate a human-readable markdown report from Vitest JUnit XML output.
 *
 * Usage: php scripts/generate-frontend-test-report.php
 */

$xmlPath = 'public/reports/frontend-test-results.xml';
$coveragePath = 'public/frontend-coverage/coverage-summary.json';
$outPath = 'public/reports/frontend-test-report.md';

if (!file_exists($xmlPath)) {
    echo "Error: {$xmlPath} not found. Run tests with --reporter=junit first.\n";
    exit(1);
}

$xml = simplexml_load_file($xmlPath);

// Vitest JUnit: <testsuites> > <testsuite name="file"> > <testcase>
$totalTests = 0;
$totalPassed = 0;
$totalFailed = 0;
$totalTime = 0;
$suites = [];

foreach ($xml->testsuite as $suite) {
    $tests = (int) $suite['tests'];
    $failures = (int) $suite['failures'];
    $errors = (int) $suite['errors'];
    $time = (float) $suite['time'];

    $totalTests += $tests;
    $totalFailed += $failures + $errors;
    $totalPassed += $tests - $failures - $errors;
    $totalTime += $time;

    $suiteName = basename((string) $suite['name']);
    $status = ($failures === 0 && $errors === 0) ? '✅' : '❌';

    $testCases = [];
    foreach ($suite->testcase as $tc) {
        $name = (string) $tc['name'];
        $tcTime = round((float) $tc['time'] * 1000);
        $icon = ($tc->failure || $tc->error) ? '❌' : '✅';
        $testCases[] = "| {$name} | {$tcTime}ms | {$icon} |";
    }

    $suites[] = [
        'name' => $suiteName,
        'status' => $status,
        'tests' => $tests,
        'cases' => $testCases,
    ];
}

$report = "# Frontend Test Report\n\n";
$report .= "**Generated**: " . date('Y-m-d H:i:s T') . "\n";
$report .= "**Framework**: Vitest + React Testing Library\n\n";

$report .= "| Metric | Value |\n|--------|-------|\n";
$report .= "| Tests | {$totalTests} |\n";
$report .= "| Passed | {$totalPassed} |\n";
$report .= "| Failed | {$totalFailed} |\n";
$report .= "| Time | " . round($totalTime, 2) . "s |\n\n";

// Coverage summary if available
if (file_exists($coveragePath)) {
    $coverage = json_decode(file_get_contents($coveragePath), true);
    if (isset($coverage['total'])) {
        $lines = $coverage['total']['lines']['pct'] ?? 'N/A';
        $functions = $coverage['total']['functions']['pct'] ?? 'N/A';
        $branches = $coverage['total']['branches']['pct'] ?? 'N/A';
        $statements = $coverage['total']['statements']['pct'] ?? 'N/A';

        $report .= "## Coverage\n\n";
        $report .= "| Metric | Coverage |\n|--------|----------|\n";
        $report .= "| Lines | {$lines}% |\n";
        $report .= "| Functions | {$functions}% |\n";
        $report .= "| Branches | {$branches}% |\n";
        $report .= "| Statements | {$statements}% |\n\n";
    }
}

$report .= "## Test Suites\n\n";

foreach ($suites as $suite) {
    $report .= "### {$suite['status']} {$suite['name']} ({$suite['tests']} tests)\n\n";
    $report .= "| Test | Time | Result |\n|------|------|--------|\n";
    $report .= implode("\n", $suite['cases']) . "\n\n";
}

file_put_contents($outPath, $report);
echo "Wrote: {$outPath}\n";
