import { Button, Input, Modal, Avatar, notification, message, Empty } from "antd";
import { memo, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atom";
import chatSupportService from "../../services/chatSupportService";
import { convertDateTime, convertTimezoneToVN } from "../../utils/convertDate";
import useSignalR from "../../hooks/useSignaIR";
import avatar from '../../assets/Avatar/avatar-white.jpg'
import avatar2 from '../../assets/Avatar/Avatar-Dasboard.png'
import useSignalRChat from "../../hooks/useSignalRChat";
import SignalRService from "../../services/realtimeSignlR/signalService";
import { URL_SERVER } from "../../constant/global";

const SignalR = new SignalRService("chathub")
const ChatAppCard = ({ convertion, stateOpen, typeUser = 1, title = "Trao đổi trực tuyến " }) => {


    const user = useRecoilValue(userState)?.idUser || ""
    const [messages, setMessages] = useState([])
    const [messageNew, setMessageNew] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (convertion?.conversationID) {
            SignalR.startConnection(); // Khởi động kết nối SignalR
      
            // Lắng nghe sự kiện ReceiverMessage
            SignalR.onSeverSendData("ReceiverMessage", (mesNew, idConversation, userReceiver) => {
              if (idConversation === convertion.conversationID) {
                setMessages((prev) => [...prev, mesNew]); // Thêm tin nhắn mới vào danh sách
              }
            });
      
            // Dọn dẹp khi component unmount
            return () => {
               
              SignalR.connection.stop(); // Dừng kết nối khi component bị unmount
            };
          }
    }, [convertion])

    useEffect(() => {
        if (convertion || stateOpen.open) {
            getMessages();
        }
    }, [convertion, stateOpen]);

    // Tự động cuộn xuống cuối danh sách khi messages thay đổi
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


  


    const getMessages = async () => {
        try {
            let res = await chatSupportService.getMessagesByConversationID(convertion.conversationID)
            res && setMessages(res)
        } catch (error) {
            setMessages([])
        }
    }


    const handleSendMessage = async () => {
        setLoading(true)
        try {
            // Nếu user hiện tại bằng chính user 1 là khách hàng thì sẽ gửi đến user 2 là owner hoặc ngược lại
            var idUserReseiver = convertion.user1 === user ? convertion.user2 : convertion.user1
            const mes = {
                conversationID: convertion.conversationID,
                content: messageNew,
                idUserSend: user,
                isView: 0,
                timestamp: convertTimezoneToVN(new Date())
            };
            let res = await chatSupportService.createMessage(idUserReseiver, mes)
            res && setMessageNew("")

        } catch (error) {
            console.log(error)
            notification.error({ message: "Có lỗi rồi hãy thử lại sau ít phút nhé" })
        } finally {
            setLoading(false)
        }
    }


    ///Content
    return (
        <>
            <style>
                {`
                .custom-modal .ant-modal-content {
                    border-radius: 30px !important;
                    padding: 0px;
                }
                `}
            </style>
            <Modal
                visible={stateOpen.open}
                onCancel={() => stateOpen.setOpen(false)}
                width={"70vw"}
                className="custom-modal"
                closable={false}
                title={
                    <div className="font-bold grid grid-cols-2 text-2xl bg-blue-600 rounded-t-lg p-2 py-3 text-white">
                        <span className="pl-3 flex items-center">
                            <Avatar style={{ width: 50, height: 50 }} className="object-cover" src={avatar2} />
                            <span className="text-center ml-6">{convertion.user1 === user ? "Chủ HomeStay - " + convertion.userName2 : "Khách hàng - " + convertion.userName1}</span>
                        </span>
                        <span className="text-end mr-1">
                            <Button onClick={() => stateOpen.setOpen(false)} className="text-lg">Đóng</Button>
                        </span>
                    </div>
                }
                footer={
                    <div className="flex justify-between items-center gap-2 p-3">
                        <Input placeholder="Nhập nội dung vào đây ..." 
                        value={messageNew} 
                        onChange={(e) => setMessageNew(e.target.value)} type="text" 
                        className="text-lg pl-3 rounded-3xl py-2" 
                        onKeyDown={(e)=>e.key==="Enter" && handleSendMessage()}/>
                        <Button loading={loading} type="primary" onClick={handleSendMessage} className="rounded-3xl text-xl py-5 px-7 font-semibold">Gửi</Button>
                    </div>
                }
            >
                <div className="min-h-[300px] max-h-[58vh] overflow-y-scroll p-3 space-y-4">
                    {messages.length > 0 ? messages.map((message) => (
                        <div
                            key={message.msgID}
                            className={`flex items-center space-x-2 ${message.idUserSend === user ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <Avatar size="large" className="mx-2 object-cover" src={avatar} />
                            <div
                                className={`max-w-[70%] p-3 rounded-xl ${message.idUserSend === user ? 'bg-gray-100' : 'bg-blue-100'}`}
                            >
                                <div className="mb-1 text-justify">{message.content}</div>
                                <div className="text-xs text-gray-500 text-right">{convertDateTime(message.timestamp)}</div>
                            </div>
                        </div>

                    )) :
                        <div className="h-[300px] flex items-center justify-center">

                            <Empty description="Hãy cũng nhau trao đổi nhưng thắc mắc nhé !"></Empty>
                        </div>

                    }
                    <div ref={messagesEndRef}></div> {/* Thêm ref tại cuối danh sách */}
                </div>
            </Modal>
        </>
    );
};

export default memo(ChatAppCard);
