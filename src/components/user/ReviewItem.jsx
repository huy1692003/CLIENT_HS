import { memo } from "react";
import { convertDate } from "../../utils/convertDate";
import { Avatar, Card, Rate, Typography, Divider } from "antd";
import imageGirl from '../../assets/Image/girl2.png';
import imageBoy from '../../assets/Image/boy1.png';

const { Text, Paragraph } = Typography;

const ReviewItem = ({ review }) => {
    const avatarUrl = review.gender === 1 ? imageBoy : imageGirl;

    return (
        <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-300" bordered={true}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar src={review.avatar || avatarUrl} alt="Avatar" size={{ xs: 40, sm: 48 }} />
                    <div>
                        <Text strong className="text-sm sm:text-base">{review.fullName}</Text>
                        <div className="flex items-center mt-1">
                            <Rate disabled defaultValue={review.rv.rating} style={{ fontSize: '14px', sm: '16px' }} />
                            <Text className="ml-2 text-gray-700 font-medium text-xs sm:text-sm">{review.rv.rating.toFixed(1)}</Text>
                        </div>
                    </div>
                </div>
                <Text className="text-xs text-gray-500">Đánh giá vào {convertDate(review.rv.reviewDate)}</Text>
            </div>
            
            <div className="mt-2 sm:mt-3">
                <Text type="secondary" className="text-xs sm:text-sm">Đã thuê: <Text strong className="text-blue-600">{review.roomName}</Text></Text>
            </div>
            
            <Divider className="my-2 sm:my-3" />
            
            <Paragraph className="text-xs sm:text-sm md:text-base text-gray-800">
                <i className="fas fa-quote-left text-blue-600 mr-2"></i>{review.rv.comment}
            </Paragraph>
        </Card>
    );
};

export default memo(ReviewItem);
