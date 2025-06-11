import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Spin, Avatar, Modal } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, CloseOutlined, CloseCircleOutlined } from '@ant-design/icons';
import chatBotService from '../../services/chatbotService';
import FAQService from '../../services/faqService';
import homestayService from '../../services/homestayService';
import { initParamseach } from '../../recoil/atom';
import CardHomeStay from './CardHomeStay';

const ChatBot = ({ visible, setVisible }) => {
    const [messages, setMessages] = useState([
        { role: 'model', content: 'Xin chào! Tôi là trợ lý ảo của Huystay. Tôi có thể giúp gì cho bạn ?', isTyping: false }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [conversationHistory, setConversationHistory] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    useEffect(() => {
        const fetchFAQ = async () => {
            try {
                const response = await FAQService.getAll();
                let listFAQ = response.map(item => {
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                });

                // Khởi tạo chatbot service với FAQ
                await chatBotService.initializeFAQ(listFAQ);
            } catch (error) {
                console.error('Error fetching FAQ:', error);
            }
        };
        fetchFAQ();
    }, []);

    const typeEffect = (text, messageIndex) => {
        const message = messages[messageIndex];
        let displayedContent = '';
        let charIndex = 0;

        const typingInterval = setInterval(() => {
            if (charIndex < text.length) {
                displayedContent += text.charAt(charIndex);
                setMessages(prevMessages =>
                    prevMessages.map((msg, idx) =>
                        idx === messageIndex
                            ? { ...msg, content: displayedContent, isTyping: true }
                            : msg
                    )
                );
                charIndex++;
            } else {
                clearInterval(typingInterval);
                setMessages(prevMessages =>
                    prevMessages.map((msg, idx) =>
                        idx === messageIndex
                            ? { ...msg, isTyping: false }
                            : msg
                    )
                );
            }
        }, 2); // Speed of typing effect
    };

   
    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = { role: 'user', content: inputText, isTyping: false };
        setMessages(prev => [...prev, userMessage]);

        // Cập nhật lịch sử hội thoại
        const newUserHistory = {
            role: "user",
            parts: [{ text: inputText }]
        };

        setInputText('');
        setIsLoading(true);

        try {
            // Gửi tin nhắn kèm theo lịch sử hội thoại
            const response = await chatBotService.sendQuestion([...conversationHistory, newUserHistory]);
            const rawText = response.candidates[0].content.parts[0].text;

            let parsedText = rawText;


            // Cập nhật lịch sử hội thoại với phản hồi của bot
            const newBotHistory = {
                role: "model",
                parts: [{ text: parsedText }]
            };
            // xử lý nếu có json payloadSearch sẽ search và trả ra danh sách các homestay 
            setConversationHistory(prev => [...prev, newUserHistory, newBotHistory]);

            const botMessageIndex = messages.length + 1; // +1 because we've already added the user message
            setMessages(prev => [...prev, { role: 'model', content: '', isTyping: true }]);
            typeEffect(parsedText, botMessageIndex);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = 'Xin lỗi, yêu cầu của bạn hiện tại tôi chưa có đủ dữ liệu để trả lời. Vui lòng thử lại sau.';
            setMessages(prev => [...prev, { role: 'model', content: errorMessage, isTyping: false }]);

            // Vẫn cập nhật lịch sử ngay cả khi có lỗi
            const errorBotHistory = {
                role: "model",
                parts: [{ text: errorMessage }]
            };
            setConversationHistory(prev => [...prev, newUserHistory, errorBotHistory]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <Modal
            open={visible}
            onCancel={handleClose}
            footer={null}
            closable={false}
            width={800}
            style={{ padding: 0 }}
            centered
            className="chatbot-modal"
        >
            <div className="flex flex-col bg-white rounded-lg h-[85vh] md:h-[85vh] overflow-hidden">
                <div className="bg-blue-600 flex justify-between text-white p-3 md:p-4">
                    <h2 className="text-lg md:text-xl font-semibold">Hỗ trợ khách hàng</h2>
                    <Button type="primary" onClick={handleClose} className="bg-white text-blue-600 font-semibold">Đóng</Button>
                </div>

                <div
                    ref={chatContainerRef}
                    className="flex-1 p-3 md:p-4 overflow-y-auto"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-3 md:mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className="flex items-start max-w-[80%] md:max-w-[70%]">
                                <div
                                    className={`p-2 md:p-3 rounded-lg text-sm md:text-base ${message.role === 'user'
                                        ? 'bg-blue-500 text-white rounded-tr-none'
                                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                        }`}
                                >
                                    {message.role === 'model' ? (
                                        <div
                                            className="message-content"
                                            dangerouslySetInnerHTML={{
                                                __html: message.content
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                    .replace(/\n/g, '<br />')
                                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                    .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
                                                    .replace(/`(.*?)`/g, '<code>$1</code>')
                                            }}
                                        />
                                    ) : (
                                        message.content
                                    )}
                                    {message.isTyping && <span className="animate-pulse">|</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 md:p-4 border-t">
                    <div className="flex">
                        <Input
                            placeholder="Nhập tin nhắn..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            className="flex-1 mr-2 md:mr-3 text-sm md:text-base p-2 md:p-3"
                            size="large"
                        />
                        <Button
                            type="primary"
                            icon={isLoading ? <Spin size="small" /> : <SendOutlined />}
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputText.trim()}
                            size="large"
                            className="flex items-center justify-center"
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ChatBot;