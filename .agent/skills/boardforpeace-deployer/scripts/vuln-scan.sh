#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESOURCES_DIR="$SCRIPT_DIR/../resources/k8s"
NAMESPACE="boardforpeace"
JOB_NAME="vuln-scanner"
TIMEOUT=1260  # 21 minutes — longer than Nuclei's 1080s timeout + metadata writing time

echo "=== Network Vulnerability Scan ==="
echo ""

mkdir -p public/reports

# --- Clean up any previous scan job ---
echo "Cleaning up previous scan job (if any)..."
kubectl delete job "$JOB_NAME" -n "$NAMESPACE" --ignore-not-found=true 2>/dev/null
sleep 2

# --- Apply ConfigMap and Job ---
echo "Deploying scanner ConfigMap..."
kubectl apply -f "$RESOURCES_DIR/51-vuln-scanner-config.yaml"

echo "Deploying scanner Job..."
kubectl apply -f "$RESOURCES_DIR/50-vuln-scanner-job.yaml"

# --- Wait for the nuclei container to complete ---
echo "Waiting for scan to complete (Nuclei timeout: 1080s)..."
ELAPSED=0
POLL_INTERVAL=10

while [ $ELAPSED -lt $TIMEOUT ]; do
    # Check if the nuclei container has terminated (completed or killed by timeout)
    STATUS=$(kubectl get pod -n "$NAMESPACE" -l app=vuln-scanner --no-headers -o jsonpath='{.items[0].status.containerStatuses[?(@.name=="nuclei")].state.terminated.reason}' 2>/dev/null || echo "")

    if [ -n "$STATUS" ]; then
        echo ""
        echo "Nuclei container finished with status: $STATUS"
        break
    fi

    # Show progress
    PHASE=$(kubectl get pod -n "$NAMESPACE" -l app=vuln-scanner --no-headers -o jsonpath='{.items[0].status.phase}' 2>/dev/null || echo "Pending")
    printf "\r  [%ds] Pod phase: %-20s" "$ELAPSED" "$PHASE"

    sleep $POLL_INTERVAL
    ELAPSED=$((ELAPSED + POLL_INTERVAL))
done
echo ""

if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "WARNING: Script timed out waiting for scan."
fi

# --- Give a moment for any writes to flush ---
sleep 3

# --- Extract results from the pod ---
POD_NAME=$(kubectl get pod -n "$NAMESPACE" -l app=vuln-scanner --no-headers -o custom-columns=":metadata.name" 2>/dev/null | head -1)

if [ -z "$POD_NAME" ]; then
    echo "ERROR: Could not find scanner pod."
    echo '{"status": "error", "reason": "scanner pod not found"}' > public/reports/vuln-scan.json
    exit 1
fi

echo "Extracting results from pod $POD_NAME..."

# Try to extract from results-server container first, then nuclei container
for CONTAINER in results-server nuclei; do
    kubectl cp "$NAMESPACE/$POD_NAME:/results/vuln-scan.jsonl" "public/reports/vuln-scan.jsonl" -c "$CONTAINER" 2>/dev/null && break || true
done

for CONTAINER in results-server nuclei; do
    kubectl cp "$NAMESPACE/$POD_NAME:/results/scan-meta.json" "public/reports/scan-meta.json" -c "$CONTAINER" 2>/dev/null && break || true
done

for CONTAINER in results-server nuclei; do
    kubectl cp "$NAMESPACE/$POD_NAME:/results/scan-log.txt" "public/reports/scan-log.txt" -c "$CONTAINER" 2>/dev/null && break || true
done

# Extract targets list so the report generator can show all scanned targets
for CONTAINER in nuclei results-server; do
    kubectl cp "$NAMESPACE/$POD_NAME:/config/targets.txt" "public/reports/targets.txt" -c "$CONTAINER" 2>/dev/null && break || true
done

# --- Generate consolidated JSON report ---
python3 -c "
import json, sys
from datetime import datetime, timezone

# Read scan metadata
meta = {}
try:
    with open('public/reports/scan-meta.json') as f:
        meta = json.load(f)
except:
    meta = {'scanner': 'nuclei', 'timestamp': datetime.now(timezone.utc).isoformat(), 'total_findings': 0}

