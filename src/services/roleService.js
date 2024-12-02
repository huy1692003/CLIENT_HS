import API from "./axiosConfig";


const roleService = {
    getAll: async () => {
        try {
            const res = await API.get('/Role/getAll');
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getByID: async (id) => {
        try {
            const res = await API.get(`/Role/getByID/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data) => {
        try {
            const res = await API.post('/Role/create', data);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (data) => {
        try {
            const res = await API.put(`/Role/update`, data);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (roleId) => {
        try {
            const res = await API.delete(`/Role/delete/${roleId}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },
};

export default roleService;
