import { URL_SERVER } from "../../constant/global";
import * as signalR from '@microsoft/signalr'; // Import SignalR đúng cách
class SignalRService {
    constructor(hubUrl="realtime") {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL_SERVER+hubUrl)
            .build();
    }

    // Kết nối đến Hub
    startConnection() {
        this.connection.start()
            .then(() => console.log("Connected to SignalR Hub"))
            .catch(err => console.error("Có lỗi khi kết nối đến realtime Sever", err));
    }

    // Sự kiện reload Homestay nào vừa có lượt đặt lịch
    onSeverSendData(nameEvent,callback) {
        this.connection.on(nameEvent, callback);
    }

  
}

export default SignalRService;
