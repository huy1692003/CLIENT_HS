import { memo } from "react";
import React from "react";
import { Card, Badge, Typography, Space, Button } from "antd";
import { ClockCircleOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { convertDateTime } from "../../utils/convertDate";
import notificationService from "../../services/notificationService";

const { Title, Text } = Typography;

const CardNotification = ({ notification, refeshData }) => {
  const handleIsRead = async () => {
    try {
      await notificationService.isRead(notification.id); // Gọi API đánh dấu đã đọc
      refeshData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await notificationService.delete(notification.id); // Gọi API xóa
      refeshData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Badge.Ribbon
      text={notification.isRead ? "Đã đọc" : "Chưa đọc"}
      color={notification.isRead ? "green" : "red"}
    >
      <Card
        title={<p className="">{notification.title}</p>}
        bordered={true}
        style={{ width: "100%", margin: "10px auto" }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>{notification.message}</Text>
          <Text type="secondary">
            <ClockCircleOutlined /> Ngày gửi {convertDateTime(notification.createdAt)}
          </Text>
          {/* Thêm nút Đã xem và Xóa */}
          <Space>
            {!notification.isRead && (
              <Button 
                type="primary" 
                icon={<CheckOutlined />} 
                onClick={handleIsRead}
              >
                Đánh dấu đã xem
              </Button>
            )}
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </Space>
        </Space>
      </Card>
    </Badge.Ribbon>
  );
};

export default memo(CardNotification);
