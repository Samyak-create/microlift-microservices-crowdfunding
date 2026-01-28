import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export const campaignService = {
    getPublicCampaigns: async () => {
        const response = await axios.get(`${API_BASE}/campaigns`);
        return response.data.map(campaign => ({
            ...campaign,
            image: campaign.imageUrl, // Map backend field to frontend expectation
            goal: campaign.goalAmount,
            raised: campaign.raisedAmount || 0
        }));
    },
    getCampaignById: async (id) => {
        const response = await axios.get(`${API_BASE}/campaigns/${id}`);
        return response.data;
    },
    createCampaign: async (campaignData) => {
        // Check if data is FormData (has files) or regular JSON
        const headers = campaignData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
        const response = await axios.post(`${API_BASE}/campaigns`, campaignData, { headers });
        return response.data;
    },
    getPendingCampaigns: async () => {
        const response = await axios.get(`${API_BASE}/campaigns/pending`);
        return response.data;
    },
    verifyCampaign: async (id, status) => {
        const response = await axios.put(`${API_BASE}/campaigns/${id}/status?status=${status}`);
        return response.data;
    }
};

export const donationService = {
    verifyDonation: async (paymentData) => {
        const response = await axios.post(`${API_BASE}/donations/verify`, paymentData);
        return response.data;
    },
    createDonation: async (donationData) => {
        const response = await axios.post(`${API_BASE}/donations`, donationData);
        return response.data;
    },
    getDonorDonations: async (donorId) => {
        const response = await axios.get(`${API_BASE}/donations/donor/${donorId}`);
        return response.data;
    },
    getCampaignDonations: async (campaignId) => {
        const response = await axios.get(`${API_BASE}/donations/campaign/${campaignId}`);
        return response.data;
    }
};
