<?php

/**
 * Generate a human-readable markdown report from PHPStan/Larastan JSON output.
 */

$jsonPath = 'public/reports/analysis-report.json';
$mdPath = 'public/reports/analysis-report.md';

if (!file_exists($jsonPath)) {
    file_put_contents($mdPath, "# Static Analysis Report\n\n> **No analysis data found.** Run `analyze.sh` first.\n");
    exit(0);
}

$raw = file_get_contents($jsonPath);
$data = json_decode($raw, true);

if ($data === null) {
    file_put_contents($mdPath, "# Static Analysis Report\n\n> **Error:** Could not parse analysis-report.json.\n");
    exit(0);
}

$totalErrors = $data['totals']['errors'] ?? 0;
$fileErrors = $data['totals']['file_errors'] ?? 0;
$files = $data['files'] ?? [];

// Determine analysis level from phpstan.neon and inject into JSON metadata
$level = '?';
$neonPath = 'phpstan.neon';
if (file_exists($neonPath)) {
    $neonContent = file_get_contents($neonPath);
    if ($neonContent !== false && preg_match('/level:\s*(\d+)/', $neonContent, $m)) {
        $level = (int) $m[1];
    }
}
$resolvedLevel = getenv('PHPSTAN_LEVEL') ? (int) getenv('PHPSTAN_LEVEL') : $level;

// Count unique files with errors
$filesWithErrors = count(array_filter($files, fn($f) => count($f['messages'] ?? []) > 0));
$totalFiles = count($files);
if ($totalFiles === 0) {
    // If no errors, estimate files scanned by looking at app/ directory
    $output = shell_exec("find app -type f -name '*.php' 2>/dev/null | wc -l");
    if ($output) {
        $totalFiles = (int) trim($output);
    }
}

// Inject metadata into JSON so the frontend can read it
$data['metadata'] = [
    'level' => $resolvedLevel,
    'filesScanned' => $totalFiles,
    'analysisTime' => date('Y-m-d H:i:s'),
];
file_put_contents($jsonPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// Group errors by file
$errorsByFile = [];
$allErrors = [];
foreach ($files as $filePath => $fileData) {
    $messages = $fileData['messages'] ?? [];
    if (empty($messages))
        continue;

    $shortPath = str_replace(getcwd() . '/', '', $filePath);
    $errorsByFile[$shortPath] = $messages;

    foreach ($messages as $msg) {
        $allErrors[] = [
            'file' => $shortPath,
            'line' => $msg['line'] ?? 0,
            'message' => $msg['message'] ?? '?',
            'tip' => $msg['tip'] ?? null,
        ];
    }
}

// Build report
$report = "# Static Analysis Report\n\n";
$report .= "**Generated**: " . date('Y-m-d H:i:s') . "\n";
$report .= "**Engine**: Larastan (PHPStan)\n";
$report .= "**Level**: " . $resolvedLevel . "\n\n";

$report .= "## Summary\n\n";
$report .= "| Metric | Value |\n|--------|-------|\n";
$report .= "| Total Errors | $fileErrors |\n";
$report .= "| Files with Errors | $filesWithErrors |\n";
$report .= "| Internal Errors | $totalErrors |\n\n";

if (empty($allErrors)) {
    $report .= "## ✅ No Errors Found\n\nAll files pass static analysis at the configured level.\n";
} else {
    $report .= "## Errors by File\n\n";
    foreach ($errorsByFile as $file => $messages) {
        $report .= "### `$file` (" . count($messages) . " errors)\n\n";
        $report .= "| Line | Message |\n|------|----------|\n";
        foreach ($messages as $msg) {
            $line = $msg['line'] ?? '?';
            $message = str_replace('|', '\\|', $msg['message'] ?? '?');
            $report .= "| $line | $message |\n";
        }
        $report .= "\n";
    }
}

file_put_contents($mdPath, $report);
echo "Wrote: $mdPath\n";
