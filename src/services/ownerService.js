import API from "./axiosConfig";

const ownerService = {
    getProfileOwnerStay: async (idOwner) => {
        try {
            const res = await API.get(`/Owner/getProfileOwnerStay?idOwner=${idOwner}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (ownerStay) => {
        try {
            const res = await API.put('/Owner/updateProfile', ownerStay);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (userId, oldPassword, newPassword) => {
        try {
            const res = await API.put(`/Owner/changePassword?userId=${userId}&oldPassword=${oldPassword}&newPassword=${newPassword}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    }
};

export default ownerService;

