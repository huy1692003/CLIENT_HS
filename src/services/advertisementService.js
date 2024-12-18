import API from "./axiosConfig"

const advertisementService = {
    getAllAdvertisements: async () => {
        try {
            let res = await API.get("/Advertisement")
            return res?.data
        } catch (error) {
            throw error
        }
    },

    getAdvertisementManager: async (status = -1, owner = "", search) => {
        try {
            let res = await API.post(`/Advertisement/getAdvertisementManager?status=${status}&owner=${owner}`, search)
            return res?.data
        } catch (error) {
            throw error
        }
    },

    getAdvertisementById: async (id) => {
        try {
            let res = await API.get(`/Advertisement/${id}`)
            console.log(res)
            return res?.data
        } catch (error) {
            throw error
        }
    },

    createAdvertisement: async (advertisementData) => {
        try {
            let res = await API.post("/Advertisement", advertisementData)
            return res?.data
        } catch (error) {
            throw error
        }
    },

    updateAdvertisement: async (id, advertisementData) => {
        try {
            let res = await API.put(`/Advertisement/${id}`, advertisementData)
            return res?.data
        } catch (error) {
            throw error
        }
    },

    deleteAdvertisement: async (id) => {
        try {
            let res = await API.delete(`/Advertisement/${id}`)
            return res?.data
        } catch (error) {
            throw error
        }
    },

    incrementClick: async (id) => {
        try {
            let res = await API.put(`/Advertisement/incrementClick/${id}`)
            return res?.data
        } catch (error) {
            throw error
        }
    }

    , updateStatusAdver: async (id, status, reasonReject = "") => {
        try {
            let res = await API.put(`/Advertisement/updateStatus?idAd=${id}&status=${status}&reasonReject=${reasonReject}`)
            return res?.data
        } catch (error) {
            throw error
        }
    }
    ,
    updateClick: async (id) => {
        try {
            let res = await API.get(`/Advertisement/updateView/` + id)
            return res?.data
        } catch (error) {
            throw error
        }
    }

}

export default advertisementService
