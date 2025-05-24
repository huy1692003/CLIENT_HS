import axios from 'axios';
import API, { URL_API } from './axiosConfig';
import createFromData from '../utils/createFormData';

export const uploadService = {
    upload: async function (fileList) {
        let listFileOrigin = fileList?.filter(f => f.originFileObj !== null);
        let resUpload = (listFileOrigin.length > 0) ? await this.postMany(createFromData.many(listFileOrigin)) : [];
        let listIMG = resUpload.filePaths || [];
        return listIMG;
    },
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
