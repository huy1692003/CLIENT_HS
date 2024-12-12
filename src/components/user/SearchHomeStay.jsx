import { memo, useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Input, InputNumber, message } from "antd";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import { useTypingEffect } from "../../hooks/useTypingEffect";
import { useRecoilState } from "recoil";
import { paramSearchHT } from "../../recoil/atom";
import { useNavigate } from "react-router-dom";
import { convertDateTime } from "../../utils/convertDate";

const placeHolders = ["Nhập địa điểm muốn đến", "Hà Nội", "Hải Phòng", "Hồ Chí Minh", "Đà Nẵng"];

const SearchComponent = ({ title = "Bạn muốn tìm địa điểm HomeStay ở đâu ?" }) => {
    const placeholder = useTypingEffect(placeHolders, 150, 50, 3000);
    const [formSearch, setFormSearch] = useRecoilState(paramSearchHT);
    const [totalNight, setTotalNight] = useState(1)
    const navigate = useNavigate()

    const handleSearch = () => {
        if (formSearch.location || (formSearch.dateOut && formSearch.dateIn) || formSearch.numberofGuest) {
            setFormSearch(
                { ...formSearch, 
                    dateIn:convertDateTime(formSearch.dateIn),
                    dateOut:convertDateTime(formSearch.dateOut),
                    isCallAPI: true }
            )
            navigate('/result-homestay-search?location=' + formSearch.location)
        } else {
            message.error("Vui lòng nhập thông tin để tìm kiếm", 5)
        }
    };
    useEffect(() => {
        if (formSearch.dateIn && formSearch.dateOut) {
            const nights = formSearch.dateOut.diff(formSearch.dateIn, 'day');
            setTotalNight(nights)
        } else {
            setTotalNight(0)
        }
    }, [formSearch.dateIn, formSearch.dateOut])

    return (
        <div style={{ borderRadius: '10px' }} className="search bg-white p-4">
            <h1 className="text-center text-xl md:text-2xl lg:text-3xl">{title}</h1>

            <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5">
                {/* Location Input */}
                <div className="w-full md:w-auto">
                    <div>
                        <span className="mb-1 flex text-lg">Điểm đến</span>
                        <div className="flex items-center border border-gray-300 rounded-xl px-3">
                            <input
                                type="text"
                                className="w-full md:w-[240px] p-3 rounded-l outline-none text-lg"
                                placeholder={placeholder}
                                value={formSearch.location}
                                onChange={(e) => setFormSearch({ ...formSearch, location: e.target.value, isCallAPI: false })}
                            />
                            {<i className="fa-solid fa-xmark cursor-pointer p-3 hover:bg-gray-100 text-lg border-l border-gray-300 flex items-center justify-center"
                                onClick={() => setFormSearch({ ...formSearch, location: "", isCallAPI: false })}></i>}
                        </div>
                    </div>
                </div>

                {/* Check-in Date */}
                <div className="w-full md:w-auto">
                    <span className="block mb-1 text-lg">Ngày đến</span>
                    <DatePicker
                        className="w-full md:w-[180px] text-lg"
                        placeholder="Chọn ngày"
                        value={formSearch.dateIn}
                        onChange={(date) => setFormSearch({ ...formSearch, dateIn: date, isCallAPI: false })}
                        format={"DD/MM/YYYY"}
                        size="large"
                    />
                </div>

                {/* Night Count */}
                <div className="hidden md:flex items-center justify-center"
                    title={`Số đêm thuê ${totalNight}`}>
                    <div className="flex justify-center items-center border-2 rounded-full h-[80px] w-[84px] text-2xl">
                        <span>{totalNight}</span>
                        <i className="fa-regular fa-moon text-yellow-400 ml-1"></i>
                    </div>
                </div>

                {/* Check-out Date */}
                <div className="w-full md:w-auto">
                    <span className="block mb-1 text-lg">Ngày về</span>
                    <DatePicker
                        className="w-full md:w-[180px] text-lg"
                        placeholder="Chọn ngày"
                        value={formSearch.dateOut}
                        onChange={(date) => setFormSearch({ ...formSearch, dateOut: date, isCallAPI: false })}
                        format={"DD/MM/YYYY"}
                        size="large"
                    />
                </div>

                {/* Guest Count */}
                <div className="w-full md:w-auto">
                    <span className="block mb-1 text-lg">Số người</span>
                    <InputNumber
                        className="w-full md:w-[150px] text-lg"
                        min={0}
                        value={formSearch.numberofGuest}
                        placeholder="Chọn số người"
                        onChange={(vl) => {
                            
                            setFormSearch({ ...formSearch, numberofGuest: vl, isCallAPI: false })
                        }}
                        size="large"
                    />
                </div>

                {/* Search Button */}
                <Button
                    className="w-full md:w-[160px] h-[70px] mt-4 md:mt-0 rounded-full font-semibold text-lg"
                    type="primary"
                    icon={<SearchOutlined className="text-2xl" />}
                    onClick={handleSearch}
                >
                    Tìm ngay
                </Button>
            </div>
        </div>
    );
};

export default memo(SearchComponent);
