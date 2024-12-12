import API from "./axiosConfig"

const adminService = {
    login: async (data) => {
        try {
            let res = await API.post("/Administrator/login", data)
            return res?.data
        } catch (error) {
            throw error
        }
    },

    getAll: async () => {
        try {
            let res = await API.get("/Administrator/getAll")
            return res?.data
        } catch (error) {
            throw error
        }
    },

    update: async (data) => {
        try {
            let res = await API.put("/Administrator/update", data)
            return res?.data
        } catch (error) {
            throw error
        }
    },

    insertAdmin: async (data) => {
        try {
            let res = await API.post("/Administrator/insertAdmin", data)
            return res?.data
        } catch (error) {
            throw error
        }
    }
}
export default adminService