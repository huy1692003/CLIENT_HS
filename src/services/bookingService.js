import API from "./axiosConfig"

const bookingService = {
    getBookingDateExisted: async (idHomeStay, idRoom) => {
        try {
            let res = await API.get(`/Booking/getBookingDateExisted?idHomeStay=` + idHomeStay + `&idRoom=${idRoom}`)
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
    getBookingByOwner: async (idOwner, status = 0, page, pageSize, search) => {
        try {
            let res = await API.post(`/Booking/getBooking?idOwner=${idOwner}&status=${status}&Page=${page}&PageSize=${pageSize}`, search)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },

    getBookingByCus: async (phoneCus, emailCus, idCus, status = 1) => {
        try {
            let res = await API.get(`/Booking/getBooking_byCusID?customerID=${idCus}&status=${status}&phoneCus=${phoneCus}&emailCus=${emailCus}`)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },

    confirmCheckIn: async (idBooking) => {
        try {
            let res = await API.get(`/Booking/confirmCheckIn?bookingID=${idBooking}`)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },

    confirmCheckOut: async (idBooking,jsonDetailExtraCost) => {
        try {
            console.log(jsonDetailExtraCost)
            let res = await API.post(`/Booking/confirmCheckOut?bookingID=${idBooking}`,jsonDetailExtraCost)
            return res?.data
        }
        catch (error) {
            throw error
        }
    },



}
export default bookingService