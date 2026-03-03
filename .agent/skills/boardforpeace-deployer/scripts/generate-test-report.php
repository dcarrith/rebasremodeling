<?php

/**
 * Generate a human-readable markdown test report from JUnit XML.
 *
 * Usage: php scripts/generate-test-report.php
 */

$xmlPath = 'public/reports/test-results.xml';
$outPath = 'public/reports/test-report.md';

if (!file_exists($xmlPath)) {
    echo "Error: {$xmlPath} not found. Run tests with --log-junit first.\n";
    exit(1);
}

$xml = simplexml_load_file($xmlPath);
$root = $xml->testsuite; // testsuites > testsuite (root)

$report = "# Test Report\n\n";
$report .= "**Generated**: " . date('Y-m-d H:i:s T') . "\n\n";
$report .= "| Metric | Value |\n|--------|-------|\n";
$report .= "| Tests | {$root['tests']} |\n";
$report .= "| Assertions | {$root['assertions']} |\n";
$report .= "| Failures | {$root['failures']} |\n";
$report .= "| Errors | {$root['errors']} |\n";
$report .= "| Time | " . round((float) $root['time'], 2) . "s |\n\n";

$report .= "## Test Suites\n\n";

// Level: root > category (Unit/Feature) > class > testcase
foreach ($root->testsuite as $category) {
    $report .= "### {$category['name']} ({$category['tests']} tests)\n\n";

    foreach ($category->testsuite as $suite) {
        $className = preg_replace('/^Tests\\\\(Unit|Feature)\\\\/', '', (string) $suite['name']);
        $status = ((int) $suite['failures'] === 0 && (int) $suite['errors'] === 0) ? '✅' : '❌';
        $report .= "#### {$status} {$className}\n\n";
        $report .= "| Test | Time | Result |\n|------|------|--------|\n";

        foreach ($suite->testcase as $tc) {
            $name = ucfirst(str_replace('_', ' ', preg_replace('/^test_/', '', (string) $tc['name'])));
            $icon = ($tc->failure || $tc->error) ? '❌' : '✅';
            $time = round((float) $tc['time'] * 1000) . 'ms';
            $report .= "| {$name} | {$time} | {$icon} |\n";
        }
        $report .= "\n";
    }
}

file_put_contents($outPath, $report);
echo "Wrote: {$outPath}\n";
