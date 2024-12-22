import SearchHomeStay from "../components/user/SearchHomeStay"
import API from "./axiosConfig"

const homestayService = {

    add: async (data) => {
        try {
            let res = await API.post(`/HomeStay/add`, data)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    update: async (data) => {
        try {
            let res = await API.put(`/HomeStay/update`, data)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    getHomeStayByOwner: async (status, idOwner,search, paginate = { page: 1, pageSize: 10 }) => {
        try {
            let res = await API.post(`/HomeStay/getHomeStayByAdminOrOwner?idOwner=${idOwner}&status=${status}&Page=${paginate.page}&PageSize=${paginate.pageSize}`, search)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    getHomeStayByAdmin: async (status,search, paginate = { page: 1, pageSize: 10 }) => {
        try {
            let res = await API.post(`/HomeStay/getHomeStayByAdminOrOwner?status=${status}&Page=${paginate.page}&PageSize=${paginate.pageSize}`, search)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    getDetail: async (id) => {
        try {
            let res = await API.get('HomeStay/getByID/' + id)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    getAll_ByStatus: async (status, paginate = { page: 1, pageSize: 10 }) => {
        try {
            let res = await API.post('/HomeStay/getAll_ByStatus?status=' + status, paginate)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    updateStatusApproval: async (idHomestay, status) => {
        try {
            let res = await API.put(`/HomeStay/updateStatusApproval?idHomestay=${idHomestay}&&status=${status}`)
            return res
        }
        catch (error) {
            throw error
        }
    },
    deleteHomeStay: async (idHomeStay) => {
        try {
            let res = await API.delete(`/HomeStay/delete/${idHomeStay}`)
            return res
        }
        catch (error) {
            throw error
        }
    },

    getHomeStayViewHight: async () => {
        try {
            let res = await API.get('/HomeStay/getTop20ViewHight')
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    viewDetailHomeStay: async (id) => {
        try {
            let res = await API.get('HomeStay/viewHomeStayByID/' + id)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    getAutocompleteLocation: async (location) => {
        try {
            let res = await API.get('/HomeStay/getAutocompleteLocation?par='+location)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    searchHomeStay: async (page, pageSize, data) => {
        try {
            let res = await API.post(`/HomeStay/searchByCustomer?Page=${page}&PageSize=${pageSize}`, data)
            return res?.data
        }
        catch (error) {
            throw error
        }
    }






}
export default homestayService