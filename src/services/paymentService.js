import API from "./axiosConfig";

const paymentService = {

    getPaymentByAdmin: async (paginate={page:1,pageSize:10},search,type=1) => {
        try {
            let res = await API.post(`/Payment/getPayment?page=${paginate.page}&pageSize=${paginate.pageSize}&type=${type}`,search)
            return res?.data;
        } catch (error) {
            throw error;
        }
    },
    getPaymentByOwner: async (paginate={page:1,pageSize:10},search,idOwner,type=1) => {
        try {
            let res = await API.post(`/Payment/getPaymentbyOwner?page=${paginate.page}&pageSize=${paginate.pageSize}&idOwner=${idOwner}&type=${type}`,search)
            return res?.data;
        } catch (error) {
            throw error;
        }
    },
   
}

export default paymentService;
