import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const campaignService = {
    getPublicCampaigns: async () => {
        const response = await axios.get(`${API_BASE}/campaigns`);
        const getFullImageUrl = (path) => {
            const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NjY2NiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
            if (!path) return PLACEHOLDER;
            return path.startsWith('http') ? path : `http://localhost:8080/${path}`;
        };
        const activeCampaigns = Array.isArray(response.data) ? response.data : [];
        return activeCampaigns.map(campaign => ({
            ...campaign,
            image: getFullImageUrl(campaign.imageUrl), // Map backend field to frontend expectation
            goal: campaign.goalAmount,
            raised: campaign.raisedAmount || 0
        }));
    },
    getCampaignsByBeneficiary: async (beneficiaryId) => {
        const response = await axios.get(`${API_BASE}/campaigns/beneficiary/${beneficiaryId}`);
        const activeCampaigns = Array.isArray(response.data) ? response.data : [];
        const getFullImageUrl = (path) => {
            const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NjY2NiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
            if (!path) return PLACEHOLDER;
            return path.startsWith('http') ? path : `http://localhost:8080/${path}`;
        };
        return activeCampaigns.map(campaign => ({
            ...campaign,
            image: getFullImageUrl(campaign.imageUrl),
            goal: campaign.goalAmount,
            raised: campaign.raisedAmount || 0
        }));
    },
    getCampaignById: async (id) => {
        const response = await axios.get(`${API_BASE}/campaigns/${id}`);
        const data = response.data;
        const getFullImageUrl = (path) => {
            const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NjY2NiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
            if (!path) return PLACEHOLDER;
            return path.startsWith('http') ? path : `http://localhost:8080/${path}`;
        };
        return { ...data, imageUrl: getFullImageUrl(data.imageUrl) };
    },
    createCampaign: async (campaignData) => {
        const response = await axios.post(`${API_BASE}/campaigns`, campaignData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    },
    getPendingCampaigns: async () => {
        const response = await axios.get(`${API_BASE}/campaigns/pending`);
        return response.data;
    },
    verifyCampaign: async (id, status) => {
        const response = await axios.put(`${API_BASE}/campaigns/${id}/status?status=${status}`);
        return response.data;
    },
    getCompletedCampaigns: async () => {
        const response = await axios.get(`${API_BASE}/campaigns/completed`);
        return response.data;
    },
    deleteCampaign: async (id) => {
        await axios.delete(`${API_BASE}/campaigns/${id}`);
    }
};

export const authService = {
    uploadKyc: async (email, file) => {
        // Step 1: Upload to Media Service
        const mediaServiceModule = await import('./mediaService');
        const mediaService = mediaServiceModule.default;
        const mediaResponse = await mediaService.uploadFile(file);
        const kycUrl = mediaResponse.url;
        console.log("DEBUG: Calling updateKycUrl with", email, kycUrl);

        // Step 2: Update Auth Service with the URL
        const response = await axios.post(`${API_BASE}/auth/update-kyc`, { email, kycUrl });
        return response.data;
    },
    updateKycUrl: async (email, kycUrl) => {
        const response = await axios.post(`${API_BASE}/auth/update-kyc`, { email, kycUrl });
        return response.data;
    },
    verifyUser: async (userId, status) => {
        const response = await axios.post(`${API_BASE}/auth/verify-user/${userId}?status=${status}`);
        return response.data;
    },
    getUserById: async (userId) => {
        const response = await axios.get(`${API_BASE}/auth/users/${userId}`);
        return response.data;
    }
};

export const donationService = {
    verifyDonation: async (paymentData) => {
        const response = await axios.post(`${API_BASE}/donations/verify`, paymentData);
        return response.data;
    },
    getDonationsByDonor: async (donorId) => {
        const response = await axios.get(`${API_BASE}/donations/donor/${donorId}`);
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
