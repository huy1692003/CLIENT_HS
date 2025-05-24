import { memo, useEffect, useMemo, useState } from "react";
import { AutoComplete, Button, DatePicker, Input, InputNumber, message, Popover } from "antd";
import dayjs from "dayjs";
import { SearchOutlined, UserOutlined, CalendarOutlined, HomeOutlined, EnvironmentOutlined, CompassOutlined, HeartOutlined } from "@ant-design/icons";
import { useTypingEffect } from "../../hooks/useTypingEffect";
import { useRecoilState } from "recoil";
import { paramSearchHT } from "../../recoil/atom";
import { useNavigate } from "react-router-dom";
import { convertDateTime, convertTimezoneToVN } from "../../utils/convertDate";
import homestayService from "../../services/homestayService";

const placeHolders = ["Nhập địa điểm muốn đến", "Hà Nội", "Hải Phòng", "Hồ Chí Minh", "Đà Nẵng"];

const SearchComponent = ({ title = "Tìm kiếm HomeStay lý tưởng cho chuyến đi của bạn" }) => {
    const placeholder = useTypingEffect(placeHolders, 150, 50, 3000);
    const [formSearch, setFormSearch] = useRecoilState(paramSearchHT);
    const [totalNight, setTotalNight] = useState(1);
    const navigate = useNavigate();
    const [dataAutocomplete, setDataAutoComplete] = useState([]);
    const [guestPopoverVisible, setGuestPopoverVisible] = useState(false);

    // Guest counts state
    const [guestCounts, setGuestCounts] = useState({
        numberAdult: formSearch.numberAdult || 1,
        numberChild: formSearch.numberChild || 0,
        numberBaby: formSearch.numberBaby || 0
    });

    useEffect(() => {
        const getAuto = async () => {
            let res = await homestayService.getAutocompleteLocation(formSearch.location)
            setDataAutoComplete(res)
        }
        formSearch.location && formSearch.location !== '' && getAuto()
        if(!formSearch.location) {
            setDataAutoComplete([])
        }
    }, [formSearch.location])

    const handleSearch = () => {
        if (formSearch.location || (formSearch.dateOut && formSearch.dateIn) || guestCounts.numberAdult || formSearch.name) {
            setFormSearch({
                ...formSearch,
                ...guestCounts,
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
    const handleGuestCountChange = (type, value) => {
        const newCounts = { ...guestCounts, [type]: Math.max(0, value) };
        if (type === 'numberAdult' && value < 1) {
            newCounts.numberAdult = 1; // Minimum 1 adult
        }
        setGuestCounts(newCounts);
        setFormSearch({ ...formSearch, ...newCounts, isCallAPI: false });
    };

    // Total guests calculation
    const totalGuests = guestCounts.numberAdult + guestCounts.numberChild + guestCounts.numberBaby;

    // Guest popover content
    const guestPopoverContent = (
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
                            onClick={() => handleGuestCountChange('numberAdult', guestCounts.numberAdult - 1)}
                            disabled={guestCounts.numberAdult <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <span className="text-base font-medium">−</span>
                        </Button>
                        <span className="w-8 text-center text-base font-semibold text-gray-800">{guestCounts.numberAdult}</span>
                        <Button 
                            size="small" 
                            type="text"
                            onClick={() => handleGuestCountChange('numberAdult', guestCounts.numberAdult + 1)}
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
                            onClick={() => handleGuestCountChange('numberChild', guestCounts.numberChild - 1)}
                            disabled={guestCounts.numberChild <= 0}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <span className="text-base font-medium">−</span>
                        </Button>
                        <span className="w-8 text-center text-base font-semibold text-gray-800">{guestCounts.numberChild}</span>
                        <Button 
                            size="small" 
                            type="text"
                            onClick={() => handleGuestCountChange('numberChild', guestCounts.numberChild + 1)}
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
                            onClick={() => handleGuestCountChange('numberBaby', guestCounts.numberBaby - 1)}
                            disabled={guestCounts.numberBaby <= 0}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <span className="text-base font-medium">−</span>
                        </Button>
                        <span className="w-8 text-center text-base font-semibold text-gray-800">{guestCounts.numberBaby}</span>
                        <Button 
                            size="small" 
                            type="text"
                            onClick={() => handleGuestCountChange('numberBaby', guestCounts.numberBaby + 1)}
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
    );

    return (
        <div className="relative">
            {/* Background with modern gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 rounded-3xl"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 my-8 border border-white/40 shadow-2xl shadow-blue-500/10 hover:shadow-3xl hover:shadow-blue-500/15 transition-all duration-500 mx-auto max-w-7xl">
                
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                        {title}
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">Khám phá hàng ngàn HomeStay tuyệt vời trên khắp Việt Nam  <i className="flex justify-center mt-2 text-blue-500 text-xl">
                        <CompassOutlined className="mr-2" />
                        <HomeOutlined className="mr-2" />
                        <HeartOutlined />
                    </i></p>
                   
                </div>

                {/* Main Search Container */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
                    
                    {/* Desktop Layout - All in one row */}
                    <div className="hidden lg:flex items-end gap-4">
                        
                        {/* Location Input */}
                        <div className="flex-1 min-w-0">
                            <div className="rounded-3xl p-3 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center mb-1">
                                    <EnvironmentOutlined className="text-blue-500 mr-2 text-lg" />
                                    <label className="text-sm font-semibold text-gray-700">Điểm đến</label>
                                </div>
                                <AutoComplete
                                    allowClear
                                    options={dataAutocomplete.map(location => ({ value: location }))}
                                    className="w-full h-full"
                                    placeholder={placeholder}
                                    value={formSearch.location}
                                    onChange={(value) => setFormSearch({ ...formSearch, location: value, isCallAPI: false })}
                                >
                                    <Input 
                                        className="w-full h-10 rounded-lg text-base border-0 bg-white font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20" 
                                    />
                                </AutoComplete>
                            </div>
                        </div>

                        {/* Homestay Name Input */}
                        <div className="flex-3 min-w-0">
                            <div className="bg-white rounded-3xl p-3 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center mb-1">
                                    <HomeOutlined className="text-green-500 mr-2 text-lg" />
                                    <label className="text-sm font-semibold text-gray-700">Tên HomeStay</label>
                                </div>
                                <Input
                                    allowClear
                                    placeholder="Nhập tên homestay..."
                                    className="w-full h-10 rounded-lg text-base border-0 bg-white font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20"
                                    value={formSearch.name}
                                    onChange={(e) => setFormSearch({ ...formSearch, name: e.target.value, isCallAPI: false })}
                                />
                            </div>
                        </div>

                        {/* Date Range Container */}
                        <div className="flex-1 min-w-0">
                            <div className="bg-white rounded-3xl p-3 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center mb-1">
                                    <CalendarOutlined className="text-purple-500 mr-2 text-lg" />
                                    <label className="text-sm font-semibold text-gray-700">Thời gian</label>
                                </div>
                                <div className="flex gap-2">
                                    <DatePicker
                                        className="flex-1 h-10 rounded-lg text-base border-0 bg-white hover:bg-white transition-all duration-200"
                                        placeholder="Ngày đến"
                                        value={formSearch.dateIn}
                                        onChange={(date) => setFormSearch({ ...formSearch, dateIn: date, isCallAPI: false })}
                                        format={"DD/MM"}
                                        disabledDate={(current) => current && current <= dayjs().startOf('day')}
                                    />
                                    <DatePicker
                                        className="flex-1 h-10 rounded-lg text-base border-0 bg-white hover:bg-white transition-all duration-200"
                                        placeholder="Ngày về"
                                        value={formSearch.dateOut}
                                        onChange={(date) => setFormSearch({ ...formSearch, dateOut: date, isCallAPI: false })}
                                        format={"DD/MM"}
                                        disabledDate={(current) => current && current <= dayjs().startOf('day')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Guest Count */}
                        <div className="flex-1 min-w-0">
                            <div className="bg-white rounded-3xl p-3 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300">
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
                                        className="w-full h-10 rounded-lg text-left text-base flex items-center justify-between border-0 bg-white hover:bg-white font-medium transition-all duration-200"
                                        onClick={() => setGuestPopoverVisible(true)}
                                    >
                                        <span className="text-gray-700 truncate">
                                            {totalGuests} khách
                                            {(guestCounts.numberChild > 0 || guestCounts.numberBaby > 0) && (
                                                <span className="text-sm text-gray-500 ml-2">
                                                    ({guestCounts.numberAdult}
                                                    {guestCounts.numberChild > 0 && `, ${guestCounts.numberChild}TE`}
                                                    {guestCounts.numberBaby > 0 && `, ${guestCounts.numberBaby}EB`})
                                                </span>
                                            )}
                                        </span>
                                    </Button>
                                </Popover>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="flex-shrink-0">
                            <Button
                                className="h-[72px] px-6 rounded-3xl text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 border-0 hover:bg-blue-700 transform hover:scale-105"
                                type="primary"
                                icon={<SearchOutlined className="text-lg mr-2" />}
                                onClick={handleSearch}
                            >
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>

                    {/* Mobile & Tablet Layout */}
                    <div className="lg:hidden space-y-3">
                        
                        {/* Row 1: Location + Homestay Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Location */}
                            <div className="bg-white rounded-3xl p-3 border border-gray-200">
                                <div className="flex items-center mb-1">
                                    <EnvironmentOutlined className="text-blue-500 mr-2" />
                                    <label className="text-sm font-semibold text-gray-700">Điểm đến</label>
                                </div>
                                <AutoComplete
                                    allowClear
                                    options={dataAutocomplete.map(location => ({ value: location }))}
                                    className="w-full"
                                    placeholder={placeholder}
                                    value={formSearch.location}
                                    onChange={(value) => setFormSearch({ ...formSearch, location: value, isCallAPI: false })}
                                >
                                    <Input 
                                        className="w-full h-10 rounded-lg border-0 bg-white font-medium" 
                                    />
                                </AutoComplete>
                            </div>

                            {/* Homestay Name */}
                            <div className="bg-white rounded-3xl p-3 border border-gray-200">
                                <div className="flex items-center mb-1">
                                    <HomeOutlined className="text-green-500 mr-2" />
                                    <label className="text-sm font-semibold text-gray-700">Tên HomeStay</label>
                                </div>
                                <Input
                                    allowClear
                                    placeholder="Nhập tên homestay..."
                                    className="w-full h-10 rounded-lg border-0 bg-white font-medium"
                                    value={formSearch.name}
                                    onChange={(e) => setFormSearch({ ...formSearch, name: e.target.value, isCallAPI: false })}
                                />
                            </div>
                        </div>

                        {/* Row 2: Date Range */}
                        <div className="bg-white rounded-3xl p-3 border border-gray-200">
                            <div className="flex items-center mb-2">
                                <CalendarOutlined className="text-purple-500 mr-2" />
                                <label className="text-sm font-semibold text-gray-700">Thời gian lưu trú</label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <DatePicker
                                    className="w-full h-10 rounded-lg border-0 bg-white"
                                    placeholder="Ngày đến"
                                    value={formSearch.dateIn}
                                    onChange={(date) => setFormSearch({ ...formSearch, dateIn: date, isCallAPI: false })}
                                    format={"DD/MM"}
                                    disabledDate={(current) => current && current <= dayjs().startOf('day')}
                                />
                                <DatePicker
                                    className="w-full h-10 rounded-lg border-0 bg-white"
                                    placeholder="Ngày về"
                                    value={formSearch.dateOut}
                                    onChange={(date) => setFormSearch({ ...formSearch, dateOut: date, isCallAPI: false })}
                                    format={"DD/MM"}
                                    disabledDate={(current) => current && current <= dayjs().startOf('day')}
                                />
                            </div>
                        </div>

                        {/* Row 3: Guest Count + Search Button */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                            <div className="md:col-span-2 bg-white rounded-3xl p-3 border border-gray-200">
                                <div className="flex items-center mb-1">
                                    <UserOutlined className="text-orange-500 mr-2" />
                                    <label className="text-sm font-semibold text-gray-700">Số khách</label>
                                </div>
                                <Popover
                                    content={guestPopoverContent}
                                    title={<span className="font-semibold">Chọn số lượng khách</span>}
                                    trigger="click"
                                    open={guestPopoverVisible}
                                    onOpenChange={setGuestPopoverVisible}
                                    placement="bottomLeft"
                                >
                                    <Button 
                                        className="w-full h-10 rounded-lg text-left flex items-center justify-between border-0 bg-white font-medium"
                                        onClick={() => setGuestPopoverVisible(true)}
                                    >
                                        <span className="text-gray-700 truncate">
                                            {totalGuests} khách
                                            {(guestCounts.numberChild > 0 || guestCounts.numberBaby > 0) && (
                                                <span className="text-sm text-gray-500 ml-2 hidden sm:inline">
                                                    ({guestCounts.numberAdult}
                                                    {guestCounts.numberChild > 0 && `, ${guestCounts.numberChild}TE`}
                                                    {guestCounts.numberBaby > 0 && `, ${guestCounts.numberBaby}EB`})
                                                </span>
                                            )}
                                        </span>
                                    </Button>
                                </Popover>
                            </div>

                            <Button
                                className="h-full inline-block md:h-14 px-6 rounded-3xl text-base font-bold shadow-lg bg-blue-600 border-0 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
                                type="primary"
                                icon={<SearchOutlined className="text-lg" />}
                                onClick={handleSearch}
                                block
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