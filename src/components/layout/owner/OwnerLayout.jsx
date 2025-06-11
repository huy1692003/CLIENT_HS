import React, { memo, useEffect, useState } from "react";
import {
    BellFilled,
    CommentOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PoweroffOutlined,
} from "@ant-design/icons";
import {
    Button,
    Image,
    Layout,
    notification,
    Spin,
    Drawer,
    Badge,
    theme,
    Typography,
    Popconfirm,
    Tooltip,
    message,
    Avatar,
} from "antd";
import avatar from "../../../assets/Avatar/Avatar-Dasboard.png";
import MenuOwner from "./Menu";
import { useRecoilState } from "recoil";
import { userState, isLoadingOwner } from "../../../recoil/atom";
import { useLocation, useNavigate } from "react-router-dom";
import NotFoundPage from "../../../pages/NotFoundPage";
import useSignalR from "../../../hooks/useSignaIR";
import notificationService from "../../../services/notificationService";
import GroupNotification from "../../shared/GroupNotification";
import chatSupportService from "../../../services/chatSupportService";
import useSignalRChat from "../../../hooks/useSignalRChat";
import { URL_SERVER } from "../../../constant/global";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const OwnerLayout = ({ children }) => {
    const router = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const [owner, setOwner] = useRecoilState(userState);
    const [loading, setLoading] = useRecoilState(isLoadingOwner);
    const [notifications, setNotifications] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [totalConver, setTotalConver] = useState(0)
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    // Nhận thông báo qua SignalR
    useSignalR("ReseiverBookingNew", (idOwnerRes, notifi) => {
        if (idOwnerRes === owner.idOwner) {
            notification.info({
                message: notifi.title,
                description: notifi.message,
                duration: 12,
                showProgress: true
            });
            fetchNotifications();
        }
    });



    useSignalR("ReseiverPaymentNew", (idOwnerRes, notifi, _) => {
        if (idOwnerRes === owner.idOwner) {
            notification.info({
                message: notifi.title,
                description: notifi.message,
                duration: 12,
                showProgress: true
            });
            fetchNotifications();
        }
    });


    const getListConversation = async () => {
        try {
            let res = await chatSupportService.getListConversation(owner.idUser, 2);
            if (res) {
                return res.length;
            }
        } catch (error) {
            message.error("Không thể lấy danh sách hội thoại");
            return 0;

        }
    };


    useSignalRChat("ReceiverMessage", async (mesNew, idConversation, userReceiver) => {

        if (owner.idUser === userReceiver) {
            let total_new = await getListConversation()
            if (total_new > totalConver) {
                notification.success({ message: "Yêu cầu hỗ trợ mới", description: "Bạn có một yêu cầu hỗ trợ mới !" ,duration:10})
            }
            setTotalConver(total_new)
        }
    });

    // Lấy danh sách thông báo
    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getByUser(owner.idUser);
            setNotifications(res);
        } catch (error) {
            setNotifications([]);
        }
    };

    useEffect(() => {
        if (owner && owner.idOwner) {
            async function loadData() {

                fetchNotifications();
                let total_new = await getListConversation()
                setTotalConver(total_new)
            }
            loadData()
        }
    }, [owner]);

    // Kiểm tra trạng thái người dùng
    useEffect(() => {
        document.title = "Huystay - Kênh Chủ HomeStay";

        if (!owner || !owner.idOwner) {
            notification.error({
                message: "Bạn chưa phải là đối tác của HuyStay",
                description:
                    "Bạn sẽ được chuyển hướng về trang chủ sau 5 giây nữa!",
                duration: 5,
            });
            const redirect = setTimeout(() => {
                navigate("/");
            }, 5000);
            return () => clearTimeout(redirect);
        }
    }, [owner, router.pathname, navigate]);

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <Spin size="large" />
                </div>
            )}

            {owner && owner.idOwner ? (
                <Layout>
                    <Sider
                        width={250}
                        trigger={null}
                        theme="light"
                        className=""
                        collapsible
                        collapsed={collapsed}
                    >
                        <div
                            className="demo-logo-vertical flex"
                            style={{
                                backgroundColor: "#040548",
                                color: "white",
                                height: 64,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <h3 className="text-2xl font-bold text-center">
                                    {!collapsed ? "Huy STAY" : "HST"}
                                </h3>
                                <h5 className="text-center">
                                    {!collapsed ? "Kênh chủ HomeStay" : ""}
                                </h5>
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
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                type="text"
                                icon={
                                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                                }
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: "16px",
                                    width: 64,
                                    height: 64,
                                    color: "white",
                                }}
                            />
                            <div
                                className="infor-user flex gap-6 items-center"
                                style={{
                                    textAlign: "right",
                                    backgroundColor: "#040548",
                                }}
                            >

                                <Badge className="flex"
                                    count={totalConver}
                                >
                                    <CommentOutlined onClick={() => navigate("/owner/support-customer")} style={{ fontSize: 27, color: "white" }} /> |
                                </Badge>



                                <Badge className="flex"
                                    count={notifications.filter((n) => !n.isRead).length}
                                >
                                    <BellFilled
                                        style={{ fontSize: 27, color: "white" }}
                                        onClick={() => setIsDrawerOpen(true)}
                                    />
                                </Badge>
                                |
                                <h3 className="flex items-center" style={{ fontSize: 16 }}>
                                    <Avatar
                                        src={owner.avatar ? URL_SERVER + owner.avatar : avatar}
                                        size={40}

                                    />
                                    <span className="ml-2">Hello, {owner.fullname}</span>
                                </h3>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn đăng xuất không?"
                                    onConfirm={() => {
                                        sessionStorage.removeItem("user");
                                        setOwner(null); // Đặt trạng thái người dùng thành null
                                        navigate("/login-user"); // Điều hướng về trang đăng nhập
                                    }}
                                    okText="Đăng xuất"
                                    cancelText="Hủy"
                                >
                                    <Tooltip title="Đăng xuất" >

                                        <PoweroffOutlined className="text-[27px] " style={{ fontSize: 27, color: "white" }} />
                                    </Tooltip>


                                </Popconfirm>
                            </div>
                        </Header>
                        <Content
                            style={{
                                margin: "24px 16px",
                                padding: 20,
                                minHeight: "90vh",
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                                boxShadow: "1px 1px 1px 1px #E4E3F2",
                            }}
                        >
                            {children}
                        </Content>
                    </Layout>

                    {/* Drawer hiển thị thông báo */}
                    <Drawer
                        title={<Title level={4}>Thông báo</Title>}
                        placement="right"
                        onClose={() => setIsDrawerOpen(false)}
                        open={isDrawerOpen}
                        width={"50vw"}
                    >
                        <GroupNotification list={notifications} refeshData={fetchNotifications} />
                    </Drawer>
                </Layout>
            ) : (
                <NotFoundPage />
            )}
        </>
    );
};

export default memo(OwnerLayout);
