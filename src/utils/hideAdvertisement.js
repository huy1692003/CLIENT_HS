import { notification } from "antd";
import advertisementService from "../services/advertisementService";

export const handleHideAdver = async (record , refeshData) => {
        try {
            await advertisementService.updateStatusAdver(record.adID, 4);
            notification.success({
                message: "Thông báo ",
                description: "Bạn vừa ẩn thành công quảng cáo #"+record.adID,
            });
            refeshData();
        } catch (error) {
            notification.error({ message: "Thất bại", description: "Có lỗi rồi " });
        }
    };