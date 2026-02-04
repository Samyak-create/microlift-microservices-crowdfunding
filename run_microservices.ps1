# Startup Script for MicroLift Microservices
Write-Host "Starting MicroLift Microservices..." -ForegroundColor Green

$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"

# 1. Build All (Optional, if not built)
Write-Host "Building services..."
cd backend
mvn clean install -DskipTests
cd ..

# Function to start service in new window
function Start-Service {
    param($path, $name)
    Write-Host "Starting $name..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$path'; mvn spring-boot:run"
    Start-Sleep -Seconds 10 # Wait a bit for each to initialize
}

Start-Service "backend\discovery-server" "Discovery Server"
Start-Sleep -Seconds 10 # Extra wait for Eureka

Start-Service "backend\api-gateway" "API Gateway"
Start-Service "backend\auth-service" "Auth Service"
Start-Service "backend\campaign-service" "Campaign Service"
Start-Service "backend\donation-service" "Donation Service"
Start-Service "backend\media-service" "Media Service"

# 3. Start Frontend
Write-Host "Starting Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm run dev"

Write-Host "All services started!" -ForegroundColor Green
Write-Host "Discovery Server: http://localhost:8761"
Write-Host "API Gateway: http://localhost:8080"
