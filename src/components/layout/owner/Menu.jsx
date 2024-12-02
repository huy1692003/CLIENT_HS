import {
    AuditOutlined,
    BarChartOutlined,
    CarryOutOutlined,
    CreditCardFilled,
    CreditCardOutlined,
    FileProtectOutlined,
    HomeOutlined,
    InteractionOutlined,
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
            style={{ fontWeight: '700', marginTop: 40 ,width:"100%"}}
            theme="light"
            mode="inline"

            selectedKeys={[selectedKey]} // Set menu đang chọn từ state
            openKeys={openKeys} // Set SubMenu đang mở
            onOpenChange={handleOpenChange} // Xử lý khi mở hoặc đóng SubMenu
        >
            <SubMenu key="sub1" icon={<BarChartOutlined />} title="Thống kê">
                <Menu.Item key="1-1" onClick={() => handleMenuClick("1-1", "/owner/dashboard")}>
                    Thống kê doanh thu
                </Menu.Item>
                <Menu.Item key="1-2" onClick={() => handleMenuClick("1-2", "/owner/stats-booking")}>
                    Thống kê đặt phòng
                </Menu.Item>
            </SubMenu>

            <SubMenu key="sub2" icon={<HomeOutlined />} title="Quản lý HomeStay">
                <Menu.Item key="2-2" onClick={() => handleMenuClick("2-2", "/owner/homestay")}>
                    Thêm HomeStay mới
                </Menu.Item>
                <Menu.Item key="2-1" onClick={() => handleMenuClick("2-1", "/owner/homestay-waiting")}>
                    Đang chờ phê duyệt
                </Menu.Item>
                <Menu.Item key="2-3" onClick={() => handleMenuClick("2-3", "/owner/homestay-current")}>
                    HomeStay hiện hành
                </Menu.Item>
                <Menu.Item key="2-4" onClick={() => handleMenuClick("2-4", "/owner/homestay-reject")}>
                    HomeStay bị từ chối
                </Menu.Item>
            </SubMenu>

            <SubMenu key="sub3" icon={<AuditOutlined />} title="Quản lý đặt phòng">
                <Menu.Item key="3-1" onClick={() => handleMenuClick("3-1", "/owner/booking-pending")}>
                    Đang chờ xác nhận
                </Menu.Item>
                <Menu.Item key="3-2" onClick={() => handleMenuClick("3-2", "/owner/booking-waiting")}>
                    Đang chờ nhận phòng
                </Menu.Item>
                <Menu.Item key="3-3" onClick={() => handleMenuClick("3-3", "/owner/booking-reject")}>
                    Bị Hủy
                </Menu.Item>
                <Menu.Item key="3-4" onClick={() => handleMenuClick("3-4", "/owner/booking-success")}>
                    Đã hoàn thành
                </Menu.Item>
            </SubMenu>

            <SubMenu key="sub4" icon={<FileProtectOutlined />} title="Quản lý đánh giá">
                <Menu.Item key="4-1" onClick={() => handleMenuClick("4-1", "/owner/review-manager")}>
                    Xem đánh giá
                </Menu.Item>
                <Menu.Item key="4-2" onClick={() => handleMenuClick("4-2", "/owner/review-settings")}>
                    Cài đặt đánh giá
                </Menu.Item>
            </SubMenu>
            <Menu.Item key="24454" icon={<CreditCardOutlined />} onClick={() => handleMenuClick('24454', "/owner/promotion-manager")}>
                Quản lý khuyến mãi
            </Menu.Item>


            {/* <Menu.Item key="5-1" onClick={() => handleMenuClick("5-1", "/owner/promotion-manager")}>
                    Quản lý khuyến mãi
            </Menu.Item> */}


            <SubMenu key="sub6" icon={<VideoCameraOutlined />} title="Quản lý quảng cáo">
                <Menu.Item key="6-1" onClick={() => handleMenuClick("6-1", "/owner/advertising-manager")}>
                    Xem quảng cáo
                </Menu.Item>
                <Menu.Item key="6-2" onClick={() => handleMenuClick("6-2", "/owner/advertising-settings")}>
                    Cài đặt quảng cáo
                </Menu.Item>
            </SubMenu>

            <SubMenu key="sub7" icon={<InteractionOutlined />} title="Phản hồi hỗ trợ">
                <Menu.Item key="7-1" onClick={() => handleMenuClick("7-1", "/owner/support-feedback")}>
                    Xem phản hồi
                </Menu.Item>
                <Menu.Item key="7-2" onClick={() => handleMenuClick("7-2", "/owner/support-settings")}>
                    Cài đặt hỗ trợ
                </Menu.Item>
            </SubMenu>
        </Menu>
    );
};
export default memo(MenuOwner)
