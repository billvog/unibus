#!/bin/sh

set -e

if [ -z "$SENTRY_AUTH_TOKEN" ]; then
  echo "Error: SENTRY_AUTH_TOKEN not set"
  exit 1
fi

# Upload sourcemaps
npx sentry-cli sourcemaps inject --org unibus-m6 --project api-prod ./dist
npx sentry-cli sourcemaps upload --org unibus-m6 --project api-prod ./dist
