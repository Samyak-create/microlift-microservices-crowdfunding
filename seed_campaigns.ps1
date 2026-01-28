# Seed Sample Campaigns
$ErrorActionPreference = "Stop"

$campaigns = @(
    @{
        title = "Help Aryan Fight Leukaemia"
        description = "My son Aryan is battling severe Leukaemia. We need your support for his chemotherapy and bone marrow transplant. Every contribution brings him closer to a healthy life."
        category = "MEDICAL"
        goalAmount = 1500000.0
        location = "Mumbai, India"
        imageUrl = "https://c.ndtvimg.com/2021-08/ig754dpg_child-patient-generic_625x300_16_August_21.jpg"
        endDate = (Get-Date).AddDays(45).ToString("yyyy-MM-dd")
        beneficiaryId = 1
    },
    @{
        title = "Education for Rural Girls in Bihar"
        description = "Empower 500 girls in rural Bihar with quality education, school supplies, and digital literacy. Help us break the cycle of poverty through education."
        category = "EDUCATION"
        goalAmount = 500000.0
        location = "Patna, Bihar"
        imageUrl = "https://www.smilefoundationindia.org/blog/wp-content/uploads/2022/11/14133465_1170753046317769_3733077678553256086_o-1024x683.jpg"
        endDate = (Get-Date).AddDays(60).ToString("yyyy-MM-dd")
        beneficiaryId = 2
    },
    @{
        title = "Flood Relief for Kerala Victims"
        description = "Urgent funds needed to provide food, shelter, and medical kits to families displaced by the recent devastating floods in Kerala. Join hands to rebuild lives."
        category = "EMERGENCY"
        goalAmount = 2000000.0
        location = "Wayanad, Kerala"
        imageUrl = "https://images.indianexpress.com/2018/08/kerala-floods-759.jpg"
        endDate = (Get-Date).AddDays(15).ToString("yyyy-MM-dd")
        beneficiaryId = 3
    },
    @{
        title = "Clean Water for Drought-Hit Village"
        description = "Building a sustainable rainwater harvesting system for a village in Rajasthan suffering from acute water shortage. Help us bring water to 200 families."
        category = "ENVIRONMENT"
        goalAmount = 800000.0
        location = "Jaisalmer, Rajasthan"
        imageUrl = "https://eng.bharattimes.co.in/wp-content/uploads/2023/06/Rajasthan-water-crisis.jpg"
        endDate = (Get-Date).AddDays(90).ToString("yyyy-MM-dd")
        beneficiaryId = 1
    }
)

foreach ($c in $campaigns) {
    Write-Host "Creating Campaign: $($c.title)..."
    try {
        $body = $c | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/campaigns" -Method Post -Body $body -ContentType "application/json"
        Write-Host "Success! ID: $($response.id)" -ForegroundColor Green
    } catch {
        Write-Host "Failed to create campaign: $($c.title)" -ForegroundColor Red
        Write-Host $_
    }
}
