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

var settingLocal = sessionStorage.getItem("setting") && JSON.parse(sessionStorage.getItem("setting"))
export const settingState = atom({
    key: "settingState",
    default: settingLocal || []
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

export const signalR_Connect=atom ({
    key: "signalR_Connect",
    default: null
})

export const initParamseach={
    location: "", // Vị trí
    priceRange: "", // Khoảng giá
    name: "", // Tên
    numberAdults: 1, // Số lượng người lớn
    numberChildren: 0, // Số lượng trẻ em
    numberBaby: 0, // Số lượng em bé
    amenities: [], // Tiện nghi
    dateIn: undefined, // Ngày nhận phòng
    dateOut: undefined, // Ngày trả phòng
    hasBalcony: undefined, // Có ban công
    hasTv: undefined, // Có TV
    hasAirConditioner: undefined, // Có máy lạnh
    hasRefrigerator: undefined, // Có tủ lạnh
    hasWifi: undefined, // Có Wi-Fi
    hasHotWater: undefined, // Có nước nóng
    numberOfBeds: undefined, // Số lượng giường
    bathroomCount: undefined, // Số lượng phòng tắm
    roomSize: "", // Diện tích phòng
    rating: undefined, // Điểm đánh giá
    hasParking: undefined, // Có bãi đỗ xe
    hasPool: undefined, // Có hồ bơi
    hasGarden: undefined, // Có vườn
    homeStayType: undefined, // Loại HomeStay
    hasLakeView: undefined, // Có view hồ
    hasMountainView: undefined, // Có view núi
    hasSeaView: undefined, // Có view biển
    hasRiceFieldView: undefined, // Có view cánh đồng lúa
    hasBilliardTable: undefined, // Có bàn bi-a
    hasManyActivities: undefined, // Có nhiều hoạt động
    hasSpaciousGarden: undefined, // Có vườn rộng rãi
    sortByPrice: 0, // Sắp xếp theo giá : -1: giảm dần, 0: không sắp xếp, 1: tăng dần
    sortByRating: 0, // Sắp xếp theo đánh giá : -1: giảm dần, 0: không sắp xếp, 1: tăng dần
    isCallAPI: false // Cờ để kiểm tra nếu cần gọi API
}
export const paramSearchHT = atom({
    key: "paramSearchHT", // Key xác định atom trong Recoil
    default: initParamseach
});