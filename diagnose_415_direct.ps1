# Test JSON Post Direct to 8082
$url = "http://localhost:8082/api/campaigns"
Write-Host "Testing JSON POST to $url..."

cmd /c 'curl.exe -v -H "Content-Type: application/json" -d "{\"title\":\"Test JSON\",\"goalAmount\":100,\"description\":\"Desc\",\"beneficiaryId\":1}" http://localhost:8082/api/campaigns > headers_8082.txt 2>&1'

$content = Get-Content headers_8082.txt
$statusLine = $content | Where-Object { $_ -match "< HTTP/1.1" }
Write-Host "Status Line: $statusLine"

if ($statusLine -match "200") {
    Write-Host "SUCCESS: Service 8082 accepts JSON" -ForegroundColor Green
} elseif ($statusLine -match "415") {
    Write-Host "FAILURE: Service 8082 returns 415" -ForegroundColor Red
} else {
    Write-Host "UNKNOWN: See headers_8082.txt"
}
