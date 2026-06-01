#!/usr/bin/env pwsh
# Script para desarrollo: arranca Uvicorn desde la carpeta backend
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir
python -m uvicorn app.main:app --reload
