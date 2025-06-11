import axios from "axios";
import { URL_SERVER } from "../constant/global";
import { notification } from "antd";

// Lấy URL API từ global constant
export const URL_API = URL_SERVER + 'api';

// Tạo một instance Axios
const API = axios.create({
    baseURL: URL_API, // URL cơ bản cho tất cả các yêu cầu
    timeout: 3000000, // Giới hạn thời gian chờ cho request (15 giây)
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
    },
});

// Interceptor để thêm token vào mỗi yêu cầu
API.interceptors.request.use((config) => {
    // Lấy token từ sessionStorage, localStorage hoặc Recoil state (nếu bạn sử dụng Recoil)
    const token = sessionStorage.getItem('token');  // Hoặc bạn có thể dùng localStorage hoặc từ Recoil state

    // Nếu có token, thêm vào header 'Authorization'
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    // Xử lý lỗi trước khi yêu cầu được gửi
    return Promise.reject(error);
});

// Interceptor để xử lý lỗi từ response (nếu cần)
API.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Xử lý lỗi (ví dụ, nếu token hết hạn, bạn có thể logout hoặc refresh token)
    if (error.response && error.response.status === 401) {
        // Xử lý khi token hết hạn hoặc không hợp lệ
      notification.error({message:"Không có quyền truy cập",description:"Bạn hãy đăng nhập để sử dụng dịch vụ này !",showProgress:true,duration:5})// Điều hướng tới trang đăng nhập
    }

    return Promise.reject(error);
});

export default API;
