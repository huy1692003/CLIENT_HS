import React, { memo, useEffect, useState } from 'react';
import { ApartmentOutlined, BookOutlined, CarryOutOutlined, ClusterOutlined, FileProtectOutlined, FlagOutlined, FormOutlined, PropertySafetyOutlined, QuestionCircleOutlined, QuestionCircleTwoTone, TransactionOutlined, UsergroupAddOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

const MenuAdmin = () => {
    const navigate = useNavigate();
    const [selectedKey, setSelectedKey] = useState('1'); // State to track the selected key
    const [openKeys, setOpenKeys] = useState([]); // State to track open submenu keys

    // Load selected key from sessionStorage on component mount
    useEffect(() => {
        const storedKey = sessionStorage.getItem('selectedMenuKey');
        if (storedKey) {
            setSelectedKey(storedKey);
            // Determine if the selected key belongs to a submenu and set openKeys accordingly
            if (storedKey.startsWith('4-')) {
                setOpenKeys(['reviewHomeStay']);
            } else if (storedKey.startsWith('5-')) {
                setOpenKeys(['atribute']);
            }
        }
    }, []);

    const handleMenuClick = (key, path) => {
        setSelectedKey(key); // Update the selected key
        sessionStorage.setItem('selectedMenuKey', key); // Store the selected key in sessionStorage
        navigate(path); // Navigate to the corresponding path
    };

    const handleOpenChange = (keys) => {
        setOpenKeys(keys); // Update the open submenu keys
    };

    return (
        <Menu
            style={{ fontWeight: '700', marginTop: 40 }}
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]} // Set the selected key here
            openKeys={openKeys} // Set the open keys for submenu
            onOpenChange={handleOpenChange} // Handle opening/closing of submenu
        >
            <Menu.Item key="1" icon={< UserOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('1', "/admin/user-manager")}>
                Quản lý người dùng
            </Menu.Item>
            <Menu.Item key="2" icon={<UsergroupAddOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('2', "/admin/adminstrator-manager")}>
                Quản lý nhân sự
            </Menu.Item>
            <Menu.Item key="42432" icon={<PropertySafetyOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('42432', "/admin/role-manager")}>
                Quản lý chức vụ
            </Menu.Item>
            <Menu.Item key="3" icon={<FileProtectOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('3', "/admin/partnership-manager")}>
                Đăng kí hợp tác
            </Menu.Item>

            <Menu.SubMenu key="reviewHomeStay" icon={<CarryOutOutlined style={{ fontSize: 18 }} />} title="Kiểm duyệt HomeStay">
                <Menu.Item key="4-1" onClick={() => handleMenuClick('4-1', "/admin/homestay-censor-pending")}>
                    Đang chờ kiểm duyệt
                </Menu.Item>
                <Menu.Item key="4-2" onClick={() => handleMenuClick('4-2', "/admin/homestay-censor-current")}>
                    Đang hiện hành
                </Menu.Item>
                <Menu.Item key="4-3" onClick={() => handleMenuClick('4-3', "/admin/homestay-censor-reject")}>
                    Không đạt yêu cầu
                </Menu.Item>
            </Menu.SubMenu>

            <Menu.Item key="24457" icon={<VideoCameraOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('24457', "/admin/advertisement-manager")}>
                Quản lý quảng cáo
            </Menu.Item>
            <Menu.Item key="5-1" icon={<ClusterOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('5-1', "/admin/amenities-manager")}>
                Tiện nghi HomeStay
            </Menu.Item>

            <Menu.Item key="13234" icon={<BookOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('13234', "/admin/category-article-manager")}>
                Danh mục bài viết
            </Menu.Item>
            <Menu.Item key="132234" icon={<QuestionCircleOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('132234', "/admin/FAQ-manager")}>
                Quản lý câu hỏi FAQ
            </Menu.Item>

            <Menu.Item key="23243" icon={<FormOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('23243', "/admin/article-manager")}>
                Quản lý bài viết
            </Menu.Item>
            <Menu.SubMenu key="transaction" icon={<TransactionOutlined style={{ fontSize: 18 }} />} title="Giao dịch hệ thống">
                <Menu.Item key="24454"  onClick={() => handleMenuClick('24454', "/admin/transaction-management-booking")}>
                    Thanh toán tiền phòng
                </Menu.Item>
                <Menu.Item key="244544"  onClick={() => handleMenuClick('244544', "/admin/transaction-management-advertisement")}>
                    Thanh toán tiền phòng
                </Menu.Item>
            </Menu.SubMenu>


            <Menu.Item key="243454" icon={<TransactionOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('243454', "/admin/article-manager")}>
                Kết toán tháng
            </Menu.Item>


        </Menu>
    );
};
export default memo(MenuAdmin)
