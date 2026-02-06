$ErrorActionPreference = "Continue"

Write-Host "Starting MicroLift Services in visible windows..." -ForegroundColor Green
Write-Host "Close each window to stop that service" -ForegroundColor Yellow
Write-Host ""

# 1. Discovery Server  
Write-Host "Starting Discovery Server (8761)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'f:\Project\MicroLift\backend\discovery-server'; Write-Host 'Discovery Server' -ForegroundColor Cyan; mvn spring-boot:run"
Start-Sleep -Seconds 15

# 2. API Gateway
Write-Host "Starting API Gateway (8080)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'f:\Project\MicroLift\backend\api-gateway'; Write-Host 'API Gateway' -ForegroundColor Cyan; mvn spring-boot:run"
Start-Sleep -Seconds 10

# 3. Auth Service
Write-Host "Starting Auth Service (8081)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'f:\Project\MicroLift\backend\auth-service'; Write-Host 'Auth Service' -ForegroundColor Cyan; mvn spring-boot:run"

# 4. Campaign Service  
Write-Host "Starting Campaign Service (8082)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'f:\Project\MicroLift\backend\campaign-service'; Write-Host 'Campaign Service' -ForegroundColor Cyan; mvn spring-boot:run"

# 5. Donation Service
Write-Host "Starting Donation Service (8083)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'f:\Project\MicroLift\backend\donation-service'; Write-Host 'Donation Service' -ForegroundColor Cyan; mvn spring-boot:run"

# 6. Media Service
Write-Host "Starting Media Service (8084)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'f:\Project\MicroLift\backend\media-service'; Write-Host 'Media Service' -ForegroundColor Cyan; mvn spring-boot:run"

Write-Host ""
Write-Host "All services starting in separate windows!" -ForegroundColor Green
Write-Host "Wait 45-60 seconds for full initialization" -ForegroundColor Yellow
