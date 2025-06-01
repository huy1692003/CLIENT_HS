import { Button, Dropdown, Image, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/Logo/logo.png";
import { memo, useEffect, useState } from "react";
import { userState } from './../../../recoil/atom';
import { useRecoilState, useRecoilValue } from "recoil";
import { settingFormat } from "../../../recoil/selector";

const Header = () => {
    const navigate = useNavigate()
    const [showInfor, setShowInfor] = useState(false);
    const [user, setUser] = useRecoilState(userState)
    const setting = useRecoilValue(settingFormat)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        document.title = "Huystay - Kết nối đến mọi người"
    }, [])

    const onSelectMenu = (url) => {
        setShowInfor(false)
        setIsMobileMenuOpen(false)
        navigate(url)
    }
    const navigationItems = [
        { to: "/", label: "Trang chủ" },
        { to: "/homestay", label: "HomeStay" },
        { to: "/partnership-reg", label: "Hợp tác" },
        { to: "/article", label: "Bài viết" },
        { to: "/hoidap", label: "Câu hỏi thường gặp" },
        { to: "/about", label: "Về chúng tôi" },
    ];
    
    return (
        <div className="fixed top-0 left-0 bg-white right-0 border-b border-gray-200 rounded-lg" style={{zIndex:100}}>
            <div className="container mx-auto">
                <div className="flex items-center justify-between py-4">
                    {/* Mobile Menu Button */}
                    <button 
                        className="lg:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <i className="fa-solid fa-bars text-lg"></i>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center justify-center flex-1 lg:flex-none">
                        <Link to={"/"}>
                            <Image src={Logo} preview={false} width={100} height={62} className="object-contain" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:block">
                        <ul className="flex gap-3">
                            {navigationItems.map((item, index) => (
                                <li key={index}>
                                    <Link 
                                        className="block font-bold px-2 py-2 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors" 
                                        to={item.to}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center gap-3">
                        <button className="hidden lg:block p-2 px-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                            <i className="fa-solid fa-bell text-lg"></i>
                        </button>

                        <button onClick={()=>navigate("/history-chat")} className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                            <i className="fa-solid fa-comments text-lg"></i>
                            <span className="text-sm font-semibold">Hỗ trợ</span>
                        </button>

                        <Dropdown
                            menu={{
                                items: user ? [
                                    {
                                        key: '1',
                                        label: (
                                            <div className="px-4 py-2 text-center border-b">
                                                <p>Xin chào, <span className="font-semibold">{user?.fullname||"Khách hàng "}</span></p>
                                            </div>
                                        )
                                    },
                                    user.idOwner && {
                                        key: '2',
                                        label: (
                                            <div onClick={() => window.open("/owner/dashboard")}>
                                                <i className="fa-solid fa-house-user text-teal-500 mr-2"></i>
                                                Kênh chủ HomeStay
                                            </div>
                                        )
                                    },
                                  
                                    {
                                        key: '4',
                                        label: (
                                            <div  onClick={() => navigate('/history-booking')}>
                                                <i className="fa-solid fa-clock-rotate-left text-orange-500 mr-2" ></i>
                                                Lịch sử đặt phòng
                                            </div>
                                        )
                                    },
                                    {
                                        key: '5',
                                        label: (
                                            <div onClick={() => navigate('/favorites')}>
                                                <i className="fa-solid fa-heart text-red-500 mr-2"></i>
                                                Danh sách yêu thích
                                            </div>
                                        )
                                    },
                                    {
                                        key: '6',
                                        label: (
                                            <div onClick={() => {
                                                setUser(null)
                                                sessionStorage.removeItem("user")
                                                sessionStorage.removeItem("token")
                                                setShowInfor(false)
                                                notification.success({message:"Đăng xuất thành công"})
                                            }}>
                                                <i className="fa-solid fa-right-from-bracket text-blue-600 mr-2"></i>
                                                Đăng xuất
                                            </div>
                                        )
                                    }
                                ] : [
                                    {
                                        key: '1',
                                        label: (
                                            <div onClick={() => onSelectMenu("/login-user")}>
                                                <i className="fa-solid fa-right-to-bracket mr-2"></i>
                                                Đăng nhập
                                            </div>
                                        )
                                    },
                                    {
                                        key: '4',
                                        label: (
                                            <div  onClick={() => navigate('/history-booking')}>
                                                <i className="fa-solid fa-clock-rotate-left text-orange-500 mr-2" ></i>
                                                Lịch sử đặt phòng
                                            </div>
                                        )
                                    },
                                ]
                            }}
                            trigger={['hover']}
                        >
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                <i className={`fa-solid fa-user text-lg ${user ? "text-blue-500" : "text-gray-700"}`}></i>
                            </button>
                        </Dropdown>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden pb-4">
                        <ul className="flex flex-col gap-2">
                            {navigationItems.map((item, index) => (
                                <li key={index}>
                                    <Link 
                                        className="block font-bold px-3 py-2 text-base rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        to={item.to}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                                    <i className="fa-solid fa-bell text-lg"></i>
                                    <span className="font-bold">Thông báo</span>
                                </button>
                            </li>
                            <li>
                                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                                    <i className="fa-solid fa-comments text-lg"></i>
                                    <span className="font-bold">Hỗ trợ</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(Header);
