import { memo, useEffect, useState } from "react";
import Banner from "../../components/user/Banner";
import { useTypingEffect } from "../../hooks/useTypingEffect"; // Import hook
import '../../styles/user/homepage.scss';
import { Button, Carousel, DatePicker, Image } from "antd";
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

const widthInit = 1300
const HomePage = () => {
    const navigate = useNavigate()
    const [homeStayViewHight, setHomeStayViewHight] = useState([]);
    const [advertisements, setAdvertisements] = useState([]);
    const windowWidth = useWidthWindow();


    useEffect(() => {
        getAllAdvertisements()
    }, [])

    const getAllAdvertisements = async () => {
        const res = await advertisementService.getAllAdvertisements()
        console.log(res)
        res && setAdvertisements(res)
    }
    useEffect(() => {
        const getHomeStayViewHight = async () => {
            try {
                let result = await homestayService.getHomeStayViewHight()
                console.log(result)
                result && setHomeStayViewHight(result)
            } catch (error) {
                console.log(error)
            }
        }
        getHomeStayViewHight()
    }, [])

    return (
        <div>
            <Banner listAdvertisement={advertisements.filter(s => s.placement === 1)} />
            <SearchComponent />

            {/* Địa điểm yêu thích */}

            {/* Một số HomeStay nhiều lượt đặt phòng */}
            <div className="w-full flex justify-between h-auto md:h-[widthInit] ">
                {/* Thanh bên hiển thị khi màn hình lớn hơn 768px */}
                {windowWidth > 768 && (
                    <div className="w-[30%] h-full  pl-4">

                        <h1 className="text-2xl text-center font-bold">HuyStay MALL <i className="fa-solid fa-certificate text-yellow-500"></i></h1>
                        <p className="mt-1 text-center font-light" style={{ fontFamily: "Lexend, sans-serif" }}>
                            Tìm đâu cũng có , chỉ có tại HuyStay MALL!
                        </p>

                        <div className="mt-4 flex flex-wrap justify-center gap-4 max-h-[1600px] overflow-y-auto">
                            {
                                advertisements.filter(s => s.placement === 2).map((a, index) =>
                                    <>
                                        <CardAdvertisement index={index} item={a} />

                                    </>
                                )
                            }
                        </div>
                    </div>
                )}

                {/* Nội dung chính */}
                <div className={windowWidth > 768 ? 'w-[69%]' : 'w-full'}>
                    <div className="">
                        <h1 className="text-2xl text-center font-bold">HomeStay được quan tâm nhiều nhất</h1>
                        <p className="mt-2 text-center font-light" style={{ fontFamily: "Lexend, sans-serif" }}>
                            Hơn 1.000+ homestay giá tốt, trải nghiệm chất Việt trong từng hành trình!
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center">
                        {homeStayViewHight.slice(0, windowWidth > 768 ? 12 : 8).map((homestay) => (
                            <CardHomeStay key={homestay.id} data={homestay} />
                        ))}
                    </div>
                    <Button className="flex ml-auto" onClick={() => navigate('/homestay')}>Xem thêm</Button>
                </div>
            </div>
            <Article />
            {/* Địa điểm HomeStay Nổi bật */}
            <div className="text-2xl font-bold text-center mt-10 mb-5 py-5 rounded-2xl" style={{ backgroundColor: '#F5F5F5' }}>
                Những địa HomeStay nổi bật , được đông đảo người dùng yêu thích
            </div>
            <div className="w-full overflow-x-auto whitespace-nowrap">
                <div className="flex space-x-4">
                    {advertisements
                        .filter(s => s.placement === 3)
                        .map((a, index) => (
                            <>
                            <CardAdvertisement  key={index} index={index} item={a} />
                             
                            </>
                        ))
                    }
                </div>
            </div>
        </div >
    );
};

export default memo(HomePage);
