import API from "./axiosConfig";

const menuService = {
    // Lấy tất cả menu
    getAll: async () => {
        try {
            const res = await API.get('/Menu');
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy menu theo ID
    getByID: async (id) => {
        try {
            const res = await API.get(`/Menu/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    // Tạo menu mới
    create: async (data) => {
        try {
            const res = await API.post('/Menu', data);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật menu
    update: async (id, data) => {
        try {
            const res = await API.put(`/Menu/${id}`, data);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    // Xóa menu
    delete: async (menuId) => {
        try {
            const res = await API.delete(`/Menu/${menuId}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },
};

export default menuService;
