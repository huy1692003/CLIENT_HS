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

export const paramSearchHT = atom({
    key: "paramSearchHT",
    default: {
        location: null,
        numberofGuest: null,
        dateIn: null,
        dateOut: null,
        isCallAPI: false
    }
})