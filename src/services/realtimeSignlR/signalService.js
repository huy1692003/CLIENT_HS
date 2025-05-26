import { URL_SERVER } from "../../constant/global";
import * as signalR from '@microsoft/signalr'; // Import SignalR đúng cách
const token = sessionStorage.getItem('token');
class SignalRService {
    constructor(hubUrl="realtime") {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL_SERVER+hubUrl,{
                accessTokenFactory: () => token || '',
                withCredentials: true,
              })
              .configureLogging(signalR.LogLevel.Information)
              .withAutomaticReconnect()
              .build();
    }

    // Kết nối đến Hub
    startConnection() {
        this.connection.start()
            .then(() => console.log("Connected to SignalR Hub"))
            .catch(err => console.error(err));
    }

    // Sự kiện reload Homestay nào vừa có lượt đặt lịch
    onSeverSendData(nameEvent,callback) {
        this.connection.on(nameEvent, callback);
    }
  
}

export default SignalRService;
