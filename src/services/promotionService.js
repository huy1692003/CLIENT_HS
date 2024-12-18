import API from "./axiosConfig";

const promotionService = {
    getAll: async () => {
        try {
            let res = await API.get("/promotion/getAll");
            return res?.data;
        } catch (error) {
            throw error;
        }
    },
    getAllByOwnwer: async (stringOwner) => {
        try {
            let res = await API.get("/promotion/getbyOwnerID?owner="+stringOwner);
            return res?.data;
        } catch (error) {
            throw error;
        }
    },
    getByCode: async (code) => {
        try {
            let res = await API.get(`/promotion/getByCode/${code}`);
            return res?.data;
        } catch (error) {
            throw error;
        }
    },
    add: async (data) => {
        try {
            let res = await API.post("/promotion/create", data);
            return res?.data;
        } catch (error) {
            throw error;
        }
    },
    update: async (data) => {
        try {
            let res = await API.put("/promotion/update", data);
            return res?.data;
        } catch (error) {
            throw error;
        }
    },
    delete: async (id) => {
        try {
            let res = await API.delete(`/promotion/delete/${id}`);
            return res?.data;
        } catch (error) {
            throw error;
        }
    }
}

export default promotionService;
