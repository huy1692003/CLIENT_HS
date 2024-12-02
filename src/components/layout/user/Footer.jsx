import React, { memo } from "react";
import { Image, Row, Col, Typography, Space } from "antd";
import "../../../styles/user/footer.scss";  // Import file CSS
import Logo from "../../../assets/Logo/logo.png";

const { Text } = Typography;

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                    <div className="space-y-4">
                        <Image src={Logo} alt="Logo" width={120} className="rounded-lg" />
                        <Text className="block text-lg font-semibold text-white">
                            HuyStay - Nền tảng TMĐT Du lịch hàng đầu Việt Nam
                        </Text>
                        <div className="space-y-2">
                            <Text className="block text-white">
                                Địa chỉ: Tầng 2, TTTM HPC Landmark 105, đường Tố Hữu, Q.Hà Đông, TP. Hà Nội.
                            </Text>
                            <Text className="block text-white">
                                Email: <a className="text-white hover:text-gray-300" href="mailto:gostay.services@gmail.com">gostay.services@gmail.com</a>
                            </Text>
                            <Text className="block text-white">
                                Điện thoại: 19002167 / Đường dây nóng: 056.728.8999
                            </Text>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Text className="block text-lg font-semibold mb-4 text-white">Kết nối với chúng tôi</Text>
                        <div className="flex flex-wrap gap-4">
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">Facebook</a>
                            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">Twitter</a>
                            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">YouTube</a>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">LinkedIn</a>
                        </div>
                        <div className="space-y-2 mt-6">
                            <span className="block font-medium text-white hover:text-gray-300 cursor-pointer">Giới thiệu</span>
                            <span className="block font-medium text-white hover:text-gray-300 cursor-pointer">Điều khoản và chính sách bảo mật</span>
                            <span className="block font-medium text-white hover:text-gray-300 cursor-pointer">Quy chế hoạt động website</span>
                            <span className="block font-medium text-white hover:text-gray-300 cursor-pointer">Cơ chế giải quyết tranh chấp, khiếu nại</span>
                            <span className="block font-medium text-white hover:text-gray-300 cursor-pointer">Chính sách bảo mật</span>
                            <span className="block font-medium text-white hover:text-gray-300 cursor-pointer">Liên hệ</span>
                            <span className="block font-medium text-white hover:text-gray-300 cursor-pointer">Tuyển dụng</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Text className="block text-lg font-semibold mb-4 text-white">Chấp nhận thanh toán</Text>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Image src="https://gostay.vn/assets/images/payment/1.jpg" alt="123pay" />
                            <Image src="https://gostay.vn/assets/images/payment/2.jpg" alt="VNPay" />
                            <Image src="https://gostay.vn/assets/images/payment/3.jpg" alt="MSB" />
                            <Image src="https://gostay.vn/assets/images/payment/4.jpg" alt="JCB" />
                        </div>
                    </div>
                </div>

                <div className="border-t-4 border-white mx-4 pt-6 pb-4">
                    <Text className="block text-center text-base md:text-lg text-white">
                        © 2024 HuyStay. Bản quyền thuộc Công Ty Cổ Phần Khai Thác Và Dịch Vụ Du Lịch HuyStay. Mã số ĐKKD: 0110037323.
                    </Text>
                </div>
            </div>
        </footer>
    );
};
export default memo(Footer)
