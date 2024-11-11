#!/bin/bash

set -e

if [ -z "$SENTRY_AUTH_TOKEN" ]; then
  echo "Error: SENTRY_AUTH_TOKEN is not set"
  exit 1
fi

# Upload sourcemaps
sentry-cli sourcemaps inject --org unibus-m6 --project api-prod ./dist
sentry-cli sourcemaps upload --org unibus-m6 --project api-prod ./dist
