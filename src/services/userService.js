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
    getOwnerStay: async () => {
        try {
            const response = await API.get('/User/getOwnerStay');
            return response?.data;
        } catch (error) {
            throw error;  // Ném lỗi để xử lý ở nơi gọi service
        }
    },
    deleteOwner: async (id) => {
        try {
            const response = await API.delete('/User/deleteOwner?idOwner='+id);
            return response?.data;
        } catch (error) {
            throw error;  // Ném lỗi để xử lý ở nơi gọi service
        }
    },
    sendMailOwner: async (id,data) => {
        try {
            const response = await API.post('/User/sendmailOwner?idOwner='+id,data);
            return response?.data;
        } catch (error) {
            throw error;  // Ném lỗi để xử lý ở nơi gọi service
        }
    },
    updateStatus: async (idUser, status) => {
        try {
            const response = await API.get('/User/updateStatus/'+idUser+'/'+status);
            return response?.data;
        } catch (error) {
            throw error;  // Ném lỗi để xử lý ở nơi gọi service
        }
    },

}

export default UserService;
