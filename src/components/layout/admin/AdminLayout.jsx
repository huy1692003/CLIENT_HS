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
import { Button, Dropdown, Image, Layout, Menu, theme } from 'antd';
import Logo from "../../../assets/Logo/logo.png";
import MenuAdmin from './Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { adminState } from '../../../recoil/atom';

const { Header, Sider, Content } = Layout;







const AdminLayout = ({ children }) => {

    const router = useLocation()
    const navigate = useNavigate()
    const [admin,setAdmin] = useRecoilState(adminState)
    
    

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
    }, [admin,router.pathname])

    return (
        <>
            {
                !router.pathname.includes("login")  ?
                    < Layout >
                        <Sider  width={"18%"} trigger={null} theme="light" collapsible collapsed={collapsed}>
                            <div className="flex" style={{ backgroundColor: "#1A3A99", color: "white", height: 64, justifyContent: "center", alignItems: 'center' }}>
                                <div>

                                    <h3 className='text-2xl font-bold text-center' >{!collapsed ? "Huy STAY" : "HST"}</h3>
                                    <h5 className='text-center '>{!collapsed ? "Hệ thống quản trị" : ""}</h5>
                                </div>

                            </div>

                            <MenuAdmin />
                        </Sider>
                        <Layout>
                            <Header
                                style={{
                                    padding: 0,
                                    paddingRight: 20,
                                    background: "#3F52B6",
                                    color: "white",


                                }}
                            >
                                <Button
                                    type="text"
                                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    onClick={() => setCollapsed(!collapsed)}
                                    style={{
                                        fontSize: '16px',
                                        width: 64,
                                        height: 64,
                                        color: "white"
                                    }}
                                />
                                <div className='infor-user float-right flex gap-3' style={{ width: "30%", textAlign: "right" }}>
                                    <CommentOutlined style={{ fontSize: 16 }} /> |
                                    <BellFilled size={""} style={{ fontSize: 17 }} /> |
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
                                                        setAdmin(null)
                                                       
                                                    }
                                                },
                                            ],
                                        }}
                                    >
                                        <h3 style={{ fontSize: 18, cursor: 'pointer' }}>
                                            Xin chào, <b>{admin?.fullname||"Quản trị viên"}</b>
                                        </h3>
                                    </Dropdown>
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
                    </Layout > : <div>{children}</div>
            }
        </>

    );
};
export default memo(AdminLayout);