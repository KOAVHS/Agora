#!/usr/bin/env bash
# Script para desarrollo: arranca Uvicorn desde la carpeta backend
cd "$(dirname "$0")"
python -m uvicorn app.main:app --reload
