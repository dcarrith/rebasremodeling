<?php

/**
 * Parse Clover XML coverage report and append stats to a rolling JSON history file.
 *
 * Usage: php scripts/generate-coverage-history.php
 */

$cloverPath = 'public/reports/coverage-clover.xml';
$historyPath = 'public/reports/coverage-history.json';
$maxEntries = 30;

if (!file_exists($cloverPath)) {
    echo "Error: {$cloverPath} not found. Run tests with --coverage-clover first.\n";
    exit(1);
}

$xml = simplexml_load_file($cloverPath);

// Clover XML structure: <coverage> -> <project> -> <metrics>
// Project-level <metrics> has: statements, coveredstatements, methods, coveredmethods, etc.
$projectMetrics = $xml->project->metrics;

$statementsTotal = (int) $projectMetrics['statements'];
$statementsCovered = (int) $projectMetrics['coveredstatements'];
$methodsTotal = (int) $projectMetrics['methods'];
$methodsCovered = (int) $projectMetrics['coveredmethods'];
$classesTotal = (int) $projectMetrics['classes'];
$classesCovered = (int) $projectMetrics['coveredclasses'];
$filesTotal = (int) $projectMetrics['files'];

$linesPct = $statementsTotal > 0 ? round(($statementsCovered / $statementsTotal) * 100, 2) : 0;
$methodsPct = $methodsTotal > 0 ? round(($methodsCovered / $methodsTotal) * 100, 2) : 0;
$classesPct = $classesTotal > 0 ? round(($classesCovered / $classesTotal) * 100, 2) : 0;

// Load existing history
$history = [];
if (file_exists($historyPath)) {
    $existing = json_decode(file_get_contents($historyPath), true);
    if (is_array($existing)) {
        $history = $existing;
    }
}

// Append new entry
$history[] = [
    'date' => date('Y-m-d H:i'),
    'lines_pct' => $linesPct,
    'methods_pct' => $methodsPct,
    'classes_pct' => $classesPct,
    'lines_covered' => $statementsCovered,
    'lines_total' => $statementsTotal,
    'methods_covered' => $methodsCovered,
    'methods_total' => $methodsTotal,
    'classes_covered' => $classesCovered,
    'classes_total' => $classesTotal,
    'files' => $filesTotal,
];

// Keep only the last N entries
if (count($history) > $maxEntries) {
    $history = array_slice($history, -$maxEntries);
}

file_put_contents($historyPath, json_encode($history, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");
echo "Coverage history updated: {$historyPath} (" . count($history) . " entries)\n";
echo "  Lines:   {$linesPct}% ({$statementsCovered}/{$statementsTotal})\n";
echo "  Methods: {$methodsPct}% ({$methodsCovered}/{$methodsTotal})\n";
echo "  Classes: {$classesPct}% ({$classesCovered}/{$classesTotal})\n";
