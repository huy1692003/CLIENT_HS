import API from "./axiosConfig";

const reviewRatingService = {
    getReviewByHomeStay: async (id) => {
        try {
            const res = await API.get('/ReviewAndRating/getReviewByHomeStay/'+id);
            return res.data;
        } catch (error) {
            throw error;
        }
    },
    getReviewByOwner: async (idOwner) => {
        try {
            const res = await API.get(`/ReviewAndRating/getReviewByOwner/${idOwner}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },
    add: async (data) => {
        try {
            const res = await API.post('/ReviewAndRating/add', data);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

}
export default reviewRatingService;