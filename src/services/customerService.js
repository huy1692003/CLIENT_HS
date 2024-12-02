import API from "./axiosConfig"

const CustomerService = {
    login: async (data) => {
        try {
            let res = await API.get(`/Customer/login?Username=${data.username}&Password=${data.password}`)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    register: async (data) => {
        let res = await API.post('/Customer/register', data)
        return res.data
    },
}
export default CustomerService