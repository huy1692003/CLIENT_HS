import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { paramSearchHT } from "../../recoil/atom";
import SearchHomeStay from "../../components/user/SearchHomeStay";
import { memo, useEffect, useState } from "react";
import homestayService from "../../services/homestayService";
import { message, Spin } from "antd"; // Import Spin để hiển thị loading
import CardHomeStay from "../../components/user/CardHomeStay";

 const ResultSearchHomeStay = () => {
    const paramSearch = useRecoilValue(paramSearchHT);
    const [paramURL] = useSearchParams()
    const locationParam = paramURL.get("location")
    const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
    const [resHomeStay, setResHomeStay] = useState([]);
    const [loading, setLoading] = useState(false); // State để quản lý loading

    useEffect(() => {
        const getData = async () => {
            setLoading(true); // Bắt đầu loading khi gọi API
            try {
                let res = await homestayService.searchHomeStay(paginate.page, paginate.pageSize, paramSearch);
                console.log(res);
                res && setResHomeStay(res.items);
            } catch (error) {
                message.error("Có lỗi khi lấy dữ liệu homestay, hãy thử lại sau ít phút!", 5);
            } finally {
                setLoading(false); // Dừng loading khi API hoàn thành
            }
        };
        getData();
    }, [paginate, locationParam]); // Nên thêm paramSearch và paginate vào dependency để gọi lại API khi giá trị thay đổi

    return (
        <div>
            <SearchHomeStay title="" />
            <Spin spinning={loading} tip="Đang tải dữ liệu..."> {/* Hiển thị loading */}
                <div className="box-result-homestay flex flex-wrap justify-between mb-10">
                    {resHomeStay?.map((h, index) =>
                        <CardHomeStay key={index} data={h} /> // Nên có key cho mỗi item khi render list
                    )}
                </div>
            </Spin>
        </div>
    );
};
export default memo(ResultSearchHomeStay)
