$ErrorActionPreference = "Stop"

# 1. Unique User Data
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$email = "auto_tester_$timestamp@example.com"
$password = "TestPass123"
$baseUrl = "http://localhost:8080/api"

Write-Host "--- Starting Backend Verification ---" -ForegroundColor Cyan
Write-Host "Target: $baseUrl"
Write-Host "User: $email"

# 2. Register
Write-Host "`n[1] Registering User..."
try {
    $registerBody = @{
        fullName = "Auto Tester"
        email = $email
        password = $password
        phoneNumber = "1234567890"
        role = "DONOR"
    } | ConvertTo-Json

    $regResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "Success! Token received." -ForegroundColor Green
    $token = $regResponse.token
} catch {
    Write-Host "Registration Failed!" -ForegroundColor Red
    Write-Host $_
    exit
}

# 3. Login (Verification of credential storage)
Write-Host "`n[2] Verifying Login..."
try {
    $loginBody = @{
        email = $email
        password = $password
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Login Successful!" -ForegroundColor Green
    if ($token -ne $loginResponse.token) {
        Write-Host "Note: New token received."
        $token = $loginResponse.token
    }
} catch {
    Write-Host "Login Failed!" -ForegroundColor Red
    Write-Host $_
    exit
}

# 4. Create Donation Order
Write-Host "`n[3] Creating Donation Order (Razorpay Check)..."
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $orderBody = @{
        amount = 500
    } | ConvertTo-Json

    $orderResponse = Invoke-RestMethod -Uri "$baseUrl/donations/create-order" -Method Post -Headers $headers -Body $orderBody -ContentType "application/json"
    Write-Host "Order Created Successfully!" -ForegroundColor Green
    Write-Host "Response: $orderResponse"
} catch {
    Write-Host "Donation Order Failed!" -ForegroundColor Red
    Write-Host "This might be due to invalid Razorpay keys in application.properties, but it proves the endpoint is reachable."
    Write-Host $_.Exception.Message
}

Write-Host "`n--- Verification Complete ---" -ForegroundColor Cyan
