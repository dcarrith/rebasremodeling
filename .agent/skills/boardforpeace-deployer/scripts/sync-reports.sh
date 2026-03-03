#!/bin/bash
set -e

echo "Syncing reports to Kubernetes pods..."

# Get all running boardforpeace-web pod names
PODS=$(kubectl get pods -n boardforpeace --no-headers -o custom-columns=":metadata.name" | grep "^boardforpeace-web-")

if [ -z "$PODS" ]; then
    echo "ERROR: No boardforpeace-web pods found in namespace 'boardforpeace'"
    exit 1
fi

REPORT_DIR="public/reports"
COVERAGE_DIR="public/coverage"

if [ ! -d "$REPORT_DIR" ]; then
    echo "ERROR: No reports directory found. Run test.sh, scan.sh, and analyze.sh first."
    exit 1
fi

for POD in $PODS; do
    echo "  → Syncing to $POD..."

    # Ensure the target directory exists in the pod
    kubectl exec -n boardforpeace "$POD" -- mkdir -p /var/www/html/"$REPORT_DIR"

    # Copy each report file individually to avoid nested directory issues
    for FILE in "$REPORT_DIR"/*; do
        if [ -f "$FILE" ]; then
            kubectl cp "$FILE" "boardforpeace/$POD:/var/www/html/$REPORT_DIR/$(basename "$FILE")"
        fi
    done

    # Copy coverage HTML if it exists
    if [ -d "$COVERAGE_DIR" ]; then
        # Remove old coverage dir in pod and copy fresh
        kubectl exec -n boardforpeace "$POD" -- rm -rf /var/www/html/public/coverage 2>/dev/null || true
        kubectl cp "$COVERAGE_DIR" "boardforpeace/$POD:/var/www/html/public/coverage"
    fi

    # Copy frontend coverage XML report directory if it exists
    if [ -d "public/reports/frontend" ]; then
        kubectl exec -n boardforpeace "$POD" -- rm -rf /var/www/html/public/reports/frontend 2>/dev/null || true
        kubectl cp "public/reports/frontend" "boardforpeace/$POD:/var/www/html/public/reports/frontend"
    fi

    # Copy frontend coverage HTML if it exists
    if [ -d "public/frontend-coverage" ]; then
        kubectl exec -n boardforpeace "$POD" -- rm -rf /var/www/html/public/frontend-coverage 2>/dev/null || true
        kubectl cp "public/frontend-coverage" "boardforpeace/$POD:/var/www/html/public/frontend-coverage"
    fi

    echo "    ✓ $POD synced"
done

echo ""
echo "Reports Synced."
echo "All boardforpeace-web pods now have the latest reports."
