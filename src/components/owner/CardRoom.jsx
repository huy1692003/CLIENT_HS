import React, { memo, useRef, useState } from 'react';
import { Card, Button, Image, Tag, Carousel, Modal, Calendar, Tooltip, Space, message } from 'antd';
import { URL_SERVER } from '../../constant/global';
import CarouselButton from '../shared/CarouselButton';
import { formatPrice } from '../../utils/formatPrice';
import { CalendarOutlined, CloseCircleOutlined, EyeInvisibleOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import roomService from '../../services/roomService';
import { convertTimezoneToVN } from '../../utils/convertDate';

const CardRoom = ({ room, ButtonAction, isAdd = false, isPageOwner = false }) => {
    const [showButtons, setShowButtons] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isOwnerCalendarVisible, setIsOwnerCalendarVisible] = useState(false);
    const carouselRef = useRef(null);
    const [dateSelected, setDateSelected] = useState(null);
    const [selectedHiddenDates, setSelectedHiddenDates] = useState([]);
    
    const getDateStatus = (date) => {
        const currentDate = dayjs(date);
        const year = currentDate.year();
        const month = currentDate.month() + 1;
        const today = dayjs();
        
        // Ẩn ngày trong quá khứ
        if (currentDate.isBefore(today, 'day')) {
            return 'past';
        }
        
        if (!room.roomHiddenDates) return 'available';
        
        // Kiểm tra ngày đã được đặt
        for (const yearData of room.roomHiddenDates) {
            if (yearData.year === year) {
                for (const monthData of yearData.months) {
                    if (monthData.month === month) {
                        if (monthData.hiddenDays.includes(currentDate.date())) {
                            return 'booked';
                        }
                    }
                }
            }
        }
        return 'available';
    };
    
    const onUpdateHiddenDates = (roomId, selectedDates) => {
        console.log(roomId, selectedDates);
    }
    // Hàm ẩn ngày đã được đặt hoặc trong quá khứ
    const disabledDate = (current) => {
        const status = getDateStatus(current);
        return status === 'booked' || status === 'past';
    };


    // Hàm xử lý chọn ngày để ẩn (chỉ cho owner)
    const handleOwnerDateSelect = (date) => {
        const dateString = date.format('YYYY-MM-DD');
        const isAlreadySelected = selectedHiddenDates.includes(dateString);
        
        if (isAlreadySelected) {
            // Bỏ chọn ngày
            setSelectedHiddenDates(prev => prev.filter(d => d !== dateString));
        } else {
            // Chọn ngày
            setSelectedHiddenDates(prev => [...prev, dateString]);
        }
    };

    // Hàm lưu danh sách ngày ẩn
    const handleSaveHiddenDates = async () => {
        if (selectedHiddenDates.length === 0) {
            message.warning('Vui lòng chọn ít nhất một ngày để ẩn');
            return;
        }

        try {
            // Gọi API hoặc callback để lưu danh sách ngày ẩn
            let res = await roomService.addHiddenDates(room.roomId, selectedHiddenDates.map(date => convertTimezoneToVN(date)));
            console.log(res);
            message.success(`Đã lưu ${selectedHiddenDates.length} ngày ẩn thành công`);
            window.location.reload();
        } catch (error) {
            message.error('Có lỗi xảy ra khi lưu danh sách ngày ẩn');
            console.error('Error saving hidden dates:', error);
        }
    };

    
    const CalendarButton = () => (
        <Tooltip title="Xem lịch trống">
            <Button 
                type="primary" 
                icon={<CalendarOutlined />} 
                onClick={() => setIsCalendarVisible(true)}
                size="middle"
                className="font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
                Xem lịch trống
            </Button>
        </Tooltip>
    );

    const OwnerCalendarButton = () => (
        isPageOwner && (
            <Tooltip title="Chọn ngày để ẩn">
                <Button 
                    type="default" 
                    icon={<EyeInvisibleOutlined />} 
                    onClick={() => setIsOwnerCalendarVisible(true)}
                    size="middle"
                    className="font-semibold border-orange-500 text-orange-500 hover:bg-orange-50"
                >
                    Ẩn ngày
                </Button>
            </Tooltip>
        )
    );
    
    return (
        <>
            <Card
                key={room.roomId}
                className="shadow-sm hover:shadow-md transition-shadow duration-300"
                title={<h2 className="text-base md:text-lg font-semibold text-gray-800">{"Phòng: " + room.roomName}</h2>}
                extra={
                    <Space>
                        <CalendarButton />
                        <OwnerCalendarButton />
                        {ButtonAction}
                    </Space>
                }
            >
                <div className="flex flex-col lg:flex-row gap-4">
                    {
                        isAdd ? <Image width={350} height={220}  className="object-cover rounded-xl"  src={URL_SERVER + "images/default_room.jpg"}/> :
                    <div className="w-full lg:w-1/3">
                        <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 w-full overflow-hidden rounded-xl">
                            <div className="carousel-container"
                                onMouseEnter={() => setShowButtons(true)}
                                onMouseLeave={() => setShowButtons(false)}
                            >
                                {showButtons && (
                                    <>
                                        <CarouselButton direction="prev" onClick={() => carouselRef.current.prev()} />
                                        <CarouselButton direction="next" onClick={() => carouselRef.current.next()} />
                                    </>
                                )}
                                
                                <Carousel ref={carouselRef} dots>
                                    {room?.roomImage?.split(',').map((image, index) => (
                                        <div key={index} style={{ borderRadius: 10, width: '100%', height: '100%' }}>
                                            <Image
                                                src={URL_SERVER + image}
                                                alt={`${room.roomName} - ảnh ${index + 1}`}
                                                className="object-cover rounded-xl"
                                                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                                preview={true}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </div>
                    </div>
                    }
                    <div className="w-full lg:w-2/3 ">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 text-xs sm:text-xs md:text-xs">
                            <div className="flex items-center gap-1 md:gap-2">
                                <i className="fas fa-home text-blue-500"></i>
                                <p><span className="font-medium">Loại phòng:</span> {room.roomType}</p>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2">
                                <i className="fas fa-money-bill-wave text-yellow-500"></i>
                                <p><span className="font-medium">Giá/đêm:</span> {formatPrice(room.pricePerNight)}</p>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2">
                                <i className="fas fa-money-bill-wave text-yellow-500"></i>
                                <p><span className="font-medium">Giá từ đêm thứ 2:</span> {formatPrice(room.priceFromSecondNight)}</p>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2">
                                <i className="fas fa-ruler-combined text-green-500"></i>
                                <p><span className="font-medium">Diện tích:</span> {room.roomSize} m²</p>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2">
                                <i className="fas fa-bed text-purple-500"></i>
                                <p><span className="font-medium">Số giường:</span> {room.bedCount}</p>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2">
                                <i className="fas fa-bath text-cyan-500"></i>
                                <p><span className="font-medium">Phòng tắm:</span> {room.bathroomCount}</p>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2">
                                <i className="fas fa-user text-indigo-500"></i>
                                <p><span className="font-medium">Người lớn:</span> {room.maxAdults}</p>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2">
                                <i className="fas fa-child text-pink-500"></i>
                                <p><span className="font-medium">Trẻ em:</span> {room.maxChildren}</p>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2">
                                <i className="fas fa-baby text-orange-500"></i>
                                <p><span className="font-medium">Em bé:</span> {room.maxBaby}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 md:gap-2 lg:col-span-3">
                                <p className="font-medium"><i className="fas fa-tag text-red-500 mr-1"></i>Phụ thu:</p>
                                <div className="flex flex-wrap gap-1">
                                    <Tag color="orange" className="inline-block text-xs">Người lớn: {formatPrice(room.extraFeePerAdult)}</Tag>
                                    <Tag color="orange" className="inline-block text-xs">Trẻ em: {formatPrice(room.extraFeePerChild)}</Tag>
                                    <Tag color="orange" className="inline-block text-xs">Em bé: {formatPrice(room.extraFeePerBaby)}</Tag>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 md:mt-4">
                            <p className="font-medium text-gray-700 mb-1 md:mb-2 text-sm md:text-base">Tiện nghi phòng:</p>
                            <div className="flex flex-wrap gap-1 md:gap-2">
                                {room.hasBalcony && <span className="bg-blue-50 text-blue-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-door-open mr-1"></i>Ban công</span>}
                                {room.hasTv && <span className="bg-green-50 text-green-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-tv mr-1"></i>TV</span>}
                                {room.hasAirConditioner && <span className="bg-purple-50 text-purple-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-wind mr-1"></i>Điều hòa</span>}
                                {room.hasRefrigerator && <span className="bg-cyan-50 text-cyan-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-snowflake mr-1"></i>Tủ lạnh</span>}
                                {room.hasWifi && <span className="bg-yellow-50 text-yellow-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-wifi mr-1"></i>Wifi</span>}
                                {room.hasHotWater && <span className="bg-red-50 text-red-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-hot-tub mr-1"></i>Nước nóng</span>}
                            </div>
                        </div>

                        {room.description && (
                            <div className="mt-3 md:mt-4">
                                <p className="font-medium text-gray-700 mb-1 text-sm md:text-base">Mô tả:</p>
                                <p className="text-gray-600 text-xs sm:text-sm">{room.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
            
            {/* Modal xem lịch trống cho khách */}
            <Modal
                title={
                    <div className="text-base font-semibold p-4 flex justify-between items-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        Lịch trống {room.roomName}
                        <Button 
                            type="text" 
                            icon={<CloseCircleOutlined />} 
                            onClick={() => setIsCalendarVisible(false)}
                            className="float-right text-white"
                        />
                    </div>
                }
                open={isCalendarVisible}
                closable={false}
                onCancel={() => setIsCalendarVisible(false)}
                footer={null}
                width={400}
            >
                <div className="mb-3">
                    <p className="text-sm text-gray-600">
                        Quý khách lưu ý: Các ngày đã được đặt hoặc quá khứ sẽ không hiển thị.
                    </p>
                </div>
                
                <Calendar 
                    fullscreen={false}
                    disabledDate={disabledDate}
                    onSelect={(date) => {
                        console.log('Ngày đã chọn:', date.format('DD/MM/YYYY'));
                        // Xử lý logic đặt phòng ở đây
                    }}
                />
            </Modal>

            {/* Modal chọn ngày ẩn cho owner */}
            <Modal
                title={
                    <div className="text-base font-semibold p-4 flex justify-between items-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        Chọn ngày để ẩn - {room.roomName}
                        <Button 
                            type="text" 
                            icon={<CloseCircleOutlined />} 
                            onClick={() => {
                                setIsOwnerCalendarVisible(false);
                                setSelectedHiddenDates([]);
                            }}
                            className="float-right text-white"
                        />
                    </div>
                }
                open={isOwnerCalendarVisible}
                closable={false}
                onCancel={() => {
                    setIsOwnerCalendarVisible(false);
                    setSelectedHiddenDates([]);
                }}
                footer={
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            Đã chọn: <strong>{selectedHiddenDates.length}</strong> ngày
                        </span>
                        <Space>
                            <Button 
                                onClick={() => {
                                    setIsOwnerCalendarVisible(false);
                                    setSelectedHiddenDates([]);
                                }}
                            >
                                Hủy
                            </Button>
                            <Button 
                                type="primary" 
                                icon={<SaveOutlined />}
                                onClick={handleSaveHiddenDates}
                                disabled={selectedHiddenDates.length === 0}
                                className="bg-orange-500 hover:bg-orange-600"
                            >
                                Lưu ngày ẩn
                            </Button>
                        </Space>
                    </div>
                }
                width={500}
            >
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">
                        Chọn các ngày mà bạn muốn ẩn khỏi khách hàng. Click vào ngày để chọn/bỏ chọn.
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-100 border-2 border-gray-500 rounded"></div>
                            <span>Ngày màu xám đã được đặt</span>
                        </div>
                    </div>
                </div>
                
                <Calendar 
                    fullscreen={false}
                    disabledDate={disabledDate}
                    onSelect={handleOwnerDateSelect}
                />
                
                {selectedHiddenDates.length > 0 && (
                    <div className="mt-3 p-3 bg-orange-50 rounded">
                        <p className="text-sm font-medium text-orange-800 mb-2">Ngày đã chọn để ẩn:</p>
                        <div className="flex flex-wrap gap-1">
                            {selectedHiddenDates.map(dateString => (
                                <Tag 
                                    key={dateString} 
                                    color="orange" 
                                    closable
                                    onClose={() => {
                                        setSelectedHiddenDates(prev => prev.filter(d => d !== dateString));
                                    }}
                                    className="text-xs"
                                >
                                    {dayjs(dateString).format('DD/MM/YYYY')}
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    )
}

export default memo(CardRoom)