import API from "./axiosConfig"

const bookingService = {
    getBookingDateExisted: async (id) => {
        try {
            let res = await API.get(`/Booking/getBookingDateExisted?idHomeStay=` + id)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    create: async (data) => {
        try {
            let res = await API.post('/Booking/create', data)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    confirm: async (idBooking) => {
        try {
            let res = await API.put('/Booking/confirm/' + idBooking)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    cancel: async (idBooking, reasonCancel) => {
        try {
            let res = await API.put('/Booking/cancel/' + idBooking + `?reasonCancel=${reasonCancel}`)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },
    getBookingByOwner: async (idOwner, status = 0,search) => {
        try {
            let res = await API.post(`/Booking/getBooking?idOwner=${idOwner}&status=${status}`,search)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },

    getBookingByCus:async(idCus,status=1)=>
    {
        try {
            let res = await API.get(`/Booking/getBooking_byCusID?cusID=${idCus}&status=${status}`)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },

    confirmCheckIn:async(idBooking)=>
    {
        try {
            let res = await API.get(`/Booking/confirmCheckIn?bookingID=${idBooking}`)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },

    confirmCheckOut:async(idBooking)=>
    {
        try {
            let res = await API.get(`/Booking/confirmCheckOut?bookingID=${idBooking}`)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },



}
export default bookingService