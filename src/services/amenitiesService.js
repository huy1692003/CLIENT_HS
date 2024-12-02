import API from "./axiosConfig"

const amenitiesService = {
    getAll: async () => {
        try {

            let res = await API.get("/Amenities")
            return res?.data
        } catch (error) {
            throw error
        }
    },
    add: async (data) => {
        try {

            let res = await API.post("/Amenities/add", data)
            return res?.data
        } catch (error) {
            throw error
        }
    },
    update: async (data) => {
        try {

            let res = await API.put("/Amenities/update", data)
            return res?.data
        } catch (error) {
            throw error
        }
    },

    delete: async (id) => {
        try {

            let res = await API.delete("/Amenities/delete/" + id)
            return res?.data
        } catch (error) {
            throw error
        }
    }

}
export default amenitiesService