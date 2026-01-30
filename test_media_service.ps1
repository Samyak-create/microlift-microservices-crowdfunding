# Test Media Service Upload via Gateway
$testFile = "valid_5mb.img"
# Ensure file exists
cmd /c "if not exist $testFile fsutil file createnew $testFile 5242880"

$url = "http://localhost:8080/api/media/upload"

Write-Host "--- TEST: Upload 5MB to Media Service via Gateway ---"
try {
    # Expect JSON response with "url"
    $cmd = 'curl.exe -v -F "file=@valid_5mb.img" ' + $url
    cmd /c $cmd
} catch {
    Write-Host "Execution Failed: $_"
}
