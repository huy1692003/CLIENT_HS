import { memo, useEffect, useRef, useState } from "react";
import homestayService from "../../services/homestayService";
import CardHomeStay from "../../components/user/CardHomeStay";
import { Spin, Breadcrumb, Pagination, notification, Empty, Button, Drawer, Slider, Row, Radio, Col, InputNumber, Space } from "antd"; // Import Empty từ Ant Design
import SearchHomeStay from "../../components/user/SearchHomeStay";
import { Link } from "react-router-dom";
import { CloseCircleFilled, CloseCircleOutlined, CloseSquareFilled, CloseSquareOutlined, CloseSquareTwoTone, DownOutlined, HomeOutlined } from "@ant-design/icons";
import PaginateShared from "../../components/shared/PaginateShared";
import { useRecoilState } from "recoil";
import { initParamseach, paramSearchHT } from "../../recoil/atom";
import FilterSide from "../../components/shared/FilterSide";

const initPaginate = { page: 1, pageSize: 20 }

const HomeStayOverview = () => {
    const [homeStays, setHomeStays] = useState([]);
    const [loading, setLoading] = useState(true); // Khởi tạo trạng thái loading
    const [paginate, setPaginate] = useState(initPaginate)
    const [total, setTotal] = useState(0); // Tổng số mục
    const [searchParam, setSearchParams] = useRecoilState(paramSearchHT)
    const [priceRange, setPriceRange] = useState([0, 20000000])
    const [showSideFilter, setShowSideFilter] = useState(false)
    const ref=useRef(null)
   

    useEffect(() => {
        getHomeStayALl(initParamseach);
        setSearchParams(initParamseach)
    }, []);

    // Thêm các dependencies trong useEffect
    useEffect(() => {
        if (searchParam.isCallAPI) {

            getHomeStayALl(searchParam);
            setShowSideFilter(false)
            window.scrollTo(0, 0);
        }
    }, [searchParam.isCallAPI]); // Thêm các dependencies trong useEffect


    useEffect(() => {
        getHomeStayALl(searchParam)
        setShowSideFilter(false)
        window.scrollTo(0, 0);
    }, [paginate.page, paginate.pageSize])

    const getHomeStayALl = async (search) => {
        
        setLoading(true)
        try {
            let result = await homestayService.searchHomeStay(paginate.page, paginate.pageSize, search);
            console.log(result);

            if (result) {
                setHomeStays(result.items);
                setTotal(result.totalItems);
            }
        } catch (error) {
            console.log(error);
            notification.error({ message: "Có lỗi khi tìm kiếm HomeStay, hãy thử lại sau" })
        } finally {
            setLoading(false); // Đặt loading thành false khi kết thúc việc lấy dữ liệu
        }
    };
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

            <div className="my-5 flex px-2 justify-between">
                <div className="text-2xl font-bold text-gray-700">HomeStay chất lượng chỉ có tại HuyStay ⚡⚡</div>
                <Button
                    className="text-xl font-semibold p-5 border-2 border-gray-500"
                    onClick={() => setShowSideFilter(true)}
                    icon={<i className="fa-solid fa-sliders text-xl"></i>} // Sử dụng icon FontAwesome với thẻ <i>
                >
                    Bộ lọc
                </Button>
            </div>


            <FilterSide  showSideFilter={showSideFilter} setShowSideFilter={setShowSideFilter} refeshData={getHomeStayALl} setPaginate={setPaginate} 
              setPriceRange={setPriceRange}
              priceRange={priceRange}
            />

            {/* Kiểm tra nếu không có HomeStay */}
            {homeStays.length === 0 ? (
                <div className="flex justify-center items-center h-[50vh]">
                    <Empty description="Không có HomeStay nào phù hợp với thông tin của bạn " />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
                    {homeStays.map((homestay) => (
                        <CardHomeStay key={homestay.id} data={homestay} /> // Thêm key cho mỗi CardHomeStay
                    ))}
                </div>
            )}

            <PaginateShared page={paginate.page} pageSize={paginate.pageSize} setPaginate={setPaginate} totalRecord={total} />
        </div>
    );
};

export default memo(HomeStayOverview);
