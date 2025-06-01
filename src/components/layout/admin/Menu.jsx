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


