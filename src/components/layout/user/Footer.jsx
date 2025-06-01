import React, { memo, useEffect, useState } from "react";
import { Image, Typography, Divider } from "antd";
import "../../../styles/user/footer.scss";
import Logo from "../../../assets/Logo/logo.png";
import { Link } from "react-router-dom";
import settingService from "../../../services/settingService";
import { settingFormat } from "../../../recoil/selector";
import { useRecoilValue } from "recoil";

const { Text, Title } = Typography;

const Footer = () => {
    const setting = useRecoilValue(settingFormat)
    const [contactInfo, setContactInfo] = useState({
        address: "Tầng 2, TTTM HPC Landmark 105, đường Tố Hữu, Q.Hà Đông, TP. Hà Nội.",
        email: "daohuy1692003@gmail.com",
        phone: "19002167",
        hotline: "056.728.8999",
        nameCompany: "HuyStay"
    });
    
    useEffect(() => {
        const loadSetting = () => {

            const address = setting["companyAddress"]?.value;
            const email = setting["companyEmail"]?.value;
            const phone = setting["companyPhone"]?.value;
            const hotline = setting["hotlineCompany"]?.value;
            const nameCompany = setting["nameCompany"]?.value;

            setContactInfo({
                address: address || contactInfo.address,
                email: email || contactInfo.email,
                phone: phone || contactInfo.phone,
                hotline: hotline || contactInfo.hotline,
                nameCompany: nameCompany || contactInfo.nameCompany
            });
        }
        loadSetting();
    }, [setting]);

    return (
        <footer className="bg-[#796752] text-white py-8">
            <div className="container mx-auto px-4">
                {/* Main content grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column 1: Logo and Contact Info */}
                    <div>
                        <div className="mb-4 flex items-center">
                            <Image
                                src={Logo}
                                alt="HuyStay Logo"
                                width={80}
                                preview={false}
                                className="bg-white p-1 rounded"
                            />
                            <span className="ml-3 font-medium">{contactInfo.nameCompany}</span>
                        </div>
                        <div className="text-sm space-y-2">
                            <div className="flex items-start">
                                <i className="fas fa-map-marker-alt mt-1 mr-2 text-yellow-200"></i>
                                <span>{contactInfo.address}</span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-envelope mr-2 text-yellow-200"></i>
                                <a href={`mailto:${contactInfo.email}`} className="hover:underline">
                                    {contactInfo.email}
                                </a>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-phone mr-2 text-yellow-200"></i>
                                <span>{contactInfo.phone}</span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-headset mr-2 text-yellow-200"></i>
                                <span>{contactInfo.hotline}</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-lg font-medium mb-4">Liên kết nhanh</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <Link to="/about" className="text-sm hover:text-yellow-200 transition-colors flex items-center">
                                <i className="fas fa-angle-right mr-1"></i> Giới thiệu
                            </Link>
                            <Link to="/hoidap" className="text-sm hover:text-yellow-200 transition-colors flex items-center">
                                <i className="fas fa-angle-right mr-1"></i> Hỏi đáp
                            </Link>
                            <Link to="/terms" className="text-sm hover:text-yellow-200 transition-colors flex items-center">
                                <i className="fas fa-angle-right mr-1"></i> Điều khoản
                            </Link>
                            <Link to="/policy" className="text-sm hover:text-yellow-200 transition-colors flex items-center">
                                <i className="fas fa-angle-right mr-1"></i> Chính sách
                            </Link>
                            <Link to="/contact" className="text-sm hover:text-yellow-200 transition-colors flex items-center">
                                <i className="fas fa-angle-right mr-1"></i> Liên hệ
                            </Link>
                            <Link to="/careers" className="text-sm hover:text-yellow-200 transition-colors flex items-center">
                                <i className="fas fa-angle-right mr-1"></i> Tuyển dụng
                            </Link>
                        </div>
                    </div>

                    {/* Column 3: Social & Payment */}
                    <div>
                        <h4 className="text-lg font-medium mb-4">Kết nối & Thanh toán</h4>

                        {/* Social media links */}
                        <div className="mb-4">
                            <p className="text-sm mb-2">Kết nối với chúng tôi:</p>
                            <div className="flex space-x-3">
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-blue-400 transition-colors">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-red-600 transition-colors">
                                    <i className="fab fa-youtube"></i>
                                </a>
                                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-blue-700 transition-colors">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>

                        {/* Payment methods */}
                        <div>
                            <p className="text-sm mb-2">Chấp nhận thanh toán:</p>
                            <div className="grid grid-cols-4 gap-1">
                                <Image src="https://gostay.vn/assets/images/payment/1.jpg" alt="123pay" preview={false}
                                    className="rounded" width={40} />
                                <Image src="https://gostay.vn/assets/images/payment/2.jpg" alt="VNPay" preview={false}
                                    className="rounded" width={40} />
                                <Image src="https://gostay.vn/assets/images/payment/3.jpg" alt="MSB" preview={false}
                                    className="rounded" width={40} />
                                <Image src="https://gostay.vn/assets/images/payment/4.jpg" alt="JCB" preview={false}
                                    className="rounded" width={40} />
                            </div>
                        </div>
                    </div>
                </div>

                <Divider className="border-white/20 my-4" />

                {/* Copyright section */}
                <div className="text-center text-sm">
                    <p className="text-white/80">
                        © {new Date().getFullYear()} HuyStay. Bản quyền thuộc Công Ty Cổ Phần Khai Thác Và Dịch Vụ Du Lịch HuyStay.
                    </p>
                    <p className="text-white/70 mt-1">
                        Mã số ĐKKD: 0110037323
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);
