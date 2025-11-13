# Windows PowerShell script for managing the resume builder
param(
    [Parameter(Mandatory=$true)]
    [string]$Command
)

switch ($Command) {
    "install" {
        Write-Host "Installing all dependencies..." -ForegroundColor Green
        npm install
        Set-Location frontend
        npm install
        Set-Location ../backend
        npm install
        Set-Location ..
        Write-Host "All dependencies installed!" -ForegroundColor Green
    }
    "dev" {
        Write-Host "Starting development servers..." -ForegroundColor Green
        npm run dev
    }
    "build" {
        Write-Host "Building frontend..." -ForegroundColor Green
        npm run build
    }
    "start" {
        Write-Host "Starting production server..." -ForegroundColor Green
        npm start
    }
    default {
        Write-Host "Usage: .\manager.ps1 [install|dev|build|start]" -ForegroundColor Yellow
        Write-Host "  install - Install all dependencies"
        Write-Host "  dev     - Start development servers"
        Write-Host "  build   - Build frontend for production"
        Write-Host "  start   - Start production server"
    }
}
