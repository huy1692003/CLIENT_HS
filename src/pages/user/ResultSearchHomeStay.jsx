import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { paramSearchHT } from "../../recoil/atom";
import SearchHomeStay from "../../components/user/SearchHomeStay";
import { memo, useEffect, useState } from "react";
import homestayService from "../../services/homestayService";
import { message, Spin, Empty } from "antd"; // Import Empty từ antd
import CardHomeStay from "../../components/user/CardHomeStay";

const ResultSearchHomeStay = () => {
    const paramSearch = useRecoilValue(paramSearchHT);
    const [paramURL] = useSearchParams()
    const locationParam = paramURL.get("location")
    const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
    const [resHomeStay, setResHomeStay] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                let res = await homestayService.searchHomeStay(paginate.page, paginate.pageSize, paramSearch);
                console.log(res);
                res && setResHomeStay(res.items);
            } catch (error) {
                message.error("Có lỗi khi lấy dữ liệu homestay, hãy thử lại sau ít phút!", 5);
            } finally {
                setLoading(false);
            }
        };
        paramSearch.isCallAPI && getData();
    }, [paginate, paramSearch.isCallAPI]);

    return (
        <div>
            <SearchHomeStay title="" />
            <Spin className="mt-3" spinning={loading} tip="Đang tải dữ liệu...">
                {resHomeStay.length > 0 ? (
                    <>
                        <div className="text-center text-2xl font-bold">Kết quả tìm kiếm</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
                            {resHomeStay.map((h, index) => {
                                console.log(h);
                                return <CardHomeStay key={index} data={h} />
                            })}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                                        Không tìm thấy kết quả nào !
                                    </h3>
                                    <p className="text-gray-500">
                                        Vui lòng thử lại với các tiêu chí tìm kiếm khác
                                    </p>
                                </div>
                            }
                        />
                    </div>
                )}
            </Spin>
        </div>
    );
};
export default memo(ResultSearchHomeStay)
