import { atom, selector } from "recoil";


var userLocal = sessionStorage.getItem("user") && JSON.parse(sessionStorage.getItem("user"))
export const userState = atom({
    key: "userState",
    default: userLocal || null
})

var adminLocal = sessionStorage.getItem("admin") && JSON.parse(sessionStorage.getItem("admin"))
export const adminState = atom({
    key: "adminState",
    default: adminLocal || null
})


export const isLoadingAdmin = atom({
    key: "isLoadingAdmin",
    default: false
})

export const isLoadingUser = atom({
    key: "isLoadingUser",
    default: false
})
export const isLoadingOwner = atom({
    key: "isLoadingOwner",
    default: false
})

export const initParamseach={
    location: null, // Địa điểm tìm kiếm
    priceRange: null, // Khoảng giá
    name:null,
    numberOfBedrooms: null, // Số phòng ngủ
    numberOfLivingRooms: null, // Số phòng khách
    amenities: new Set(), // Danh sách tiện ích (Sử dụng Set để tránh trùng lặp)
    numberOfBathrooms: null, // Số phòng tắm
    numberOfKitchens: null, // Số nhà bếp
    numberofGuest: null, // Số lượng khách
    dateIn: null, // Ngày đến
    dateOut: null, // Ngày đi
    isCallAPI: false // Cờ để kiểm tra nếu cần gọi API
}
export const paramSearchHT = atom({
    key: "paramSearchHT", // Key xác định atom trong Recoil
    default: initParamseach
});