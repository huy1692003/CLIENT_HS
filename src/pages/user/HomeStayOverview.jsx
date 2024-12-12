import { memo, useEffect, useState } from "react";
import homestayService from "../../services/homestayService";
import CardHomeStay from "../../components/user/CardHomeStay";
import { Spin, Breadcrumb } from "antd"; // Import Ant Design's loading spinner
import SearchHomeStay from "../../components/user/SearchHomeStay";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const HomeStayOverview = () => {
    const [homeStays, setHomeStays] = useState([]);
    const [loading, setLoading] = useState(true); // Khởi tạo trạng thái loading

    useEffect(() => {
        const getHomeStayViewHight = async () => {
            try {
                let result = await homestayService.getHomeStayViewHight();
                console.log(result);
                if (result) {
                    setHomeStays(result);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false); // Đặt loading thành false khi kết thúc việc lấy dữ liệu
            }
        };
        getHomeStayViewHight();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <SearchHomeStay />
            <div className="px-4 py-2 bg-gray-100">
                <Breadcrumb
                    items={[
                        {
                            title: <Link to="/">Trang chủ</Link>,
                        },
                        {
                            title: 'Danh sách HomeStay',
                        },
                    ]}
                />
            </div>
            <h2 className="text-3xl font-bold text-center mt-8 mb-4 border-gray-200 pt-10 flex items-center justify-center gap-2">
                <HomeOutlined className="text-yellow-200" /> Rất nhiều HomeStay giá cả phù hợp cho bạn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
                {homeStays.map((homestay) => (
                    <CardHomeStay key={homestay.id} data={homestay} /> // Thêm key cho mỗi CardHomeStay
                ))}
            </div>
        </div>
    );
};
export default memo(HomeStayOverview)
