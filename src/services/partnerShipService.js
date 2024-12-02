import API from "./axiosConfig";

const partnerShipService = {

    registerParner: async (formData) => {
        try {

            let res = await API.post("/PartnershipReg/registerPartnershipReg", formData)
            return res?.data
        } catch (error) {
            throw error
        }
    },
    getByStatus: async (status) => {
        try {

            let res = await API.get("/PartnershipReg/getbyStatus/" + status)
            return res?.data
        } catch (error) {
            throw error
        }
    },
    getByIDPart: async (id) => {
        try {

            let res = await API.get("/PartnershipReg/getById/" + id)
            return res?.data
        } catch (error) {
            throw error
        }
    }
    ,
    confirmPartByID: async (id) => {
        try {

            let res = await API.put("/PartnershipReg/confirmPartReg/" + id)
            return res?.data
        } catch (error) {
            throw error
        }
    },
    cancelPartByID: async (id, rejectReason) => {
        try {

            let res = await API.put("/PartnershipReg/cancelPartReg/" + id + "/" + rejectReason)
            return res?.data
        } catch (error) {
            throw error
        }
    },
};
export default partnerShipService