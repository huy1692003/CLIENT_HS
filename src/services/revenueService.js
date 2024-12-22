import API from "./axiosConfig";

const revenueService = {
    getRevenue: async (paginate={page:1,pageSize:10},search) => {
        try {
            let res = await API.post(`/Revenue/GetAllRevenueByDate?Page=${paginate.page}&PageSize=${paginate.pageSize}`,search);
            return res?.data;
        } catch (error) {
            throw error;
        }
    },
    exportExcel: async (search) => {
        try {
            let res = await API.post(`/Revenue/exportExcel`,search,{
                responseType: 'blob', // Đảm bảo nhận về file Blob
              });
            return res?.data;
        } catch (error) {
            throw error;
        }
    },
   
}

export default revenueService;
