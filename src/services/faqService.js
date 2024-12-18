import API from "./axiosConfig";

const FAQService = {
    // Lấy tất cả FAQ
    getAll: async () => {
        const response = await API.get('/FAQ/getAll');
        return response.data;
    },

    // Lấy FAQ theo ID
    getById: async (id) => {
        const response = await API.get(`/FAQ/getbyID/${id}`);
        return response.data;
    },

    // Thêm FAQ
    add: async (faq) => {
        const response = await API.post('/FAQ/add', faq);
        return response.data;
    },

    // Cập nhật FAQ
    update: async (faq) => {
        const response = await API.put(`/FAQ/update/${faq.FaqID}`, faq);
        return response.data;
    },

    // Xóa FAQ
    delete: async (id) => {
        const response = await API.delete(`/FAQ/delete/${id}`);
        return response.data;
    },
};

export default FAQService;
