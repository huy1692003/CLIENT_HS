import API from "./axiosConfig";

const roomService = {
    getListTypeRoom: async () => {
        try {
            const res = await API.get('/Room/getListTypeRoom');
            return res.data;
        } catch (error) {
            throw error;
        }
    },
    getAll: async () => {
        try {
            const res = await API.get('/Room');
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const res = await API.get(`/Room/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getByHomestayId: async (homestayId) => {
        try {
            const res = await API.get(`/Room/homestay/${homestayId}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    add: async (room) => {
        try {
            const res = await API.post('/Room', room);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (room) => {
        try {
            const res = await API.put(`/Room/${room.roomId}`, room);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (roomId) => {
        try {
            const res = await API.delete(`/Room/${roomId}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    addHiddenDates: async (roomId, hiddenDates) => {
        try {
            const res = await API.put(`/Room/addHiddenDates/${roomId}`, hiddenDates);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    
    
};

export default roomService;
