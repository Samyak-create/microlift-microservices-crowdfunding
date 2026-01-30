# Test JSON Post and parse Status
$url = "http://localhost:8080/api/campaigns"
Write-Host "Testing JSON POST to $url..."

# Capture headers to file
cmd /c 'curl.exe -v -H "Content-Type: application/json" -d "{\"title\":\"Test JSON\",\"goalAmount\":100,\"description\":\"Desc\",\"beneficiaryId\":1}" http://localhost:8080/api/campaigns > headers.txt 2>&1'

$content = Get-Content headers.txt
$statusLine = $content | Where-Object { $_ -match "< HTTP/1.1" }
Write-Host "Status Line: $statusLine"

if ($statusLine -match "200") {
    Write-Host "SUCCESS: Backend accepts JSON" -ForegroundColor Green
} elseif ($statusLine -match "415") {
    Write-Host "FAILURE: Backend returns 415 Unsupported Media Type" -ForegroundColor Red
} else {
    Write-Host "UNKNOWN: See headers.txt"
}
