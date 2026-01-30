# Create a 5MB dummy file to trigger the limit (if it's checking >1MB)
$testFile = "large_test.img"
fsutil file createnew $testFile 5242880 # 5MB

$directUrl = "http://localhost:8082/api/campaigns"
$gatewayUrl = "http://localhost:8080/api/campaigns"

Write-Host "--- TEST 1: Direct to Campaign Service (8082) ---"
try {
    # We use curl because it's reliable for multipart
    # -v for verbose to see headers
    # -o /dev/null to hide body output (or in PS: Out-Null)
    $output = curl -v -F "campaign=@test_upload.js" -F "thumbnail=@$testFile" $directUrl 2>&1
    
    if ($output -match "413 Request Entity Too Large") {
        Write-Host "RESULT: FAILED (413) on Direct Service 8082" -ForegroundColor Red
    } elseif ($output -match "200") {
        Write-Host "RESULT: SUCCESS (200) on Direct Service 8082" -ForegroundColor Green
    } else {
        Write-Host "RESULT: UNKNOWN response on Direct Service 8082"
        $output | Select-Object -First 10
    }
} catch {
    Write-Host "Error connecting to 8082"
}

Write-Host "`n--- TEST 2: Through API Gateway (8080) ---"
try {
    $output = curl -v -F "campaign=@test_upload.js" -F "thumbnail=@$testFile" $gatewayUrl 2>&1
    
    if ($output -match "413 Request Entity Too Large") {
        Write-Host "RESULT: FAILED (413) on Gateway 8080" -ForegroundColor Red
    } elseif ($output -match "200") {
        Write-Host "RESULT: SUCCESS (200) on Gateway 8080" -ForegroundColor Green
    } else {
         Write-Host "RESULT: UNKNOWN response on Gateway 8080"
         $output | Select-Object -First 10
    }
} catch {
    Write-Host "Error connecting to 8080"
}
