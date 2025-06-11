import axios from "axios";

const GEMINI_API_KEY = "AIzaSyD5NxGqQNTSORU_7q2rfLAziXRIJt41tYE";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Template dữ liệu đầu vào cho tìm kiếm homestay
const initPayloadSearch = {
    location: null,
    priceRange: null,
    name: null,
    numberAdults: 1,
    numberChildren: 0,
    numberBaby: 0,
    dateIn: null,
    dateOut: null,
};

// Prompt hệ thống huấn luyện cố định cho chatbot
const TrainChatBot = [
    {
        role: "user",
        parts: [{
            text: `Bạn là Huystay Assistant – một chatbot chuyên nghiệp hỗ trợ khách hàng về dịch vụ Huystay.

            Nhiệm vụ:
            1. Trả lời các câu hỏi từ khách hàng dựa trên dữ liệu FAQ.
            2. Giữ thái độ thân thiện, chuyên nghiệp và sử dụng ngôn ngữ tự nhiên.
            3. Khi không biết câu trả lời, hãy thừa nhận và đề xuất khách liên hệ hỗ trợ.
            `

        }]
    },
    {
        role: "model",
        parts: [{
            text: "Tôi đã hiểu hướng dẫn. Tôi sẽ hỗ trợ khách hàng chuyên nghiệp, thân thiện, sử dụng dữ liệu từ FAQ và trả về định dạng payloadSearch đúng khi cần tìm kiếm homestay."
        }]
    }
];

// FAQ hiện tại (sẽ được cập nhật từ ngoài)
let faqData = [];

// Hàm tạo prompt chứa FAQ
const buildFAQPrompt = (faqList) => {
    return {
        role: "user",
        parts: [{
            text: `Dưới đây là danh sách các câu hỏi thường gặp (FAQ) về Huystay, hãy dùng chúng để hỗ trợ khách hàng:

${faqList.map((faq, index) => `${index + 1}. Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

Hãy trả lời tự nhiên, dễ hiểu, không sao chép nguyên văn một cách cứng nhắc.`
        }]
    };
};

const chatBotService = {
    initializeFAQ: async (faqList) => {
        try {
            faqData = faqList;

            // Thêm vào TrainChatBot
            const faqPrompt = buildFAQPrompt(faqList);
            TrainChatBot.push(faqPrompt);
            TrainChatBot.push({
                role: "model",
                parts: [{ text: "Tôi đã ghi nhớ FAQ và sẽ sử dụng để hỗ trợ khách hàng chính xác và tự nhiên." }]
            });

            console.log('FAQ initialized successfully');
        } catch (error) {
            console.error("Error initializing FAQ:", error);
        }
    },

    sendQuestion: async (conversationHistory) => {
        try {
            const fullContent = [...TrainChatBot, ...conversationHistory];
            const response = await axios.post(BASE_URL, { contents: fullContent });
            return response.data;
        } catch (error) {
            console.error("Error calling Gemini API:", error?.response?.data || error.message);
            throw error;
        }
    },

    resetConversation: () => {
        return TrainChatBot.slice();
    },

    getCurrentFAQ: () => {
        return faqData;
    }
};

export default chatBotService;
