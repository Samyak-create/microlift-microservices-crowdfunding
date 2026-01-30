# Boundary Test Script
$validFile = "valid_5mb.img"
$hugeFile = "huge_60mb.img"
$jsonFile = "campaign.json"

# Create files
cmd /c "if not exist $validFile fsutil file createnew $validFile 5242880"
cmd /c "if not exist $hugeFile fsutil file createnew $hugeFile 62914560"

# Create valid JSON for the 'campaign' part
Set-Content $jsonFile '{ "title": "Test Campaign", "description": "Desc", "goalAmount": 1000, "beneficiaryId": 1 }'

$url = "http://localhost:8080/api/campaigns"

Write-Host "--- TEST 1: Valid 5MB Upload (Should be 200/201) ---"
# Note: curl -F "part=@file;type=application/json" allows setting content type of the part
# We need to quote carefully for PowerShell calling cmd
# We use a temporary log file to capture output
$cmd = 'curl.exe -v -F "campaign=@campaign.json;type=application/json" -F "thumbnail=@valid_5mb.img" ' + $url + ' > passed.txt 2>&1'
cmd /c $cmd

Write-Host "`n--- TEST 2: Huge 60MB Upload (Should be 413) ---"
$cmd = 'curl.exe -v -F "campaign=@campaign.json;type=application/json" -F "thumbnail=@huge_60mb.img" ' + $url + ' > blocked.txt 2>&1'
cmd /c $cmd

Write-Host "Done."
