#!/usr/bin/env pwsh
# Development helper: abre dos terminales PowerShell para backend y mobile
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Backend
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$RepoRoot\\backend'; python -m uvicorn app.main:app --reload"

# Mobile (Expo)
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$RepoRoot\\mobile'; npx expo start"
