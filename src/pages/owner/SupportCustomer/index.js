import { memo, useEffect, useState } from "react";
import { Avatar, Typography, message, Empty, Row, Col, Button, Spin } from "antd";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import chatSupportService from "../../../services/chatSupportService";
import avatar from '../../../assets/Avatar/avatar-white.jpg'
import { convertDateTime } from "../../../utils/convertDate";
import ChatAppCard from "../../../components/shared/ChatAppCard";
import SignalRService from "../../../services/realtimeSignlR/signalService";

const { Text } = Typography;


const SignalR = new SignalRService("chathub")
const SupportCustomer = ({ type = 1 }) => {
    const [listConver, setListConver] = useState([]);
    const [converSelected, setConverSelected] = useState();
    const [loading, setLoading] = useState(false);
    const user = useRecoilValue(userState);
    const [showChatApp, setShowChatApp] = useState(false)
    useEffect(() => {
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
    
    }, []);


    const getListConversation = async () => {
        setLoading(true);
        try {
            let res = await chatSupportService.getListConversation(user.idUser, type);
            if (res) {
                console.log(res)
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
        <>
            <h3 className="text-xl font-bold mb-4">Lịch sử hội thoại</h3>
            <div>
                {loading ? (
                    <Spin></Spin>
                ) : (
                    <div>
                        {listConver.length > 0 ? (
                            listConver.map((item) => (
                                <Row
                                    key={item.s.conversationID}
                                    style={{
                                        marginBottom: "16px",
                                        padding: "8px",
                                      
                                        borderRadius: "8px",
                                        backgroundColor: "#f9f9f9",
                                    }}
                                    className="border-l-4 border-blue-500 shadow-lg"
                                >
                                    <Col span={2} className="items-center flex">
                                        <Avatar
                                            src={avatar}

                                            size={64}
                                            style={{ marginRight: "12px" }}
                                        />
                                    </Col>
                                    <Col span={20}>
                                        <div>
                                            <Text strong>Người gửi : {(type === 2 ? item.s.userName1 : item.s.userName2)}</Text>
                                        </div>
                                        <div style={{ marginTop: "8px" }}>
                                            {item.lastMessage ? (
                                                <Text>{item.lastMessage.content}</Text>
                                            ) : (
                                                <Empty description="Chưa có tin nhắn" />
                                            )}
                                        </div>
                                        <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
                                            {convertDateTime(item.lastMessage.timestamp)}
                                        </div>
                                    </Col>
                                    <Col span={2} className="flex justify-center items-center">
                                       <Button type="primary" onClick={()=>{
                                        setConverSelected(item.s)
                                        setShowChatApp(true)
                                       }}>Trả lời</Button>
                                    </Col>
                                </Row>
                            ))
                        ) : (
                            <Empty description="Không có hội thoại" />
                        )}
                    </div>
                )}
            </div>
            {converSelected &&showChatApp &&<ChatAppCard convertion={converSelected} stateOpen={{ open: showChatApp, setOpen: setShowChatApp }} />}
        </>
    );
};

export default memo(SupportCustomer);
