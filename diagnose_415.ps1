# Check Ports
$p8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
$p8082 = Get-NetTCPConnection -LocalPort 8082 -ErrorAction SilentlyContinue

Write-Host "Port 8080 (Gateway): $(if ($p8080) {'OPEN'} else {'CLOSED'})"
Write-Host "Port 8082 (Campaign): $(if ($p8082) {'OPEN'} else {'CLOSED'})"

# Test JSON Post
$url = "http://localhost:8080/api/campaigns"
Write-Host "Testing JSON POST to $url..."
# Use curl.exe -v
cmd /c 'curl.exe -v -H "Content-Type: application/json" -d "{\"title\":\"Test JSON\",\"goalAmount\":100,\"description\":\"Desc\",\"beneficiaryId\":1}" http://localhost:8080/api/campaigns'
