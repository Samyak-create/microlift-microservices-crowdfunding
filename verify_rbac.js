import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const register = async (role) => {
    const timestamp = Date.now();
    const user = {
        fullName: `${role} User`,
        email: `${role.toLowerCase()}.${timestamp}@test.com`,
        password: 'password123',
        phoneNumber: '1234567890',
        role: role
    };
    try {
        const res = await axios.post(`${BASE_URL}/auth/register`, user);
        return res.data.token;
    } catch (err) {
        console.error(`Failed to register ${role}:`, err.message);
        return null;
    }
};

const testAccess = async (role, token, endpoint, expectedStatus) => {
    try {
        await axios.get(`${BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (expectedStatus === 200) {
            console.log(`PASS: ${role} -> ${endpoint} (Allowed)`);
        } else {
            console.log(`FAIL: ${role} -> ${endpoint} (Allowed, Expected ${expectedStatus})`);
        }
    } catch (err) {
        if (err.response && err.response.status === expectedStatus) {
            console.log(`PASS: ${role} -> ${endpoint} (Denied: ${err.response.status})`);
        } else {
            console.log(`FAIL: ${role} -> ${endpoint} (Status: ${err.response ? err.response.status : err.message}, Expected ${expectedStatus})`);
        }
    }
};

const runTests = async () => {
    console.log('Starting RBAC Verification...');

    // 1. Register Users
    const adminToken = await register('ADMIN');
    const donorToken = await register('DONOR');
    const beneficiaryToken = await register('BENEFICIARY');

    if (!adminToken || !donorToken || !beneficiaryToken) {
        console.error('Registration failed, aborting tests.');
        return;
    }

    console.log('\n--- Admin Tests ---');
    await testAccess('ADMIN', adminToken, '/admin/dashboard', 200);
    await testAccess('ADMIN', adminToken, '/donor/dashboard', 200);
    await testAccess('ADMIN', adminToken, '/beneficiary/dashboard', 200);

    console.log('\n--- Donor Tests ---');
    await testAccess('DONOR', donorToken, '/admin/dashboard', 403);
    await testAccess('DONOR', donorToken, '/donor/dashboard', 200);
    await testAccess('DONOR', donorToken, '/beneficiary/dashboard', 403);

    console.log('\n--- Beneficiary Tests ---');
    await testAccess('BENEFICIARY', beneficiaryToken, '/admin/dashboard', 403);
    await testAccess('BENEFICIARY', beneficiaryToken, '/donor/dashboard', 403);
    await testAccess('BENEFICIARY', beneficiaryToken, '/beneficiary/dashboard', 200);

    console.log('\nVerification Complete.');
};

runTests();
