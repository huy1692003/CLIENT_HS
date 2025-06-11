import API from "./axiosConfig"

const dashboardService = {
    getDashboadOwner: async (idOwner) => {
        try {
            let res = await API.get("/Dasboard/owner/"+idOwner)
            return res?.data
        } catch (error) {
            throw error
        }
    },
    getRevenueOwner: async (idOwner,req) => {
        try {
            let res = await API.post("/Dasboard/owner/getBookingStatistics?OwnerId="+idOwner,req)
            return res?.data
        } catch (error) {
            throw error
        }
    },
    getDashboadAdmin: async () => {
        try {
            let res = await API.get("/Dasboard/admin")
            return res?.data
        } catch (error) {
            throw error
        }
    },

  
    
}
export default dashboardService