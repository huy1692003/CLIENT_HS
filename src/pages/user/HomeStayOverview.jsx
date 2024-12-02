import { memo, useEffect, useState } from "react";
import homestayService from "../../services/homestayService";
import CardHomeStay from "../../components/user/CardHomeStay";
import { Spin } from "antd"; // Import Ant Design's loading spinner

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
            <h2 className="text-3xl font-bold text-center mt-8 border-t-2 border-gray-200 pt-10">
                Rất nhiều HomeStay giá cả phù hợp cho bạn
            </h2>
            <div className="box-list-homestay flex flex-wrap p-5 gap-10 gap-y-6 pl-20">
                {homeStays.map((homestay) => (
                    <CardHomeStay key={homestay.id} data={homestay} /> // Thêm key cho mỗi CardHomeStay
                ))}
            </div>
        </div>
    );
};
export default memo(HomeStayOverview)
