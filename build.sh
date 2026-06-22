#!/bin/bash
# LeverageFlow — Full Monorepo Build Script
# Runs on Vercel. Builds all 3 apps and places them in dist/.
set -e  # Exit immediately on any error

echo "▶ Building main site..."
npx tsc -b && npx vite build

echo "▶ Creating sub-app output directories..."
mkdir -p dist/demo dist/internal

echo "▶ Building demo app..."
cd apps/demo
npm install --prefer-offline
npm run build
cp -r dist/. ../../dist/demo/
cd ../..

echo "▶ Building internal app..."
cd apps/internal
npm install --prefer-offline
npm run build
cp -r dist/. ../../dist/internal/
cd ../..

echo "✓ All builds complete."
echo "  dist/         → leverage-flow.com/"
echo "  dist/demo/    → leverage-flow.com/demo/"
echo "  dist/internal/→ leverage-flow.com/internal/"
