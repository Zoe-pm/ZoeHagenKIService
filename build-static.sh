#!/usr/bin/env bash
set -e
rm -rf dist
vite build --config vite.client.config.ts
# Alles serverseitige aus dist entfernen, damit Static klappt
rm -f dist/index.* dist/server.* || true