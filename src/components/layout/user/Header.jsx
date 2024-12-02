import { Button, Image } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/Logo/logo.png";
import { memo, useEffect, useState } from "react";
import { userState } from './../../../recoil/atom';
import { useRecoilState } from "recoil";

const Header = () => {
    const navigate = useNavigate()
    const [showInfor, setShowInfor] = useState(false);
    const [user, setUser] = useRecoilState(userState)

    useEffect(() => {
        document.title = "Huystay - Kết nối đến mọi người"
    }, [])
    console.log(user)
    const onSelectMenu = (url) => {
        setShowInfor(false)
        navigate(url)
    }

    return (
        <div className="mb-3">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between py-4">
                    {/* Logo */}
                    <div className="w-full lg:w-auto mb-4 lg:mb-0 flex justify-center lg:justify-start">
                        <Link to={"/"}>
                            <Image src={Logo} preview={false} width={80} height={55} className="object-contain" />
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="w-full lg:w-auto mb-4 lg:mb-0">
                        <ul className="flex flex-wrap justify-center gap-2 lg:gap-6">
                            <li>
                                <Link className="block font-bold px-3 py-2 text-sm lg:text-base rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors" to={"/"}>Trang chủ</Link>
                            </li>
                            <li>
                                <Link className="block font-bold px-3 py-2 text-sm lg:text-base rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors" to={"/homestay"}>HomeStay</Link>
                            </li>
                            <li>
                                <Link className="block font-bold px-3 py-2 text-sm lg:text-base rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors" to={"/partnership-reg"}>Hợp tác</Link>
                            </li>
                            <li>
                                <Link className="block font-bold px-3 py-2 text-sm lg:text-base rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors" to={"/article"}>Bài viết</Link>
                            </li>
                            <li>
                                <Link className="block font-bold px-3 py-2 text-sm lg:text-base rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors" to={"/about"}>Về chúng tôi</Link>
                            </li>
                        </ul>
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                            <i className="fa-solid fa-bell text-lg"></i>
                        </button>

                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                            <i className="fa-solid fa-comments text-lg"></i>
                            <span className="text-sm font-semibold">Hỗ trợ</span>
                        </button>

                        <div className="relative group">
                            <button 
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <i className="fa-solid fa-bars text-lg"></i>
                                <i className={`fa-solid fa-user text-lg ${user ? "text-blue-500" : "text-gray-700"}`}></i>
                            </button>

                            <div style={{zIndex: 1000 , border:"1px solid"}} className="absolute invisible group-hover:visible top-9 right-0 mt-2 w-64 rounded-lg bg-white shadow-xl border border-gray-100 overflow-hidden">
                                {user ? (
                                    <div className="py-2">
                                        <div className="px-4 py-2 text-center border-b">
                                            <p>Xin chào, <span className="font-semibold">{user.username}</span></p>
                                        </div>
                                        
                                        {user.idOwner && (
                                            <button onClick={() => window.open("/owner/dashboard")} className="w-full px-4 py-2 text-left hover:bg-gray-50">
                                                <i className="fa-solid fa-house-user text-teal-500 mr-2"></i>
                                                Kênh chủ HomeStay
                                            </button>
                                        )}
                                        
                                        <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
                                            <i className="fa-solid fa-user text-blue-600 mr-2"></i>
                                            Thông tin của tôi
                                        </button>
                                        
                                        <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
                                            <i className="fa-solid fa-clock-rotate-left text-orange-500 mr-2"></i>
                                            Lịch sử đặt phòng
                                        </button>
                                        
                                        <button onClick={() => navigate('/favorites')} className="w-full px-4 py-2 text-left hover:bg-gray-50">
                                            <i className="fa-solid fa-heart text-red-500 mr-2"></i>
                                            Danh sách yêu thích
                                        </button>
                                        
                                        <button 
                                            onClick={() => {
                                                setUser(null)
                                                sessionStorage.removeItem("user")
                                                setShowInfor(false)
                                            }}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50"
                                        >
                                            <i className="fa-solid fa-right-from-bracket text-blue-600 mr-2"></i>
                                            Đăng xuất
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => onSelectMenu("/login-user")}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
                                    >
                                        <i className="fa-solid fa-right-to-bracket mr-2"></i>
                                        Đăng nhập
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Header);
