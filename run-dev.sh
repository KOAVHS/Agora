#!/usr/bin/env bash
# Development helper: arranca backend en background y Expo en primer plano
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Backend (background)
(cd "$ROOT_DIR/backend" && python -m uvicorn app.main:app --reload) &

# Mobile (Expo, foreground)
cd "$ROOT_DIR/mobile"
npx expo start
