// import React, { memo, useEffect, useState } from 'react';
// import { ApartmentOutlined, BookOutlined, CarryOutOutlined, ClusterOutlined, CompassOutlined, DashboardOutlined, FileProtectOutlined, FlagOutlined, FormOutlined, PropertySafetyOutlined, QuestionCircleOutlined, QuestionCircleTwoTone, TransactionOutlined, UsergroupAddOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
// import { Menu } from "antd";
// import { useNavigate } from "react-router-dom";

// const MenuAdmin = () => {
//     const navigate = useNavigate();
//     const [selectedKey, setSelectedKey] = useState('1'); // State to track the selected key
//     const [openKeys, setOpenKeys] = useState([]); // State to track open submenu keys

//     // Load selected key from sessionStorage on component mount
//     useEffect(() => {
//         const storedKey = sessionStorage.getItem('selectedMenuKey');
//         if (storedKey) {
//             setSelectedKey(storedKey);
//             // Determine if the selected key belongs to a submenu and set openKeys accordingly
//             if (storedKey.startsWith('4-')) {
//                 setOpenKeys(['reviewHomeStay']);
//             } else if (storedKey.startsWith('5-')) {
//                 setOpenKeys(['atribute']);
//             }
//         }
//     }, []);

//     const handleMenuClick = (key, path) => {
//         setSelectedKey(key); // Update the selected key
//         sessionStorage.setItem('selectedMenuKey', key); // Store the selected key in sessionStorage
//         navigate(path); // Navigate to the corresponding path
//     };

//     const handleOpenChange = (keys) => {
//         setOpenKeys(keys); // Update the open submenu keys
//     };

//     return (
//         <Menu
//             style={{ fontWeight: '700', marginTop: 40 }}
//             theme="light"
//             mode="inline"
//             selectedKeys={[selectedKey]} // Set the selected key here
//             openKeys={openKeys} // Set the open keys for submenu
//             onOpenChange={handleOpenChange} // Handle opening/closing of submenu
//         >
//             <Menu.Item key="1" icon={< DashboardOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('1', "/admin/dashboard-overview")}>
//                 Thống kê
//             </Menu.Item>
//             <Menu.Item key="2323" icon={< UserOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('2323', "/admin/user-manager")}>
//                 Quản lý người dùng
//             </Menu.Item>
//             <Menu.Item key="43" icon={< CompassOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('43', "/admin/owner-manager")}>
//                 Quản lý đối tác
//             </Menu.Item>
//             <Menu.Item key="2" icon={<UsergroupAddOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('2', "/admin/adminstrator-manager")}>
//                 Quản lý nhân viên
//             </Menu.Item>
//             <Menu.Item key="42432" icon={<PropertySafetyOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('42432', "/admin/role-manager")}>
//                 Quản lý chức vụ
//             </Menu.Item>
//             <Menu.Item key="3" icon={<FileProtectOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('3', "/admin/partnership-manager")}>
//                 Đăng kí hợp tác
//             </Menu.Item>

//             <Menu.SubMenu key="reviewHomeStay" icon={<CarryOutOutlined style={{ fontSize: 18 }} />} title="Kiểm duyệt HomeStay">
//                 <Menu.Item key="4-1" onClick={() => handleMenuClick('4-1', "/admin/homestay-censor-pending")}>
//                     Đang chờ kiểm duyệt
//                 </Menu.Item>
//                 <Menu.Item key="4-2" onClick={() => handleMenuClick('4-2', "/admin/homestay-censor-current")}>
//                     Đang hiện hành
//                 </Menu.Item>
//                 <Menu.Item key="4-3" onClick={() => handleMenuClick('4-3', "/admin/homestay-censor-reject")}>
//                     Không đạt yêu cầu
//                 </Menu.Item>
//             </Menu.SubMenu>

//             <Menu.Item key="24457" icon={<VideoCameraOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('24457', "/admin/advertisement-manager")}>
//                 Quản lý quảng cáo
//             </Menu.Item>
//             <Menu.Item key="5-1" icon={<ClusterOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('5-1', "/admin/amenities-manager")}>
//                 Tiện nghi HomeStay
//             </Menu.Item>

//             <Menu.Item key="13234" icon={<BookOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('13234', "/admin/category-article-manager")}>
//                 Danh mục bài viết
//             </Menu.Item>
//             <Menu.Item key="132234" icon={<QuestionCircleOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('132234', "/admin/FAQ-manager")}>
//                 Quản lý câu hỏi FAQ
//             </Menu.Item>

//             <Menu.Item key="23243" icon={<FormOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('23243', "/admin/article-manager")}>
//                 Quản lý bài viết
//             </Menu.Item>
//             <Menu.SubMenu key="transaction" icon={<TransactionOutlined style={{ fontSize: 18 }} />} title="Giao dịch hệ thống">
//                 <Menu.Item key="24454"  onClick={() => handleMenuClick('24454', "/admin/transaction-management-booking")}>
//                     Thanh toán tiền phòng
//                 </Menu.Item>
//                 <Menu.Item key="244544"  onClick={() => handleMenuClick('244544', "/admin/transaction-management-advertisement")}>
//                     Thanh toán tiền phòng
//                 </Menu.Item>
//             </Menu.SubMenu>


//             <Menu.Item key="2434534" icon={<TransactionOutlined style={{ fontSize: 18 }} />} onClick={() => handleMenuClick('2434534', "/admin/revenue-manager")}>
//                 Kết toán doanh thu
//             </Menu.Item>


//         </Menu>
//     );
// };
// export default memo(MenuAdmin)


import React, { memo, useEffect, useState } from 'react';
import { Menu } from "antd";
import { json, useNavigate } from "react-router-dom";

const MenuAdmin = () => {
    const navigate = useNavigate();
    const [selectedKey, setSelectedKey] = useState('1'); // State to track the selected key
    const [openKeys, setOpenKeys] = useState([]); // State to track open submenu keys
    const [menuData,setMenuData]=useState(JSON.parse(sessionStorage.getItem("admin")))
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

    // Function to render Menu Item or SubMenu dynamically
    const renderMenu = (menuItems) => {
        return menuItems.map(item => {
            if (item.children && item.children.length > 0) {
                // If the item has children, render it as a SubMenu
                return (
                    <Menu.SubMenu
                        key={item.menuID.toString()}
                        title={item.name}
                        icon={<i className={item.icon} style={{ fontSize: 18 }} />} // Using FontAwesome icon class
                    >
                        {renderMenu(item.children)} {/* Recursively render children */}
                    </Menu.SubMenu>
                );
            }

            // If no children, render as a Menu.Item
            return (
                <Menu.Item
                    key={item.menuID.toString()}
                    icon={<i className={item.icon} style={{ fontSize: 18 }} />} // Using FontAwesome icon class
                    onClick={() => handleMenuClick(item.menuID.toString(), item.url)}
                >
                    {item.name}
                </Menu.Item>
            );
        });
    };

    return (
        <Menu
            style={{ fontWeight: '700', marginTop: 30 }}
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]} // Set the selected key here
            openKeys={openKeys} // Set the open keys for submenu
            onOpenChange={handleOpenChange} // Handle opening/closing of submenu
        >
            {renderMenu(menuData.menus)} {/* Render menu from provided data */}
        </Menu>
    );
};

export default memo(MenuAdmin);


