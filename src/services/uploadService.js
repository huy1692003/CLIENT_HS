import axios from 'axios';
import API, { URL_API } from './axiosConfig';

export const uploadService = {
    postSingle: async (formData) => {
        try {
            const res = await axios.post(URL_API + "/Upload/uploadFile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res) {
                return res.data;
            }
        } catch (error) {
            console.error("Có lỗi khi upload file:", error);
            throw error; // Ném lỗi để xử lý ở nơi gọi
        }
    },

    postMany: async (formDatas) => {
        try {
            const res = await axios.post(URL_API + "/Upload/uploadListFile", formDatas, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return res?.data
        } catch (error) {

            throw error; // Ném lỗi để xử lý ở nơi gọi
        }
    }
};
