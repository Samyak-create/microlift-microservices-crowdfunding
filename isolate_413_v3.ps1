# Capture output to files
$testFile = "large_test.img"
# fsutil might error if file exists, ignore
cmd /c "if not exist $testFile fsutil file createnew $testFile 5242880"

$directUrl = "http://localhost:8082/api/campaigns"
$gatewayUrl = "http://localhost:8080/api/campaigns"

Write-Host "Running Test 1 (8082)..."
# Capture stderr (2) to stdout (1) and redirect to file
cmd /c "curl.exe -v -F "campaign=@test_upload.js" -F "thumbnail=@large_test.img" $directUrl > result_8082.txt 2>&1"

Write-Host "Running Test 2 (8080)..."
cmd /c "curl.exe -v -F "campaign=@test_upload.js" -F "thumbnail=@large_test.img" $gatewayUrl > result_8080.txt 2>&1"

Write-Host "Done."
