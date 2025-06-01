import React, { memo, useEffect, useState } from 'react';
import {
    BellFilled,
    BellOutlined,
    CommentOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Image, Layout, Menu, theme } from 'antd';
import Logo from "../../../assets/Logo/logo.png";
import avatar from "../../../assets/Avatar/avatar-admin.png";
import MenuAdmin from './Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { adminState } from '../../../recoil/atom';

const { Header, Sider, Content } = Layout;







const AdminLayout = ({ children }) => {

    const router = useLocation()
    const navigate = useNavigate()
    const [admin, setAdmin] = useRecoilState(adminState)



    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        document.title = "Huystay - Hệ thống quản trị"
    }, [])

    useEffect(() => {

        if (!admin) {
            navigate("/admin/login")
        }
    }, [admin, router.pathname])

    if (router.pathname.includes("login") || !admin) {
        return <div>{children}</div>
    }
    return (
        <>
            {

                < Layout >
                    <Sider width={"18%"} trigger={null} theme="light" collapsible collapsed={collapsed}>
                        <div className="flex" style={{ backgroundColor: "#1A3A99", color: "white", height: 80, justifyContent: "center", alignItems: 'center' }}>
                            <div>

                                <h3 className='text-2xl font-bold text-center' >{!collapsed ? "Huy STAY" : "HST"}</h3>
                                <h5 className='text-center text-lg'>{!collapsed ? "Hệ thống quản trị" : ""}</h5>
                            </div>

                        </div>

                        <MenuAdmin />
                    </Sider>
                    <Layout>
                        <Header
                            className='flex justify-between items-center'
                            style={{
                                padding: 0,
                                paddingRight: 20,
                                background: "#3F52B6",
                                color: "white",
                                height: 80


                            }}
                        >
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: 26 }} /> : <MenuFoldOutlined style={{ fontSize: 26 }} />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                    color: "white"
                                }}
                            />
                            <div className='flex justify-center items-center'>

                                <div className='infor-user flex gap-3'>
                                    {/* <CommentOutlined style={{ fontSize: 16 }} /> |
                                    <BellFilled size={""} style={{ fontSize: 17 }} /> | */}
                                    <Dropdown
                                        menu={{
                                            items: [
                                                {
                                                    key: '1',
                                                    label: 'Thông tin cá nhân',
                                                },
                                                {
                                                    key: '2',
                                                    label: 'Đăng xuất',
                                                    onClick: () => {
                                                        sessionStorage.removeItem("admin");
                                                        sessionStorage.removeItem("token");
                                                        setAdmin(null)

                                                    }
                                                },
                                            ],
                                        }}
                                    >
                                        <h3 style={{ fontSize: 18, cursor: 'pointer' }}>
                                            Xin chào, <b>{admin?.fullname || "Quản trị viên"}</b>
                                        </h3>
                                    </Dropdown>
                                </div>
                                <Avatar src={admin?.avatar || avatar} className='bg-white ml-3' size={45} alt="User Avatar" />
                            </div>
                        </Header>
                        <Content
                            style={{
                                minHeight: "100vh",
                                margin: '24px 16px',
                                padding: 24,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {children}
                        </Content>
                    </Layout>
                </Layout >
            }
        </>

    );
};
export default memo(AdminLayout);