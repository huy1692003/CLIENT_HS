import { useEffect } from "react";
import SignalRService from "../services/realtimeSignlR/signalService";

/**
 * Hook để thiết lập kết nối với SignalR và lắng nghe sự kiện từ server
 * 
 * @param {string} eventName - Tên sự kiện từ server mà bạn muốn lắng nghe (ví dụ: "RefeshDateHomeStay").
 * @param {function} callback - Hàm callback sẽ được gọi khi sự kiện từ server xảy ra.
 * 
 * Hook này tự động kết nối tới SignalR server khi component mount và ngừng kết nối khi component unmount.
 * 
 * Ví dụ sử dụng:
 * 
 * const handleBookingUpdate = (idHomeStay) => {
 *   console.log("Homestay có lượt đặt lịch mới:", idHomeStay);
 * };
 * 
 * useSignalR("RefeshDateHomeStay", handleBookingUpdate);
 */
const useSignalRChat= (eventName, callback) => {
  useEffect(() => {
    // Khởi tạo SignalRService và bắt đầu kết nối
    const signalRService = new SignalRService("chathub");
    signalRService.startConnection();

    // Đăng ký sự kiện với server
    signalRService.onSeverSendData(eventName, callback);

    // Cleanup khi component unmount (ngừng kết nối SignalR)
    return () => {
      signalRService.connection.stop();
    };
  }, [eventName, callback]); // Dependency array, hook chỉ chạy lại khi eventName hoặc callback thay đổi
};

export default useSignalRChat;
