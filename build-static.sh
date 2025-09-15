#!/usr/bin/env bash
set -e
rm -rf dist
vite build --config vite.client.config.ts
# Sicherheitsnetz: entferne versehentlich erzeugte Server-Files
rm -f dist/index.* dist/server.* || true