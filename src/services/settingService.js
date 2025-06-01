import API from "./axiosConfig";

const settingService = {
    getAll: async () => {
        try {
            const res = await API.get('/Setting');
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const res = await API.get(`/Setting/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getByKey: async (key) => {
        try {
            const res = await API.get(`/Setting/key/${key}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (setting) => {
        try {
            const res = await API.post('/Setting', setting);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (setting) => {
        try {
            const res = await API.put(`/Setting/${setting.id}`, setting);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const res = await API.delete(`/Setting/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    }
};

export default settingService;
