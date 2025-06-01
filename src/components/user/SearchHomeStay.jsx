import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { AutoComplete, Button, DatePicker, Input, InputNumber, message, Popover } from "antd";
import dayjs from "dayjs";
import { SearchOutlined, UserOutlined, CalendarOutlined, HomeOutlined, EnvironmentOutlined, CompassOutlined, HeartOutlined } from "@ant-design/icons";
import { useTypingEffect } from "../../hooks/useTypingEffect";
import { useRecoilState } from "recoil";
import { paramSearchHT } from "../../recoil/atom";
import { useNavigate } from "react-router-dom";
import homestayService from "../../services/homestayService";
import { useDebouncedValue } from "../../hooks/useDebouce";
const placeHolders = ["Nhập địa điểm muốn đến", "Hà Nội", "Hải Phòng", "Hồ Chí Minh", "Đà Nẵng"];

const SearchComponent = ({ title = "Tìm kiếm Homestay lý tưởng cho chuyến đi của bạn" }) => {
    const [formSearch, setFormSearch] = useRecoilState(paramSearchHT);
    const [totalNight, setTotalNight] = useState(1);
    const navigate = useNavigate();
    const [dataAutocomplete, setDataAutoComplete] = useState([]);
    const [guestPopoverVisible, setGuestPopoverVisible] = useState(false);
    const debouncedQuery = useDebouncedValue(formSearch.location, 900);

   

    useEffect(() => {
        const getAuto = async () => {
            let res = await homestayService.getAutocompleteLocation(debouncedQuery)
            setDataAutoComplete(res)
        }
        debouncedQuery && debouncedQuery !== '' && getAuto()
        if(!debouncedQuery) {
            setDataAutoComplete([])
        }
    }, [debouncedQuery])

    const handleSearch = () => {
        if (formSearch.location || (formSearch.dateOut && formSearch.dateIn) || formSearch.numberAdults || formSearch.name) {
            setFormSearch({
                ...formSearch,
                dateIn: formSearch.dateIn || null,
                dateOut: formSearch.dateOut || null,
                isCallAPI: true
            })

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

    // Handle guest count changes
    const handleGuestCountChange = useCallback((type, value) => {
        const newCounts = { ...formSearch, [type]: Math.max(0, value) };
        if (type === 'numberAdults' && value < 1) {
            newCounts.numberAdults = 1; // Minimum 1 adult
        }
        setFormSearch({ ...formSearch, ...newCounts, isCallAPI: false });
    }, [formSearch.numberAdults, formSearch.numberChildren, formSearch.numberBaby, setFormSearch]);

    // Total guests calculation
    const totalGuests = formSearch.numberAdults + formSearch.numberChildren + formSearch.numberBaby;

    
    // Guest popover content
    const guestPopoverContent = useMemo(() => (
        <div className="w-80 p-4">
            <div className="space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">Người lớn</div>
                        <div className="text-xs text-gray-500 mt-0.5">Từ 13 tuổi trở lên</div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button 
                            size="small" 
                            type="text"
                            onClick={() => handleGuestCountChange('numberAdults', formSearch.numberAdults - 1)}
                            disabled={formSearch.numberAdults <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <span className="text-base font-medium">−</span>
                        </Button>
                        <span className="w-8 text-center text-base font-semibold text-gray-800">{formSearch.numberAdults}</span>
                        <Button 
                            size="small" 
                            type="text"
                            onClick={() => handleGuestCountChange('numberAdults', formSearch.numberAdults + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-all duration-200"
                        >
                            <span className="text-base font-medium">+</span>
                        </Button>
                    </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">Trẻ em</div>
                        <div className="text-xs text-gray-500 mt-0.5">Từ 2-12 tuổi</div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button 
                            size="small" 
                            type="text"
                            onClick={() => handleGuestCountChange('numberChildren', formSearch.numberChildren - 1)}
                            disabled={formSearch.numberChildren <= 0}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <span className="text-base font-medium">−</span>
                        </Button>
                        <span className="w-8 text-center text-base font-semibold text-gray-800">{formSearch.numberChildren}</span>
                        <Button 
                            size="small" 
                            type="text"
                            onClick={() => handleGuestCountChange('numberChildren', formSearch.numberChildren + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-all duration-200"
                        >
                            <span className="text-base font-medium">+</span>
                        </Button>
                    </div>
                </div>

                {/* Babies */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">Em bé</div>
                        <div className="text-xs text-gray-500 mt-0.5">Dưới 2 tuổi</div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button 
                            size="small" 
                            type="text"
                            onClick={() => handleGuestCountChange('numberBaby', formSearch.numberBaby - 1)}
                            disabled={formSearch.numberBaby <= 0}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <span className="text-base font-medium">−</span>
                        </Button>
                        <span className="w-8 text-center text-base font-semibold text-gray-800">{formSearch.numberBaby}</span>
                        <Button 
                            size="small" 
                            type="text"
                            onClick={() => handleGuestCountChange('numberBaby', formSearch.numberBaby + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-all duration-200"
                        >
                            <span className="text-base font-medium">+</span>
                        </Button>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
                <Button 
                    type="primary" 
                    block 
                    size="middle"
                    onClick={() => setGuestPopoverVisible(false)}
                    className="rounded-3xl h-10 bg-gradient-to-r from-blue-500 to-indigo-600 border-0 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    Xác nhận
                </Button>
            </div>
        </div>
    ),[formSearch.numberAdults, formSearch.numberChildren, formSearch.numberBaby, handleGuestCountChange]);

    return (
        <div className="relative">
            {/* Background with modern gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 rounded-3xl"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-5 my-5 border border-white/40 shadow-2xl shadow-blue-500/10 hover:shadow-3xl hover:shadow-blue-500/15 transition-all duration-500 mx-auto max-w-7xl">
                
                {/* Title */}
                <div className="text-center mb-5 lg:mb-5">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                        {title}
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">Khám phá hàng ngàn Homestay tuyệt vời trên khắp Việt Nam  <i className="flex justify-center mt-2 text-blue-500 text-xl">
                        <CompassOutlined className="mr-2" />
                        <HomeOutlined className="mr-2" />
                        <HeartOutlined /> 
                    </i></p>
                   
                </div>

                {/* Main Search Container */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100">
                    
                    {/* Responsive Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-4 items-end">
                        
                        {/* Location Input */}
                        <div className="sm:col-span-1 lg:col-span-1 xl:col-span-1 h-full">
                            <div className="rounded-3xl p-3 border-2 border-gray-200 h-full hover:border-blue-300 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center mb-1">
                                    <EnvironmentOutlined className="text-blue-500 mr-2 text-lg" />
                                    <label className="text-sm font-semibold text-gray-700">Điểm đến</label>
                                </div>
                                <AutoComplete
                                    allowClear
                                    options={dataAutocomplete.map(location => ({ value: location }))}
                                    className="w-full   placeholder:text-xs"
                                    placeholder="Tìm kiếm điểm đến"
                                    value={formSearch.location}
                                    onChange={(value) => setFormSearch({ ...formSearch, location: value, isCallAPI: false })}
                                >
                                    <Input 
                                        className="w-full h-10 rounded-lg border-0 bg-white placeholder:text-gray-400 focus:ring-0 focus:ring-blue-500/20" 
                                        
                                    />
                                </AutoComplete>
                            </div>
                        </div>

                        {/* Homestay Name Input */}
                        <div className="sm:col-span-1 lg:col-span-1 xl:col-span-1">
                            <div className="bg-white rounded-3xl p-3 border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center mb-1">
                                    <HomeOutlined className="text-green-500 mr-2 text-lg" />
                                    <label className="text-sm font-semibold text-gray-700">Tên HomeStay</label>
                                </div>
                                <Input
                                    allowClear
                                    className="w-full h-10 rounded-lg border-0 bg-white placeholder:text-gray-400 focus:ring-0 focus:ring-green-500/20"
                                    placeholder="Tìm kiếm ngay"
                                    value={formSearch.name}
                                    onChange={(e) => setFormSearch({ ...formSearch, name: e.target.value, isCallAPI: false })}
                                />
                            </div>
                        </div>

                        {/* Date Range Container */}
                        <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
                            <div className="bg-white rounded-3xl p-3 border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center mb-1">
                                    <CalendarOutlined className="text-purple-500 mr-2 text-lg" />
                                    <label className="text-sm font-semibold text-gray-700">Thời gian</label>
                                </div>
                                <div className="flex ">
                                    <DatePicker
                                        className="flex-1 h-10 rounded-lg border-0 bg-white hover:bg-white transition-all duration-200"
                                        placeholder="Ngày đến"
                                        value={formSearch.dateIn}
                                        onChange={(date) => setFormSearch({ ...formSearch, dateIn: date, isCallAPI: false })}
                                        format={"DD/MM"}
                                        disabledDate={(current) => current && current <= dayjs().startOf('day')}
                                        style={{ fontSize: '16px', fontWeight: '500' }}
                                    />
                                    <div className="h-8 w-[2px] bg-gray-200 mx-2"></div>
                                    <DatePicker
                                        className="flex-1 h-10 rounded-lg border-0 bg-white hover:bg-white transition-all duration-200"
                                        placeholder="Ngày về"
                                        value={formSearch.dateOut}
                                        onChange={(date) => setFormSearch({ ...formSearch, dateOut: date, isCallAPI: false })}
                                        format={"DD/MM"}
                                        disabledDate={(current) => current && current <= dayjs().startOf('day')}
                                        style={{ fontSize: '16px', fontWeight: '500' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Guest Count */}
                        <div className="sm:col-span-1 lg:col-span-1 xl:col-span-1">
                            <div className="bg-white rounded-3xl p-3 border-2 border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center mb-1">
                                    <UserOutlined className="text-orange-500 mr-2 text-lg" />
                                    <label className="text-sm font-semibold text-gray-700">Số khách</label>
                                </div>
                                <Popover
                                    content={guestPopoverContent}
                                    title={<span className="text-base font-semibold">Chọn số lượng khách</span>}
                                    trigger="click"
                                    open={guestPopoverVisible}
                                    onOpenChange={setGuestPopoverVisible}
                                    placement="bottomLeft"
                                    overlayClassName="guest-popover"
                                >
                                    <Button 
                                        className="w-full h-10 rounded-lg text-left flex items-center justify-between border-0 bg-white hover:bg-white transition-all duration-200"
                                        style={{ fontSize: '16px', fontWeight: '500' }}
                                        onClick={() => setGuestPopoverVisible(true)}
                                    >
                                        <span className="text-gray-700 truncate">
                                            {totalGuests} khách
                                        </span>
                                    </Button>
                                </Popover>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1 flex justify-center lg:h-full items-center lg:flex lg:items-center lg:text-center lg:justify-center">
                            <Button
                                className="h-[72px] px-6 rounded-3xl text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 border-0 hover:bg-blue-700 transform hover:scale-105 w-full sm:w-auto"
                                type="primary"
                                icon={<SearchOutlined className="text-lg mr-2" />}
                                onClick={handleSearch}
                            >
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </div>
                    

                {/* Night Count Display */}
                {totalNight > 0 && (
                    <div className="mt-4 text-center">
                        <div className="inline-flex items-center bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md">
                            <CalendarOutlined className="mr-2" />
                            <span>{totalNight} đêm lưu trú</span>
                            <span className="ml-2">🌙</span>
                        </div>
                    </div>
                )}
            </div>
            
            
        </div>
    );
};

export default memo(SearchComponent);