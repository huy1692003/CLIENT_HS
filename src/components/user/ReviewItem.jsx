import { memo } from "react";
import { convertDate, convertDateTime } from "../../utils/convertDate";
import { Avatar, Card, Rate, Typography } from "antd"; // Import các thành phần từ Ant Design
import imageGirl from '../../assets/Image/girl2.png';
import imageBoy from '../../assets/Image/boy1.png';

const { Title, Text } = Typography;

const ReviewItem = ({ review }) => {
    // Sử dụng hình ảnh đại diện từ các file ảnh
    const avatarUrl = review.gender === 1 ? imageBoy : imageGirl;

    return (
        <Card className="p-4 bg-white rounded-xl shadow-lg" bordered={true}>
            <div className="flex items-center gap-4">
                {/* Avatar sử dụng từ Ant Design */}
                <Avatar src={avatarUrl} alt="Avatar" size={100} /> 
                <div>
                    <Title level={5} className="mb-0">{review.fullName}</Title>
                    <Text type="secondary">{review.gender === 1 ? "Nam" : "Nữ"}</Text>
                </div>
            </div>

            {/* Bình luận và đánh giá */}
            <div className="mt-4">
                <Text>{review.rv.comment}</Text>
            </div>
            <div className="mt-2 mb-3 flex items-center gap-2">
                <Text className="text-sm">Chất lượng : </Text>
                <Rate disabled defaultValue={review.rv.rating} />
            </div>

            {/* Ngày đánh giá */}
            <Text className="mt-3 text-sm text-gray-400">Đánh giá vào {convertDate(review.rv.reviewDate)}</Text>
        </Card>
    );
};

export default memo(ReviewItem);
