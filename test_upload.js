// Quick test script to debug the upload issue
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Simulate login and upload
async function testUpload() {
    try {
        // 1. Login first
        console.log('Step 1: Logging in...');
        const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
            email: 'test@ben.com',  // Replace with your actual beneficiary email
            password: 'password123'
        });

        const token = loginRes.data.token;
        console.log('✓ Login successful, token received:', token.substring(0, 20) + '...');

        // 2. Try upload with token
        console.log('\nStep 2: Attempting KYC upload...');
        const formData = new FormData();
        formData.append('file', fs.createReadStream('./dummy_doc.pdf'));
        formData.append('email', 'test@ben.com');

        const uploadRes = await axios.post('http://localhost:8080/api/auth/upload-kyc', formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('✓ Upload successful!', uploadRes.status);

    } catch (error) {
        console.error('✗ Error:', error.response?.status, error.response?.data || error.message);
    }
}

testUpload();
