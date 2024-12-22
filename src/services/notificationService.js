import API from "./axiosConfig";

const notificationService = {
    getByUser: async (idUser) => {
        try {
            let res = await API.get("/Notification/getByUser/"+idUser);
            return res?.data;
        } catch (error) {
            throw error;
        }
    },
    isRead: async (idUser) => {
        try {
            let res = await API.put("/Notification/isRead/"+idUser);
            return res?.data;
        } catch (error) {
            throw error;
        }
    },
    delete: async (idUser) => {
        try {
            let res = await API.put("/Notification/delete/"+idUser);
            return res?.data;
        } catch (error) {
            throw error;
        }
    }
}

export default notificationService;
