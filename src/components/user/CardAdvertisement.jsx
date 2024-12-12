import { memo } from "react";
import { CalendarOutlined, DollarOutlined, LinkOutlined } from "@ant-design/icons";
import { Card, Button, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { URL_SERVER } from "../../constant/global";
import Meta from "antd/es/card/Meta";

const CardAdvertisement = ({ item, index ,classNames=""}) => {
    const navigate = useNavigate();

    return (
        <Card
            style={{ width: 400 }}
            onClick={() => window.open(item.urlClick, "_blank")}
            key={index}
            hoverable
            cover={
                <img
                    style={{ width: "100%", height: "280px", objectFit: "cover" }}
                    alt={item.adTitle}
                    src={URL_SERVER + item.adPicture}
                />
            }
            className="shadow-lg rounded-lg"
        >
            <Meta
                title={<h2 className="text-lg font-bold text-blue-600">{item.adTitle}</h2>}
                description={<p className="text-gray-500">{item.adDescription}</p>}
            />
            <div className="flex justify-between items-center text-gray-400 text-sm mt-4">
                <span>
                    <CalendarOutlined />{" "}
                    {new Date(item.startDate).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(item.endDate).toLocaleDateString("vi-VN")}
                </span>
              
            </div>

            <div className="flex justify-end mt-4">
                <Tooltip title="Xem thông tin">
                    <Button
                        type="primary"
                        icon={<LinkOutlined />}
                        onClick={() => window.open(item.urlClick, "_blank")}
                    >
                        Truy cập
                    </Button>
                </Tooltip>
            </div>
        </Card>
    );
};

export default memo(CardAdvertisement);
