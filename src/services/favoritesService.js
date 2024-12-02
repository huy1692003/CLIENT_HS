import API from "./axiosConfig"

const favoritesService={
    addFavorites: async (idHomeStay,idCus) => {
        let res = await API.post(`/Favorites/add?idHomeStay=${idHomeStay}&idCus=${idCus}`)
        return res?.data
    },
    deleteFavorites: async (id) => {
        let res = await API.delete(`/Favorites/delete/${id}`)
        return res?.data
    },
    getHomeStayFavorites: async (idCus) => {
        let res = await API.get(`/Favorites/getHomeStayFavorites/${idCus}`)
        return res?.data
    },
}
export default favoritesService