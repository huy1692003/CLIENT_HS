import { memo } from "react";
import { CalendarOutlined, CommentOutlined } from '@ant-design/icons';
import { Card} from 'antd';
import { useNavigate } from "react-router-dom";
import { URL_SERVER } from "../../constant/global";
import Meta from "antd/es/card/Meta";

const CardArticle =( { item, index }) => {
    const navigate = useNavigate();
    return (
        <Card
            onClick={() => navigate('/detail-article?id=' + item.articleID)}
        key={index}
        hoverable
        cover={<img style={{ width: '100%' , height:"280px"}} alt={item.title} src={URL_SERVER + item.picturePreview} />}
        className="shadow-lg rounded-lg"
    >
        <div className="flex items-center mb-2">
            <div className="text-sm font-bold text-purple-600">{item.category}</div>
        </div>
        <Meta
            title={<h2 className="text-lg font-bold text-blue-600">{item.title}</h2>}
            description={<p className="text-gray-500">{item.description}</p>}
        />
        <div className="flex justify-between items-center text-gray-400 text-sm mt-4">
            <span>
                <CalendarOutlined /> {new Date(item.publishDate).toLocaleDateString('vi-VN')}
            </span>
            <span>
                <CommentOutlined /> 0 Bình luận
            </span>
        </div>
        </Card>
    );
};
export default memo(CardArticle)