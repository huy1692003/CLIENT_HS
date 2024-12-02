import { atom } from "recoil";

var userLocal = sessionStorage.getItem("user") && JSON.parse(sessionStorage.getItem("user"))
export const userState = atom({
    key: "userState",
    default: userLocal || null
})

export const paramSearchHT = atom({
    key: "paramSearchHT",
    default: {
        location: null,
        numberofGuest: null,
        dateIn: null,
        dateOut: null
    }
})