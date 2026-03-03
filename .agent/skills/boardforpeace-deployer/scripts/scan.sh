#!/bin/bash
set -e

IMAGE="boardforpeace-app:latest"

echo "Scanning $IMAGE for vulnerabilities..."

mkdir -p public/reports

if command -v trivy &> /dev/null; then
    echo "Running Trivy..."
    trivy image --format json --output public/reports/security-scan.json $IMAGE
    echo "Report saved to public/reports/security-scan.json"
elif command -v grype &> /dev/null; then
    echo "Running Grype..."
    grype $IMAGE -o json > public/reports/security-scan.json
    echo "Report saved to public/reports/security-scan.json"
else
    echo "No scanner found. Please install trivy or grype."
    echo '{"status": "skipped", "reason": "no scanner found"}' > public/reports/security-scan.json
    exit 0
fi

# Generate human-readable markdown security report
python3 -c "
import json, sys
from datetime import datetime

with open('public/reports/security-scan.json') as f:
    data = json.load(f)

if data.get('status') == 'skipped':
    report = '# Security Scan Report\n\n> **Skipped**: No scanner installed.\n'
    open('public/reports/security-report.md', 'w').write(report)
    sys.exit(0)

results = data.get('Results', [])
severity_order = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN']
severity_counts = {s: 0 for s in severity_order}
all_vulns = []

for result in results:
    for v in result.get('Vulnerabilities', []):
        sev = v.get('Severity', 'UNKNOWN')
        severity_counts[sev] = severity_counts.get(sev, 0) + 1
        all_vulns.append({
            'target': result.get('Target', '?'),
            'type': result.get('Type', '?'),
            'id': v.get('VulnerabilityID', '?'),
            'pkg': v.get('PkgName', '?'),
            'installed': v.get('InstalledVersion', '?'),
            'fixed': v.get('FixedVersion', 'n/a'),
            'severity': sev,
            'title': (v.get('Title', '') or '')[:120],
        })

total = sum(severity_counts.values())
metadata = data.get('Metadata', {})
os_info = metadata.get('OS', {})

report = f'# Security Scan Report\n\n'
report += f'**Generated**: {datetime.now().strftime(\"%Y-%m-%d %H:%M:%S\")}\n'
report += f'**Image**: {data.get(\"ArtifactName\", \"unknown\")}\n'
report += f'**OS**: {os_info.get(\"Family\", \"?\")} {os_info.get(\"Name\", \"?\")}\n\n'

report += '## Summary\n\n'
report += '| Severity | Count |\n|----------|-------|\n'
for sev in severity_order:
    icon = {'CRITICAL': '🔴', 'HIGH': '🟠', 'MEDIUM': '🟡', 'LOW': '🔵', 'UNKNOWN': '⚪'}.get(sev, '⚪')
    report += f'| {icon} {sev} | {severity_counts.get(sev, 0)} |\n'
report += f'| **Total** | **{total}** |\n\n'

report += '## Scan Targets\n\n'
report += '| Target | Type | Vulnerabilities |\n|--------|------|----------------|\n'
for result in results:
    vuln_count = len(result.get('Vulnerabilities', []))
    report += f'| {result.get(\"Target\", \"?\")} | {result.get(\"Type\", \"?\")} | {vuln_count} |\n'
report += '\n'

if all_vulns:
    report += '## Vulnerabilities\n\n'
    report += '| CVE | Package | Installed | Fixed | Severity | Description |\n'
    report += '|-----|---------|-----------|-------|----------|-------------|\n'
    for v in sorted(all_vulns, key=lambda x: severity_order.index(x['severity']) if x['severity'] in severity_order else 99):
        report += f'| {v[\"id\"]} | {v[\"pkg\"]} | {v[\"installed\"]} | {v[\"fixed\"]} | {v[\"severity\"]} | {v[\"title\"]} |\n'
else:
    report += '## ✅ No Vulnerabilities Found\n'

open('public/reports/security-report.md', 'w').write(report)
print('Wrote: public/reports/security-report.md')
"

echo ""
echo "Scan Complete."
echo "JSON report:    public/reports/security-scan.json"
echo "Scan report:    public/reports/security-report.md"
