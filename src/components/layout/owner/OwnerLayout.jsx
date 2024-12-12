import React, { memo, useEffect, useState } from 'react';
import {
    BellFilled,
    CommentOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,

} from '@ant-design/icons';
import { Button, Image, Layout, Menu, message, notification, theme, Spin } from 'antd';
import avatar from "../../../assets/Avatar/avatarboy.png";
import  MenuOwner  from './Menu';
import { useRecoilState } from 'recoil';
import { userState, isLoadingOwner } from '../../../recoil/atom';
import { useLocation, useNavigate } from 'react-router-dom';
import  NotFoundPage  from '../../../pages/NotFoundPage';


const { Header, Sider, Content } = Layout;

const OwnerLayout = ({ children }) => {
    const router = useLocation()
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()
    const [owner, setOwner] = useRecoilState(userState)
    const [loading, setLoading] = useRecoilState(isLoadingOwner)
    console.log(owner)
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


    useEffect(() => {
        document.title = "Huystay - Kênh Chủ HomeStay"
      
        if (!owner.idOwner) {

            notification.error({ message: "Bạn chưa phải là đối tác của HuyStay", description: "Bạn sẽ được chuyển hướng về trang chủ sau 5 giây nữa!", duration: 5, showProgress: true })
            let redirect = setTimeout(() => {
                navigate('/')
            }, 5000)
            return () => clearTimeout(redirect)
        }
    }, [owner,router.pathname])

    
    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <Spin  size="large" />
                </div>
            )}

            {
                (owner && owner.idOwner) ? 
                <Layout  >
                    <Sider width={250}  trigger={null} theme="light" collapsible collapsed={collapsed} >
                        <div className="demo-logo-vertical flex  " style={{ backgroundColor: "#040548", color: "white", height: 64, justifyContent: "center", alignItems: 'center' }}>
                            <div>

                                <h3 className='text-2xl font-bold text-center' >{!collapsed ? "Huy STAY" : "HST"}</h3>
                                <h5 className='text-center '>{!collapsed ? "Kênh chủ HomeStay" : ""}</h5>
                            </div>

                        </div>

                        <MenuOwner />
                    </Sider>
                    <Layout>
                        <Header
                            style={{
                                padding: 0,
                                paddingRight: 20,
                                background: "#040548",
                                color: "white",
                                display:"flex",
                                justifyContent:"space-between"


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
                            <div className='infor-user flex gap-3  ' style={{ textAlign: "right" ,backgroundColor:"#040548"}} >
                                <CommentOutlined style={{ fontSize: 24 }} /> |
                                <BellFilled size={""} style={{ fontSize: 24 }} /> |
                                <h3 style={{ fontSize: 18 }} >
                                    <Image src={avatar} preview={false} className='relative top-2 right-1' />
                                    <span className='ml-2'>{owner.fullname} - Chủ HomeStay</span> </h3>
                            </div>
                        </Header>
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: 20,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                                boxShadow: "1px 1px 1px 1px #E4E3F2"
                            }}
                        >
                            {children}
                        </Content>
                    </Layout>
                </Layout>
                    :
                    <NotFoundPage>
                    </NotFoundPage>
            }
        </>
    );
};
export default memo(OwnerLayout);