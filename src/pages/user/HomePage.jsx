import { memo, useEffect, useState } from "react";
import Banner from "../../components/user/Banner";
import { useTypingEffect } from "../../hooks/useTypingEffect"; // Import hook
import '../../styles/user/homepage.scss';
import { Button, Carousel, DatePicker, Image, Skeleton } from "antd"; // Import Skeleton from Ant Design
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import SearchComponent from "../../components/user/SearchHomeStay";
import Article from "./Article";
import CardHomeStay from "../../components/user/CardHomeStay";
import homestayService from "../../services/homestayService";
import useWidthWindow from "../../hooks/useWidthWindow";
import { useNavigate } from "react-router-dom";
import advertisementService from "../../services/advertisementService";
import CardAdvertisement from "../../components/user/CardAdvertisement";
import articleService from "../../services/articleService";
import CardArticle from "../../components/user/CardArticle";

const widthInit = 1300;

const HomePage = () => {
    const navigate = useNavigate();
    const [homeStayViewHight, setHomeStayViewHight] = useState([]);
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true); // Thiết lập loading
    const windowWidth = useWidthWindow();
    const [articleNew, setArticleNew] = useState([])


    useEffect(() => {
        getAllAdvertisements();
        getHomeStayViewHight();
        getArticleNew();
    }, []);

    const getAllAdvertisements = async () => {
        try {
            const res = await advertisementService.getAllAdvertisements();
            res && setAdvertisements(res);
        } catch (error) {
            console.log(error);
        }
    };

    const getArticleNew = async () => {
        try {
            const res = await articleService.getNew();
            res && setArticleNew(res);
        } catch (error) {
            console.log(error);
        }
    }

    const getHomeStayViewHight = async () => {
        try {
            let result = await homestayService.getHomeStayViewHight();
            result && setHomeStayViewHight(result);
            setLoading(false); // Đặt loading thành false khi dữ liệu đã được lấy
        } catch (error) {
            console.log(error);
            setLoading(false); // Nếu có lỗi, cũng đặt loading là false
        }
    };

    return (
        <div>
            <Skeleton loading={loading} active round>
                <Banner listAdvertisement={advertisements.filter(s => s.placement === 1)} />
            </Skeleton>
            <SearchComponent />

            {/* Địa điểm yêu thích */}

            {/* Một số HomeStay nhiều lượt đặt phòng */}
            <div className="w-full flex justify-between h-auto md:h-[widthInit] ">
                {/* Thanh bên hiển thị khi màn hình lớn hơn 768px */}
                {windowWidth > 768 && (
                    <div className="w-[30%] h-full pl-4">
                        <h1 className="text-2xl text-center font-bold">
                            HuyStay MALL <i className="fa-solid fa-certificate text-yellow-500"></i>
                        </h1>
                        <p className="mt-1 text-center font-light" style={{ fontFamily: "Lexend, sans-serif" }}>
                            Tìm đâu cũng có , chỉ có tại HuyStay MALL!
                        </p>

                        <div className="mt-4 flex flex-wrap justify-center gap-4 max-h-[1600px] overflow-y-auto">
                            <Skeleton loading={loading} active>
                                {advertisements.filter(s => s.placement === 2).map((a, index) => (
                                    <CardAdvertisement key={index} index={index} item={a} />
                                ))}
                            </Skeleton>
                        </div>
                    </div>
                )}

                <div>
                    <p className="text-2xl text-center">Homestay nổi bật</p>
                    {/* Nội dung chính */}
                    <div className="grid grid-cols-5">

                        {homeStayViewHight.map(s => {
                            return <CardHomeStay data={s} />
                        }
                        )}
                    </div>
                </div>
            </div>

            {/* Hiển thị tin tức mới nhất */}
            <div className="text-2xl font-bold text-center mt-10 mb-5 py-5 rounded-2xl" style={{ backgroundColor: '#F5F5F5' }}>
                Danh mục bài viết mới cập nhật <i className="fa-solid fa-fire text-red-600 text-2xl ms-3"></i>
            </div>
            <div className="grid grid-cols-4 px-5 gap-2">
                <Skeleton loading={loading} active>
                    {articleNew.map((a, index) => (
                        <div className=" py-4">
                            <CardArticle item={a} index={index} ></CardArticle>
                        </div>
                    ))}
                </Skeleton>
                <Button className="flex ml-auto col-span-4" onClick={() => navigate('/article')}>Xem thêm</Button>
            </div>
            {/* Địa điểm HomeStay Nổi bật */}
            <div className="text-2xl font-bold text-center mt-10 mb-5 py-5 rounded-2xl" style={{ backgroundColor: '#F5F5F5' }}>
                Những địa điểm HomeStay nổi bật , được đông đảo người dùng yêu thích
            </div>
            <div className="w-full overflow-x-auto whitespace-nowrap mb-3">
                <div className="flex space-x-2">
                    <Skeleton loading={loading} rows={6} active>
                        {advertisements.filter(s => s.placement === 3).map((a, index) => (
                            <div className="p-2">

                                <CardAdvertisement key={index} index={index} item={a} />
                            </div>
                        ))}
                    </Skeleton>
                </div>
            </div>
        </div>
    );
};

export default memo(HomePage);
