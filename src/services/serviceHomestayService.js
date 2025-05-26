import API from "./axiosConfig";

const serviceHomestayService = {
    getAllServices: async (idOwner) => {
        try {
            const res = await API.get(`/HomeStay/getAllService?idOwner=${idOwner}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getServiceById: async (id) => {
        try {
            const res = await API.get(`/HomeStay/services/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    addService: async (service) => {
        try {
            const res = await API.post('/HomeStay/services', service);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    updateService: async (service) => {
        try {
            const res = await API.put(`/HomeStay/services/${service.serviceID}`, service);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    deleteService: async (serviceId) => {
        try {
            const res = await API.delete(`/HomeStay/services/${serviceId}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },
};

export default serviceHomestayService;


