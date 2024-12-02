import { memo, useEffect, useState } from "react";
import  Banner  from "../../components/user/Banner";
import { useTypingEffect } from "../../hooks/useTypingEffect"; // Import hook
import '../../styles/user/homepage.scss';
import { Button, DatePicker, Image } from "antd";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import SearchComponent from "../../components/user/SearchHomeStay";
import Article from "./Article";
import CardHomeStay from "../../components/user/CardHomeStay";
import homestayService from "../../services/homestayService";


 const HomePage = () => {
    const [homeStayViewHight, setHomeStayViewHight] = useState([])

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
            <Banner />
            <SearchComponent />


            {/* Địa điểm yêu thích */}
            <div style={{ backgroundColor: "#F5F5F5", padding: "20px 0px", borderRadius: 15 }}>
                <div className="location-favourite">
                    <h1 className="text-xl md:text-2xl lg:text-3xl text-center font-bold">Điểm Đến Yêu Thích</h1>
                    <p className="text-center mt-2 font-light text-sm md:text-base" style={{ fontFamily: "Lexend, sans-serif" }}>Khám phá, lưu trú, tận hưởng – HuyStay đồng hành cùng bạn!</p>
                    
                    <div className="flex overflow-x-auto no-scrollbar px-4 py-5">
                        <div className="flex gap-4 md:gap-6 lg:gap-10">
                            <div className="w-[150px] md:w-[180px] lg:w-[200px] flex-shrink-0">
                                <Image preview={false} className="rounded-full w-full" src="https://gostay.vn/assets/images/location/moc-chau.jpg" />
                                <p className="text-center font-bold text-base md:text-lg lg:text-xl mt-2">Mộc Châu</p>
                            </div>
                            
                            <div className="w-[150px] md:w-[180px] lg:w-[200px] flex-shrink-0">
                                <Image preview={false} className="rounded-full w-full" src="https://gostay.vn/assets/images/location/hue.jpg" />
                                <p className="text-center font-bold text-base md:text-lg lg:text-xl mt-2">Huế</p>
                            </div>
                            
                            <div className="w-[150px] md:w-[180px] lg:w-[200px] flex-shrink-0">
                                <Image preview={false} className="rounded-full w-full" src="https://gostay.vn/assets/images/location/phu-quoc.jpg" />
                                <p className="text-center font-bold text-base md:text-lg lg:text-xl mt-2">Phú Quốc</p>
                            </div>
                            
                            <div className="w-[150px] md:w-[180px] lg:w-[200px] flex-shrink-0">
                                <Image preview={false} className="rounded-full w-full" src="https://gostay.vn/assets/images/location/da-nang.jpg" />
                                <p className="text-center font-bold text-base md:text-lg lg:text-xl mt-2">Đà Nẵng</p>
                            </div>
                            
                            <div className="w-[150px] md:w-[180px] lg:w-[200px] flex-shrink-0">
                                <Image preview={false} className="rounded-full w-full" src="https://gostay.vn/assets/images/location/thanh-hoa.jpg" />
                                <p className="text-center font-bold text-base md:text-lg lg:text-xl mt-2">Thanh Hóa</p>
                            </div>
                            
                            <div className="w-[150px] md:w-[180px] lg:w-[200px] flex-shrink-0">
                                <Image preview={false} className="rounded-full w-full" src="https://gostay.vn/assets/images/location/sapa.jpg" />
                                <p className="text-center font-bold text-base md:text-lg lg:text-xl mt-2">Sapa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Một số HomeStay nhiều lượt đặt phòng */}
            <div>
                <div className="location-favourite">
                    <h1 className="text-2xl text-center font-bold">HomeStay được quan tâm nhiều nhất</h1>
                    <p className=" mt-2 text-center font-light" style={{ fontFamily: "Lexend, sans-serif" }}>Hơn 1.000+ homestay giá tốt, trải nghiệm chất Việt trong từng hành trình!</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 justify-items-center">
                    {homeStayViewHight.map((homestay) => (
                        <>
                        <CardHomeStay key={homestay.id} data={homestay} />
                        <CardHomeStay key={homestay.id} data={homestay} />
                        <CardHomeStay key={homestay.id} data={homestay} />
                        <CardHomeStay key={homestay.id} data={homestay} />
                        </>
                    ))}
                </div>

            </div>
            {/* <div>
                <div className="location-favourite">
                    <h1 className="text-2xl  font-bold">HomeStay với giá ưu đãi nhất </h1>
                    <p className=" mt-2 font-light" style={{ fontFamily: "Lexend, sans-serif" }}>Hơn 1.000+ homestay giá tốt, trải nghiệm chất Việt trong từng hành trình!</p>
                </div>

                <div className="box-list-homestay flex flex-wrap p-5 gap-10 gap-y-6 pl-20">
                    {homeStayViewHight.map((homestay) => (
                        <CardHomeStay data={homestay} />
                    ))}
                </div>

            </div> */}
            <Article />

        </div>
    );
};
export default memo(HomePage)
