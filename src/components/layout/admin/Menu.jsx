import React, { memo, useEffect, useState } from 'react';
import { ApartmentOutlined, BookOutlined, CarryOutOutlined, ClusterOutlined, FileProtectOutlined, FlagOutlined, FormOutlined, PropertySafetyOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
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
            <Menu.Item key="1" icon={<UserOutlined />} onClick={() => handleMenuClick('1', "/admin/user-manager")}>
                Quản lý người dùng
            </Menu.Item>
            <Menu.Item key="2" icon={<UsergroupAddOutlined />} onClick={() => handleMenuClick('2', "/admin/staff-manager")}>
                Quản lý nhân viên
            </Menu.Item>
            <Menu.Item key="42432" icon={<PropertySafetyOutlined />} onClick={() => handleMenuClick('42432', "/admin/role-manager")}>
                Quản lý chức vụ
            </Menu.Item>
            <Menu.Item key="3" icon={<FileProtectOutlined />} onClick={() => handleMenuClick('3', "/admin/partnership-manager")}>
                Đơn đăng kí hợp tác
            </Menu.Item>

            <Menu.SubMenu key="reviewHomeStay" icon={<CarryOutOutlined />} title="Kiểm duyệt HomeStay">
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

            <Menu.SubMenu key="atribute" icon={<ApartmentOutlined />} title="Thuộc tính">
                <Menu.Item key="5-1" icon={<ClusterOutlined />} onClick={() => handleMenuClick('5-1', "/admin/amenities-manager")}>
                    Tiện nghi HomeStay
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="atribuhhhhte" icon={<FlagOutlined />} title="Quản lý danh mục">
                <Menu.Item key="13234" icon={<BookOutlined />} onClick={() => handleMenuClick('13234', "/admin/category-article-manager")}>
                    Danh mục bài viết
                </Menu.Item>
            </Menu.SubMenu>

            <Menu.Item key="24454" icon={<FormOutlined />} onClick={() => handleMenuClick('24454', "/admin/article-manager")}>
                Quản lý bài viết
            </Menu.Item>

        </Menu>
    );
};
export default memo(MenuAdmin)
