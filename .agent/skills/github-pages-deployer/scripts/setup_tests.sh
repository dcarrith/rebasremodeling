#!/bin/bash
# scripts/setup_tests.sh

echo "Installing Vitest and testing dependencies..."
npm install -D vitest @testing-library/react @testing-library/dom jsdom

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
ROOT_DIR="$SCRIPT_DIR/../../../.."

echo "Creating tests directory..."
mkdir -p "$ROOT_DIR/tests"

echo "Copying test assets..."
cp "$SCRIPT_DIR/../assets/App.test.tsx" "$ROOT_DIR/tests/App.test.tsx"

# Create a vitest.config.ts file in project root if it doesn't exist
if [ ! -f "$ROOT_DIR/vitest.config.ts" ]; then
cat << 'EOF' > "$ROOT_DIR/vitest.config.ts"
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
EOF
fi

echo "Test setup complete. You can run tests via 'npx vitest run' from the project root."
