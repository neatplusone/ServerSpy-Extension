#!/bin/bash
# Sign for addons.mozilla.org. Credentials come from the environment:
#   WEB_EXT_API_KEY=user:... WEB_EXT_API_SECRET=... ./build.sh
set -euo pipefail
: "${WEB_EXT_API_KEY:?set WEB_EXT_API_KEY}" "${WEB_EXT_API_SECRET:?set WEB_EXT_API_SECRET}"
web-ext lint
web-ext sign --channel=listed --api-key="$WEB_EXT_API_KEY" --api-secret="$WEB_EXT_API_SECRET"
