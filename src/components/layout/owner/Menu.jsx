import {
    AuditOutlined,
    BarChartOutlined,
    CarryOutOutlined,
    CommentOutlined,
    ContactsFilled,
    ContactsOutlined,
    CreditCardFilled,
    CreditCardOutlined,
    FileProtectOutlined,
    HomeOutlined,
    InteractionOutlined,
    LoginOutlined,
    LogoutOutlined,
    PayCircleFilled,
    UserOutlined,
    VideoCameraOutlined,

} from "@ant-design/icons";
import { Menu } from "antd";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { SubMenu } = Menu;

const MenuOwner = () => {
    const navigate = useNavigate();

    // Lấy trạng thái mở và key của menu đã chọn từ sessionStorage nếu có
    const [selectedKey, setSelectedKey] = useState(sessionStorage.getItem("selectedMenuKey") || "1");
    const [openKeys, setOpenKeys] = useState(
        JSON.parse(sessionStorage.getItem("openMenuKeys")) || []
    );

    // Hàm xử lý khi click vào menu
    const handleMenuClick = (key, route) => {
        setSelectedKey(key); // Cập nhật key menu
        sessionStorage.setItem("selectedMenuKey", key); // Lưu key vào sessionStorage
        navigate(route); // Chuyển hướng tới route tương ứng
    };

    // Hàm xử lý khi mở SubMenu
    const handleOpenChange = (keys) => {
        setOpenKeys(keys); // Cập nhật các SubMenu đang mở
        sessionStorage.setItem("openMenuKeys", JSON.stringify(keys)); // Lưu trạng thái mở SubMenu vào sessionStorage
    };

    return (
        <Menu
            style={{ fontWeight: '700', paddingTop: 10, width: "100%" }}
            className="sticky top-2"

            mode="inline"

            selectedKeys={[selectedKey]} // Set menu đang chọn từ state
            openKeys={openKeys} // Set SubMenu đang mở
            onOpenChange={handleOpenChange} // Xử lý khi mở hoặc đóng SubMenu
        >
            <Menu.Item icon={<BarChartOutlined />} key="1-1" onClick={() => handleMenuClick("1-1", "/owner/dashboard")}>
                Thống kê tổng quan
            </Menu.Item>


            <Menu.Item key="sub2" icon={<HomeOutlined />} onClick={() => handleMenuClick("sub2", "/owner/homestay-list")} title="Quản lý HomeStay">
                Quản lý HomeStay
            </Menu.Item>



            <Menu.Item icon={<VideoCameraOutlined />} key="6-2" onClick={() => handleMenuClick("6-2", "/owner/advertisement-manager")}>
                Quản lý quảng cáo
            </Menu.Item>

            <Menu.Item icon={<AuditOutlined />} key="3-1" onClick={() => handleMenuClick("3-1", "/owner/booking-manager")}>
                Quản lý đặt phòng
            </Menu.Item>
            <Menu.Item icon={<PayCircleFilled />} key="3-34" onClick={() => handleMenuClick("3-34", "owner/history-payment-booking")}>
                Lịch sử thanh toán
            </Menu.Item>

            <Menu.Item key="6-3" icon={<LoginOutlined />} onClick={() => handleMenuClick("6-3", "/owner/checkin-manager")}>
                Check In
            </Menu.Item>
            <Menu.Item key="6-4" icon={<LogoutOutlined />} onClick={() => handleMenuClick("6-4", "/owner/checkout-manager")}>
                Check Out
            </Menu.Item>

            <Menu.Item key="4-1" icon={<CommentOutlined />} onClick={() => handleMenuClick("4-1", "/owner/review-manager")}>
                Quản lý đánh giá
            </Menu.Item>

            <Menu.Item key="24454" icon={<CreditCardOutlined />} onClick={() => handleMenuClick('24454', "/owner/promotion-manager")}>
                Quản lý giảm giá
            </Menu.Item>

            <Menu.Item key="24455" icon={<FileProtectOutlined />} onClick={() => handleMenuClick('24455', "/owner/service-homestay-manager")}>
                Quản lý dịch vụ
            </Menu.Item>




            {/* <Menu.Item key="5-1" onClick={() => handleMenuClick("5-1", "/owner/promotion-manager")}>
                    Quản lý khuyến mãi
                    </Menu.Item> */}







            <Menu.Item icon={<ContactsOutlined />} key="7-1" onClick={() => handleMenuClick("7-1", "/owner/support-customer")}>
                Khách hàng hỏi đáp
            </Menu.Item>
            <Menu.Item key="24456" icon={<UserOutlined />} onClick={() => handleMenuClick('24456', "/owner/profile-owner")}>
                Cài đặt thông tin
            </Menu.Item>

        </Menu >
    );
};
export default memo(MenuOwner)
