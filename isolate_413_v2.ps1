# Robust diagnostic script
$testFile = "large_test.img"
fsutil file createnew $testFile 5242880 # 5MB

$directUrl = "http://localhost:8082/api/campaigns"
$gatewayUrl = "http://localhost:8080/api/campaigns"

Write-Host "--- CHECKING PORTS ---"
$p8082 = Get-NetTCPConnection -LocalPort 8082 -ErrorAction SilentlyContinue
if ($p8082) { Write-Host "Port 8082 (Campaign) is OPEN" -ForegroundColor Green } else { Write-Host "Port 8082 is CLOSED" -ForegroundColor Red }

$p8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($p8080) { Write-Host "Port 8080 (Gateway) is OPEN" -ForegroundColor Green } else { Write-Host "Port 8080 is CLOSED" -ForegroundColor Red }

Write-Host "`n--- TEST 1: Direct to Campaign Service (8082) ---"
try {
    # Use curl.exe explicitly to avoid PowerShell alias
    # cmd /c ensures we run the executable
    $cmd = 'curl.exe -v -F "campaign=@test_upload.js" -F "thumbnail=@large_test.img" ' + $directUrl
    cmd /c $cmd
} catch {
    Write-Host "Execution Failed: $_"
}

Write-Host "`n--- TEST 2: Through API Gateway (8080) ---"
try {
    $cmd = 'curl.exe -v -F "campaign=@test_upload.js" -F "thumbnail=@large_test.img" ' + $gatewayUrl
    cmd /c $cmd
} catch {
    Write-Host "Execution Failed: $_"
}