# Read JSONL findings
findings = []
severity_counts = {'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'info': 0, 'unknown': 0}
target_stats = {}

try:
    with open('public/reports/vuln-scan.jsonl') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                finding = json.loads(line)
                sev = finding.get('info', {}).get('severity', 'unknown').lower()
                severity_counts[sev] = severity_counts.get(sev, 0) + 1

                matched = finding.get('matched-at', finding.get('host', '?'))
                template_id = finding.get('template-id', '?')
                name = finding.get('info', {}).get('name', '?')
                desc = finding.get('info', {}).get('description', '')
                tags = finding.get('info', {}).get('tags', [])
                matcher_name = finding.get('matcher-name', '')
                curl_cmd = finding.get('curl-command', '')
                extracted = finding.get('extracted-results', [])

                # Track per-target stats
                host = finding.get('host', matched.split('/')[2] if '://' in matched else matched)
                if host not in target_stats:
                    target_stats[host] = {'total': 0, 'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'info': 0}
                target_stats[host]['total'] += 1
                target_stats[host][sev] = target_stats[host].get(sev, 0) + 1

                findings.append({
                    'template_id': template_id,
                    'name': name,
                    'severity': sev,
                    'matched_at': matched,
                    'host': host,
                    'description': (desc or '')[:200],
                    'tags': tags if isinstance(tags, list) else (tags.split(',') if isinstance(tags, str) else []),
                    'matcher_name': matcher_name,
                    'curl_command': curl_cmd[:300] if curl_cmd else '',
                    'extracted': extracted[:5] if isinstance(extracted, list) else [],
                })
            except json.JSONDecodeError:
                continue
except FileNotFoundError:
    pass

# Read configured targets to ensure all appear in the report (even with 0 findings)
try:
    import re
    with open('public/reports/scan-meta.json') as f:
        scan_meta = json.load(f)
    # Try to read targets from the configmap (extracted alongside results)
    targets_file = None
    for path in ['public/reports/targets.txt']:
        try:
            with open(path) as f:
                targets_file = f.read()
        except FileNotFoundError:
            continue
    if targets_file:
        for line in targets_file.strip().splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            # Extract hostname from URL
            host = line
            if '://' in line:
                try:
                    host = line.split('://')[1].split('/')[0]
                except:
                    pass
            if host not in target_stats:
                target_stats[host] = {'total': 0, 'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'info': 0}
except Exception:
    pass

# Build consolidated report
report = {
    'metadata': meta,
    'summary': severity_counts,
    'total': sum(severity_counts.values()),
    'targets': [
        {'host': host, **stats}
        for host, stats in sorted(target_stats.items(), key=lambda x: x[1]['total'], reverse=True)
    ],
    'findings': sorted(findings, key=lambda x: ['critical','high','medium','low','info','unknown'].index(x['severity']) if x['severity'] in ['critical','high','medium','low','info','unknown'] else 99),
    'generated_at': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC'),
}

with open('public/reports/vuln-scan.json', 'w') as f:
    json.dump(report, f, indent=2)

print(f'Generated: public/reports/vuln-scan.json ({report[\"total\"]} findings)')
"

# --- Generate markdown report ---
python3 -c "
import json
from datetime import datetime, timezone

with open('public/reports/vuln-scan.json') as f:
    data = json.load(f)

meta = data.get('metadata', {})
summary = data.get('summary', {})
targets = data.get('targets', [])
findings = data.get('findings', [])
total = data.get('total', 0)

report = '# Network Vulnerability Scan Report\n\n'
report += f'**Scanner**: {meta.get(\"scanner\", \"nuclei\")}\n'
report += f'**Version**: {meta.get(\"version\", \"?\")}\n'
report += f'**Timestamp**: {meta.get(\"timestamp\", \"?\")}\n'
report += f'**Targets Scanned**: {meta.get(\"targets_scanned\", \"?\")}\n\n'

report += '## Summary\n\n'
report += '| Severity | Count |\n|----------|-------|\n'
icons = {'critical': '🔴', 'high': '🟠', 'medium': '🟡', 'low': '🔵', 'info': 'ℹ️'}
for sev in ['critical', 'high', 'medium', 'low', 'info']:
    report += f'| {icons.get(sev, \"\")} {sev.upper()} | {summary.get(sev, 0)} |\n'
report += f'| **Total** | **{total}** |\n\n'

if targets:
    report += '## Targets\n\n'
    report += '| Host | Total | Critical | High | Medium | Low | Info |\n'
    report += '|------|-------|----------|------|--------|-----|------|\n'
    for t in targets:
        report += f'| {t[\"host\"]} | {t[\"total\"]} | {t.get(\"critical\",0)} | {t.get(\"high\",0)} | {t.get(\"medium\",0)} | {t.get(\"low\",0)} | {t.get(\"info\",0)} |\n'
    report += '\n'

if findings:
    report += '## Findings\n\n'
    report += '| Template | Name | Severity | Target |\n'
    report += '|----------|------|----------|--------|\n'
    for f in findings:
        report += f'| {f[\"template_id\"]} | {f[\"name\"]} | {f[\"severity\"].upper()} | {f[\"matched_at\"][:80]} |\n'

with open('public/reports/vuln-scan-report.md', 'w') as f:
    f.write(report)

print(f'Generated: public/reports/vuln-scan-report.md')
"

# --- Cleanup ---
echo "Cleaning up scanner job..."
kubectl delete job "$JOB_NAME" -n "$NAMESPACE" --ignore-not-found=true 2>/dev/null || true
kubectl delete configmap vuln-scanner-config -n "$NAMESPACE" --ignore-not-found=true 2>/dev/null || true

echo ""
echo "Vulnerability Scan Complete."
echo "JSON report:     public/reports/vuln-scan.json"
echo "Markdown report: public/reports/vuln-scan-report.md"
echo "Scan log:        public/reports/scan-log.txt"
