import axios from 'axios';

const API_BASE = 'http://localhost:8081/api';

export const campaignService = {
    getPublicCampaigns: async () => {
        const response = await axios.get(`${API_BASE}/campaigns/public`);
        return response.data.map(campaign => ({
            ...campaign,
            image: campaign.imageUrl || campaign.image,
            goal: campaign.goalAmount || campaign.goal,
            raised: campaign.raisedAmount || campaign.raised || 0
        }));
    },
    getCampaignById: async (id) => {
        const response = await axios.get(`${API_BASE}/campaigns/${id}`);
        return response.data;
    },
    createCampaign: async (campaignData) => {
        const response = await axios.post(`${API_BASE}/campaigns`, campaignData);
        return response.data;
    }
};

export const donationService = {
    processDonation: async (donationData) => {
        const response = await axios.post(`${API_BASE}/donations`, donationData);
        return response.data;
    },
    getDonorDonations: async (donorId) => {
        const response = await axios.get(`${API_BASE}/donations/donor/${donorId}`);
        return response.data;
    }
};
