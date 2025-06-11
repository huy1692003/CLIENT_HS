import { memo, useState } from "react";
import Header from '../../layout/user/Header'
import Footer from '../../layout/user/Footer'
import ChatBot from "../../user/ChatBot";
import { Avatar, Tooltip } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import avatarChatbot from '../../../assets/Avatar/chatbot.png';
import { useNavigate, useLocation } from "react-router-dom";
const UserLayout = ({ children }) => {
    const [visibleChatBot, setVisibleChatBot] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div>
            <Header />
            <main style={{ margin: "30px 10px" }} className="pt-20">
                {children}
            </main>
            <div style={{ zIndex: 3000 }} className="fixed bottom-6 right-20">
                {location.pathname === '/' &&
                    <Tooltip title="Trợ lý ảo Huystay">
                        <Avatar size={80} src={avatarChatbot} className="cursor-pointer object-cover" onClick={() => setVisibleChatBot(true)} />
                    </Tooltip>
                }
            </div>
            <Footer />
            <ChatBot visible={visibleChatBot} setVisible={setVisibleChatBot} />
        </div>
    );
};
export default memo(UserLayout)