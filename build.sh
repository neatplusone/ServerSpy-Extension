#!/bin/bash
# Lint and zip the extension into web-ext-artifacts/ for manual upload to AMO / Chrome Web Store.
set -euo pipefail
npx web-ext lint
npx web-ext build --overwrite-dest
