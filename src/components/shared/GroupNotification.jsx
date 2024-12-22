import CardNotification from "./CardNotification";
import React, { memo } from "react";
import { List, Card, Badge, Typography, Space } from "antd";

const { Title, Text } = Typography;
const GroupNotification = ({ list , refeshData}) => {
    return (
      <List
        dataSource={list}
        renderItem={(notification) => (
          <List.Item style={{ padding: 10 }}>
            <CardNotification notification={notification} refeshData={refeshData} />
          </List.Item>
        )}
        bordered
       
        style={{ maxWidth: "100%", margin: "10px 0px" }}
      />
    );
  };
  
  export default memo(GroupNotification);