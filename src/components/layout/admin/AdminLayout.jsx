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
import { Button, Image, Layout, Menu, theme } from 'antd';
import Logo from "../../../assets/Logo/logo.png";
import  MenuAdmin  from './Menu';

const { Header, Sider, Content } = Layout;







const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    useEffect(() => {
        document.title = "Huystay - Hệ thống quản trị"
    }, [])
    return (
        <Layout >
            <Sider width={"18%"} trigger={null} theme="light" collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical flex  " style={{ backgroundColor: "#1A3A99", color: "white", height: 64, justifyContent: "center", alignItems: 'center' }}>
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
                    <div className='infor-user float-right flex gap-3  ' style={{ width: "30%", textAlign: "right" }} >
                        <CommentOutlined style={{ fontSize: 16 }} /> |
                        <BellFilled size={""} style={{ fontSize: 17 }} /> |
                        <h3 style={{ fontSize: 18 }} >Xin chào , <b>Đào Quang Huy</b> </h3>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
export default memo(AdminLayout);