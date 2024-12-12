import axios from "axios";
import { URL_SERVER } from "../constant/global";

export const URL_API = URL_SERVER+'api';

// Tạo một instance Axios
const API = axios.create({
    baseURL: URL_API, // URL cơ bản cho tất cả các yêu cầu
    timeout: 15000, // Giới hạn thời gian chờ cho request (10 giây)
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'

    },
});

// Interceptor để tự động thiết lập Content-Type
API.interceptors.request.use((config) => {
    // Kiểm tra xem có dữ liệu trong request hay không
    if (config.data) {
        // Nếu data là một đối tượng, thiết lập Content-Type là application/json
        if (typeof config.data === 'object') {
            config.headers['Content-Type'] = 'application/json; charset=utf-8';
        } else {
            // Nếu data không phải là đối tượng, bạn có thể thiết lập một Content-Type khác nếu cần
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
        }
    }
    return config;
}, (error) => {
    // Xử lý lỗi trước khi yêu cầu được gửi
    return Promise.reject(error);
});

export default API;
