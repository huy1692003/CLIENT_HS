import API from "./axiosConfig";

const categoryArticleService = {
    getAll: async () => {
        try {
            const res = await API.get('/CategoryArticle/getAll');
            return res?.data;
        } catch (error) {
            throw error
        }
    },

    getById: async (id) => {
        try {
            const res = await API.get(`/CategoryArticle/getByID/${id}`);
            return res?.data;
        } catch (error) {
            throw error
        }
    },

    add: async (data) => {
        try {
            const res = await API.post('/CategoryArticle/add', data);
            return res?.data;
        } catch (error) {
            throw error
        }
    },

    update: async (data) => {
        try {
            const res = await API.put(`/CategoryArticle/update`, data);
            return res?.data;
        } catch (error) {
            throw error
        }
    },

    delete: async (id) => {
        try {
            const res = await API.delete(`/CategoryArticle/delete/${id}`);
            return res?.data;
        } catch (error) {
            throw error
        }
    },
};

export default categoryArticleService;
