import API from './axiosConfig';

const UserService = {
    getAll: async () => {
        try {
            const response = await API.get('/User');
            return response?.data;
        } catch (error) {
            throw error;  // Ném lỗi để xử lý ở nơi gọi service
        }
    },

}

export default UserService;
