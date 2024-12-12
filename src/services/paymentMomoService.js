import API from "./axiosConfig"

const paymentMomoSerivce={
    create: async (data) => {
        let res = await API.post(`/PaymentMomo`,data)
        return res?.data
    },
  
}
export default paymentMomoSerivce