#!/bin/bash
# Bolig Norge — kjapp setup-script
# Kjør: bash setup.sh

set -e

echo ""
echo "  Bolig Norge — installerer..."
echo ""

if ! command -v node &> /dev/null; then
  echo "  ✗ Node.js mangler. Installer fra nodejs.org først."
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "  ✗ Du har Node $NODE_VERSION. Trenger 18 eller nyere."
  exit 1
fi

echo "  → npm install (tar ~30 sek)"
npm install --silent

echo ""
echo "  ✓ Klart. Kjør nå:"
echo ""
echo "      npm run dev"
echo ""
echo "  Siden åpner automatisk på http://localhost:5173"
echo ""
