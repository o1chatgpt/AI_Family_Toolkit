#!/bin/bash
# AI Family Toolkit - Local Dev Runner

echo "🚀 Starting AI Family Toolkit in dev mode..."
if ! command -v pnpm &> /dev/null
then
    echo "⚠️ pnpm could not be found, installing with npm..."
    npm install -g pnpm
fi

pnpm install
pnpm dev
