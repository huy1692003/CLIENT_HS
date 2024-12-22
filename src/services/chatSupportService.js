import API from "./axiosConfig";

const chatSupportService = {
  // Tạo cuộc trò chuyện nếu chưa tồn tại, hoặc trả về cuộc trò chuyện đã tồn tại
  openTabChat: async (conversation) => {
    const response = await API.post("/ChatSupport/openTabChat", conversation);
    return response.data;
  },

  // Lấy các tin nhắn của cuộc trò chuyện theo ID
  getMessagesByConversationID: async (conversationID) => {
    const response = await API.get(`/ChatSupport/getMessageByConverID/${conversationID}`);
    return response.data;
  },
   
  getListConversation: async (idUser,typeUser) => {
    const response = await API.get(`/ChatSupport/getListConversation/${idUser}/`+typeUser);
    return response.data;
  },
   
  // Gửi tin nhắn đến một người nhận
  createMessage: async (userReseiver, message) => {
    const response = await API.post(`/ChatSupport/createMessage/${userReseiver}`, message);
    return response.data;
  }
};

export default chatSupportService;
