import { memo, useEffect, useState } from "react";
import { Avatar, Typography, message, Empty, Row, Col, Button, Spin, Badge, Card, Divider } from "antd";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import chatSupportService from "../../../services/chatSupportService";
import avatar from '../../../assets/Avatar/avatar-white.jpg'
import { convertDateTime } from "../../../utils/convertDate";
import ChatAppCard from "../../../components/shared/ChatAppCard";
import SignalRService from "../../../services/realtimeSignlR/signalService";
import { ClockCircleOutlined, CommentOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const SignalR = new SignalRService("chathub")
const SupportCustomer = ({ type = 1 }) => {
    const [listConver, setListConver] = useState([]);
    const [converSelected, setConverSelected] = useState();
    const [loading, setLoading] = useState(false);
    const user = useRecoilValue(userState);
    const [showChatApp, setShowChatApp] = useState(false)

    useEffect(() => {
        if (user && user?.idUser) {

            getListConversation();
            SignalR.startConnection()
            SignalR.onSeverSendData("ReceiverMessage", (mesNew, idConversation, userReceiver) => {
                if (user.idUser === userReceiver) {
                    getListConversation()
                }
            })
            return () => {
                SignalR.connection.stop()
            }
        }
    }, []);

    const getListConversation = async () => {
        setLoading(true);
        try {
            let res = await chatSupportService.getListConversation(user.idUser, type);
            if (res) {
                res.sort((a, b) => new Date(b.lastMessage?.timestamp) - new Date(a.lastMessage?.timestamp));
                setListConver(res)
            }
        } catch (error) {
            message.error("Không thể lấy danh sách hội thoại");
            setListConver([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="conversation-container bg-gray-50 p-6 rounded-lg">
            <Title level={3} className="mb-6 text-blue-800 flex items-center">
                <MessageOutlined className="mr-2" /> Hỗ trợ khách hàng
            </Title>
            <Divider className="my-4" />

            {loading ? (
                <div className="flex justify-center p-10">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="conversation-list">
                    {listConver.length > 0 ? (
                        listConver.map((item) => (
                            <Card
                                key={item.s.conversationID}
                                className="mb-4 hover:shadow-lg transition-all duration-300 border-0 shadow"
                                bodyStyle={{ padding: 0 }}
                            >
                                <Row className="w-full">
                                    <Col span={3} className="flex justify-center items-center p-4 bg-gradient-to-r from-blue-600 to-blue-400">
                                        <Avatar
                                            src={avatar}
                                            size={60}
                                            icon={<UserOutlined />}
                                            className="border-2 border-white shadow-md"
                                        />
                                    </Col>
                                    <Col span={17} className="p-4">
                                        <div className="flex items-center mb-2">
                                            <Text strong className="text-lg">
                                                {(type === 2 ? item.s.userName1 : item.s.userName2)}
                                            </Text>
                                            <Badge
                                                status={item.lastMessage?.isRead ? "default" : "processing"}
                                                className="ml-2"
                                            />
                                        </div>
                                        <div className="message-preview bg-gray-50 p-2 rounded-lg max-h-12 overflow-hidden">
                                            {item.lastMessage ? (
                                                <Text ellipsis={{ rows: 1 }} className="text-gray-600">
                                                    {item.lastMessage.content}
                                                </Text>
                                            ) : (
                                                <Text italic className="text-gray-400">Chưa có tin nhắn</Text>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center text-xs text-gray-500">
                                            <ClockCircleOutlined className="mr-1" />
                                            {convertDateTime(item.lastMessage?.timestamp)}
                                        </div>
                                    </Col>
                                    <Col span={4} className="flex justify-center items-center bg-gray-50">
                                        <Button
                                            type="primary"
                                            icon={<CommentOutlined />}
                                            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border-none shadow-md"
                                            onClick={() => {
                                                setConverSelected(item.s)
                                                setShowChatApp(true)
                                            }}
                                        >
                                            Trả lời
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    ) : (
                        <Card className="text-center p-10">
                            <Empty
                                description="Không có hội thoại nào"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </Card>
                    )}
                </div>
            )}
            {converSelected && showChatApp &&
                <ChatAppCard
                    convertion={converSelected}
                    stateOpen={{ open: showChatApp, setOpen: setShowChatApp }}
                />
            }
        </div>
    );
};

export default memo(SupportCustomer);
