import { Link, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { paramSearchHT } from "../../recoil/atom";
import SearchHomeStay from "../../components/user/SearchHomeStay";
import { memo, useEffect, useState } from "react";
import homestayService from "../../services/homestayService";
import { message, Spin, Empty, Breadcrumb, Button } from "antd"; // Import Empty từ antd
import CardHomeStay from "../../components/user/CardHomeStay";
import { convertTimezoneToVN } from "../../utils/convertDate";
import FilterSide from "../../components/shared/FilterSide";
import PaginateShared from "../../components/shared/PaginateShared";

const ResultSearchHomeStay = () => {
    const paramSearch = useRecoilValue(paramSearchHT);
    const [paramURL] = useSearchParams()
    const locationParam = paramURL.get("location")
    const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
    const [resHomeStay, setResHomeStay] = useState([]);
    const [loading, setLoading] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 20000000])
    const [total, setTotal] = useState(0); // Tổng số mục
    const [showSideFilter, setShowSideFilter] = useState(false)


    useEffect(() => {
        paramSearch.isCallAPI && getData();
    }, [paramSearch.isCallAPI]);

    useEffect(() => {
        getData();
    }, [paginate]);

    const getData = async () => {
        setLoading(true);
        try {
            let res = await homestayService.searchHomeStay(paginate.page, paginate.pageSize,
                {
                    ...paramSearch,
                    dateIn: paramSearch.dateIn ? convertTimezoneToVN(paramSearch.dateIn) : null,
                    dateOut: paramSearch.dateOut ? convertTimezoneToVN(paramSearch.dateOut) : null,
                });
            if (res) {
                setResHomeStay(res.items);
                setTotal(res.totalItems);
            }

        } catch (error) {
            message.error("Có lỗi khi lấy dữ liệu homestay, hãy thử lại sau ít phút!", 5);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <SearchHomeStay title="" />
            <div className="px-4 py-2 bg-gray-100">
                <Breadcrumb
                    items={[
                        {
                            title: <Link to="/">Trang chủ</Link>,
                        },
                        {
                            title: 'Tìm kiếm HomeStay',
                        },
                        ...(locationParam ? [{
                            title: locationParam||"",  // Hiển thị paramURL nếu có
                        }] : ""),
                    ]}
                />
            </div>
            <div className="my-5 flex px-2 justify-between">
                <div className="text-2xl font-bold text-gray-700">Có {total} kết quả tìm thấy ⚡⚡</div>
                <Button
                    className="text-xl font-semibold p-5 border-2 border-gray-500"
                    onClick={() => setShowSideFilter(true)}
                    icon={<i className="fa-solid fa-sliders text-xl"></i>} // Sử dụng icon FontAwesome với thẻ <i>
                >
                    Bộ lọc
                </Button>
            </div>

            <FilterSide showSideFilter={showSideFilter} setShowSideFilter={setShowSideFilter} refeshData={getData} setPaginate={setPaginate}
                setPriceRange={setPriceRange}
                priceRange={priceRange}
            />
            <Spin className="mt-3" spinning={loading} tip="Đang tải dữ liệu...">
                {resHomeStay.length > 0 ? (
                    <>
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
            {total && total > paginate.pageSize && <PaginateShared page={paginate.page} pageSize={paginate.pageSize} setPaginate={setPaginate} totalRecord={total} />}

        </div>
    );
};
export default memo(ResultSearchHomeStay)
