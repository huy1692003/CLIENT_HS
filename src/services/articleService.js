import API from "./axiosConfig";

const articleService = {
    // Lấy tất cả bài viết
    getAll: async () => {
        const response = await API.get(`Article/getAll`);
        return response.data;
    },

    // Lấy bài viết theo ID
    getById: async (id) => {
        const response = await API.get(`Article/getByID${id}`);
        return response.data;
    },

    // Lấy bài viết theo danh mục
    getByCate: async (id) => {
        const response = await API.get(`Article/getByCateArticle/${id}`);
        return response.data;
    },

    // Thêm bài viết
    add: async (article) => {
        const response = await API.post(`Article/add`, article);
        return response.data;
    },

    // Cập nhật bài viết
    update: async (article) => {
        const response = await API.put(`Article/update`, article);
        return response.data;
    },

    // Xóa bài viết
    delete: async (id) => {
        const response = await API.delete(`Article/delete/${id}`);
        return response.data;
    },


};

export default articleService;
