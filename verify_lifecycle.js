import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_BASE = 'http://localhost:8080/api';
const TIMESTAMP = Date.now();

// 1. Utilities
const log = (msg) => console.log(`[TEST] ${msg}`);
const err = (msg, e) => {
    console.error(`[FAIL] ${msg}`, e.response ? e.response.data : e.message);
    process.exit(1);
};

// 2. Dummy Files
if (!fs.existsSync('dummy_thumb.jpg')) fs.writeFileSync('dummy_thumb.jpg', 'fake image content');
if (!fs.existsSync('dummy_doc.pdf')) fs.writeFileSync('dummy_doc.pdf', 'fake doc content');

const run = async () => {
    try {
        log("Starting Comprehensive System Verification...");

        // --- BENEFICIARY FLOW ---
        const benEmail = `ben_${TIMESTAMP}@lift.com`;
        log(`1. Registering Beneficiary: ${benEmail}`);
        await axios.post(`${API_BASE}/auth/register`, {
            fullName: "Test Beneficiary",
            email: benEmail,
            password: "password123",
            role: "BENEFICIARY"
        });

        log("2. Logging in Beneficiary...");
        const benLogin = await axios.post(`${API_BASE}/auth/login`, {
            email: benEmail,
            password: "password123"
        });
        const benToken = benLogin.data.token;
        const benId = benLogin.data.id;
        log(`   > Logged in. Token: ${benToken.substring(0, 10)}... UserID: ${benId}`);

        log("3. Creating Campaign...");
        const form = new FormData();
        const campaignData = {
            title: `Test Campaign ${TIMESTAMP}`,
            category: "EDUCATION",
            goalAmount: 5000,
            description: "Test Description",
            endDate: "2026-12-31",
            location: "Test City",
            beneficiaryId: benId
        };
        // Append JSON as Blob (simulated via string)
        form.append('campaign', JSON.stringify(campaignData), { contentType: 'application/json' });
        form.append('thumbnail', fs.createReadStream('dummy_thumb.jpg'));
        form.append('files', fs.createReadStream('dummy_doc.pdf'));

        const createRes = await axios.post(`${API_BASE}/campaigns`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${benToken}`
            }
        });
        const campaignId = createRes.data.id;
        log(`   > Campaign Created. ID: ${campaignId}. Status: ${createRes.data.status}`);

        // --- ADMIN FLOW ---
        const adminEmail = `admin_${TIMESTAMP}@lift.com`;
        log(`4. Registering Admin User: ${adminEmail}`);
        // Note: Creating as BENEFICIARY first, then will need manual upgrade? 
        // Actually, let's see if we can register as ADMIN directly? 
        // The default registration might allow it if no restrictions? 
        // If not, we will need to use the 'promote' logic. 
        // Let's try registering as ADMIN first.
        let adminRole = "ADMIN";
        await axios.post(`${API_BASE}/auth/register`, {
            fullName: "Test Admin",
            email: adminEmail,
            password: "password123",
            role: adminRole
        });
        // If the backend restricts ADMIN registration, this might fail or default to USER. 
        // Assuming for testing purposes it works or we simulate logic.

        // HACK: Start a child process to update DB? 
        // Easier: Just trust the registration for now. If role defaults to DONOR, this step will fail.

        log("5. Logging in Admin...");
        const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
            email: adminEmail,
            password: "password123"
        });
        const adminToken = adminLogin.data.token;

        // Check if actually admin?
        if (adminLogin.data.role !== 'ADMIN') {
            log("   ! Registered user is not ADMIN. Manual DB Update required.");
            console.log("   ! PLEASE RUN SQL UPDATE MANUALLY IF THIS FAILS.");
        }

        log(`6. Approving Campaign ${campaignId}...`);
        await axios.put(`${API_BASE}/campaigns/${campaignId}/status?status=ACTIVE`, {}, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        log("   > Campaign Approved (ACTIVE).");

        // --- DONOR FLOW ---
        const donorEmail = `donor_${TIMESTAMP}@lift.com`;
        log(`7. Registering Donor: ${donorEmail}`);
        await axios.post(`${API_BASE}/auth/register`, {
            fullName: "Test Donor",
            email: donorEmail,
            password: "password123",
            role: "DONOR"
        });

        log("8. Logging in Donor...");
        const donorLogin = await axios.post(`${API_BASE}/auth/login`, {
            email: donorEmail,
            password: "password123"
        });
        const donorToken = donorLogin.data.token;
        const donorId = donorLogin.data.id;

        log("9. Making Mock Donation (₹500)...");
        const donationData = {
            amount: 500,
            campaignId: campaignId,
            donorId: donorId,
            isAnonymous: false,
            paymentMethod: "mock_qr"
        };
        await axios.post(`${API_BASE}/donations`, donationData, {
            headers: { 'Authorization': `Bearer ${donorToken}` }
        });
        log("   > Donation Successful.");

        // --- VERIFICATION ---
        log("10. Verifying Campaign Funds...");
        const campRes = await axios.get(`${API_BASE}/campaigns/${campaignId}`);
        log(`DEBUG: Campaign Data: ${JSON.stringify(campRes.data)}`); // [DEBUG]
        const raised = campRes.data.raisedAmount;

        if (raised === 500) {
            log(`SUCCESS: Campaign Raised Amount is ₹${raised}. Full Flow Verified!`);
        } else {
            throw new Error(`Expected ₹500, found ₹${raised}`);
        }

    } catch (e) {
        err("Verification Failed", e);
    }
};

run();
