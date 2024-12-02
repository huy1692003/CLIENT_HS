import { Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { memo } from 'react';

const reviews = [
    {
        name: "Hai",
        country: "Việt Nam",
        flagUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png",
        content: "Không khí ấm cúng, vị trí ngay trung tâm tiện lợi. Chủ nhà hiểu khách. Rất tuyệt, mình tiếp tục ghé lần sau.",
        rating: 9,
        avatarUrl: "https://i.pravatar.cc/150?img=1", // Avatar tạm thời
    },
    {
        name: "Minh",
        country: "Việt Nam",
        flagUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png",
        content: "Phòng nghỉ rất tốt, sạch sẽ và gần trung tâm. Giá cả hợp lý, sẽ quay lại lần sau.",
        rating: 8,
        avatarUrl: "https://i.pravatar.cc/150?img=22", // Avatar tạm thời
    },
    {
        name: "Huy",
        country: "Việt Nam",
        flagUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png",
        content: "“Phòng đẹp và sạch sẽ. Chủ nhà rất thân thiện. Chúng tôi được nâng cấp phòng miễn phí do còn phòng trống.”",
        rating: 8,
        avatarUrl: "https://i.pravatar.cc/150?img=3", // Avatar tạm thời
    },
    {
        name: "Vinh Tiền Lẻ",
        country: "Việt Nam",
        flagUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png",
        content: "“Phòng đẹp và sạch sẽ. Chủ nhà rất thân thiện. Chúng tôi được nâng cấp phòng miễn phí do còn phòng trống.”",
        rating: 8,
        avatarUrl: "https://i.pravatar.cc/150?img=9", // Avatar tạm thời
    },
    {
        name: "Quảng",
        country: "Việt Nam",
        flagUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png",
        content: "“Phòng đẹp và sạch sẽ. Chủ nhà rất thân thiện. Chúng tôi được nâng cấp phòng miễn phí do còn phòng trống.”",
        rating: 8,
        avatarUrl: "https://i.pravatar.cc/150?img=4", // Avatar tạm thời
    },
    {
        name: "Tiến Bịp",
        country: "Việt Nam",
        flagUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png",
        content: "“Phòng đẹp và sạch sẽ. Chủ nhà rất thân thiện. Chúng tôi được nâng cấp phòng miễn phí do còn phòng trống.”",
        rating: 8,
        avatarUrl: "https://i.pravatar.cc/150?img=14", // Avatar tạm thời
    },
];

 const HomeStayReviews=()=> {
    return (
        <div className="mt-5">
            <h1 className="text-2xl font-bold">Đánh giá về HomeStay</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {reviews.map((review, index) => (
                    <Card
                        key={index}
                        className="shadow-md hover:shadow-lg"
                        style={{ borderRadius: 10 }}
                        bodyStyle={{ padding: '16px 24px' }}
                    >
                        <div className="flex items-center mb-4">
                            <Avatar src={review.avatarUrl} size={48} icon={<UserOutlined />} className="mr-4" />
                            <div>
                                <h2 className="text-lg font-bold">{review.name}</h2>
                                <p className="text-sm text-gray-500 flex items-center">
                                    <img src={review.flagUrl} alt="flag" className="w-5 h-5 mr-2" />
                                    {review.country}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{review.content}</p>
                        <div className="flex justify-between items-center">
                            <a href="#" className="text-blue-500 hover:underline text-sm font-medium">Tìm hiểu thêm</a>
                            <p className="text-orange-500 font-bold">{review.rating}/10</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
export default memo(HomeStayReviews)
