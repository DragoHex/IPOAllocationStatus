#!/bin/bash

cd "$(dirname "$0")/../.."

cd "IPO-Status"

# Run TypeScript check
npx tsc --noEmit
