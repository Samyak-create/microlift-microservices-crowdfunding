# Test Media Service Upload via Gateway
$testFile = "valid_5mb.img"
cmd /c "if not exist $testFile fsutil file createnew $testFile 5242880"

$url = "http://localhost:8080/api/media/upload"

Write-Host "--- TEST: Upload 5MB to Media Service via Gateway ---"
cmd /c "curl.exe -v -F "file=@valid_5mb.img" $url > media_test_result.txt 2>&1"
