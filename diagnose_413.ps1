# Create a dummy large file (1MB just to test basics, but ideally larger if testing 10MB limit)
# But user error says 413. 413 means > Limit.
# Default limit is often 256KB or 1MB.
$dummyFile = "test_large_image.jpg"
fsutil file createnew $dummyFile 2097152 # 2MB

# URL for Gateway
$gatewayUrl = "http://localhost:8080/api/campaigns"
# URL for Direct Service
$directUrl = "http://localhost:8082/api/campaigns"

Write-Host "Testing Direct Service (8082)..."
try {
    # Note: Curl in PowerShell is an alias, we use native Curl or Invoke-RestMethod
    # Invoke-RestMethod is tricky with Multipart.
    # We will use simple curl.exe if available or a scripted Multipart sender.
    
    # Let's try to just check if the SERVICE accepts a simple request, 
    # but 413 is specific to POST size.
    
    # We'll use a cURL command string.
    $command = 'curl -v -F "campaign=@test_upload.js" -F "thumbnail=@'+$dummyFile+'" ' + $directUrl
    cmd /c $command
} catch {
    Write-Host "Direct failed: $_"
}

Write-Host "`nTesting Gateway (8080)..."
try {
    $command = 'curl -v -F "campaign=@test_upload.js" -F "thumbnail=@'+$dummyFile+'" ' + $gatewayUrl
    cmd /c $command
} catch {
    Write-Host "Gateway failed: $_"
}
