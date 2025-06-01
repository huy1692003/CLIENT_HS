import { Drawer, Button, Slider, InputNumber, Radio, Space, Row, Col, Checkbox, Select, Rate, DatePicker } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { memo, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { initParamseach, paramSearchHT } from '../../recoil/atom';
import amenitiesService from '../../services/amenitiesService';
import dayjs from 'dayjs';
import roomService from '../../services/roomService';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FilterSide = ({ showSideFilter, setShowSideFilter, refeshData, setPaginate, priceRange, setPriceRange }) => {
    const [searchParam, setSearchParams] = useRecoilState(paramSearchHT);
    const [amenities, setAmenities] = useState([]);
    const [listTypeRoom, setListTypeRoom] = useState([]);


    useEffect(() => {
        const getDataAmenities = async () => {
            let res = await amenitiesService.getAll();
            setAmenities(res);
        };
        getDataAmenities();
        const getListTypeRoom = async () => {
            let res = await roomService.getListTypeRoom();
            setListTypeRoom(res);
        };
        getListTypeRoom();
    }, []);

    useEffect(() => {
        if (priceRange.length == 2 && (priceRange[0] !== 0 || priceRange[1] !== 20000000)) {
            setSearchParams((prev) => ({ ...prev, priceRange: priceRange[0] + "-" + priceRange[1], isCallAPI: false }));
        } else {
            setSearchParams((prev) => ({ ...prev, priceRange: null, isCallAPI: false }));
        }
    }, [priceRange]);

    const handleAmenityChange = (selectedValues) => {
        const updatedAmenities = selectedValues.filter(id => Number.isInteger(id));
        setSearchParams((prev) => ({
            ...prev,
            amenities: updatedAmenities,
            isCallAPI: false,
        }));
    };

    const handleDateChange = (dates) => {
        setSearchParams((prev) => ({
            ...prev,
            dateIn: dates ? dates[0] : null,
            dateOut: dates ? dates[1] : null,
            isCallAPI: false,
        }));
    };

    const handleBooleanFilter = (field, value) => {
        setSearchParams((prev) => ({
            ...prev,
            [field]: value,
            isCallAPI: false,
        }));
    };

    const handleNumberFilter = (field, value) => {
        setSearchParams((prev) => ({
            ...prev,
            [field]: value,
            isCallAPI: false,
        }));
    };

    const clearAllFilters = () => {
        setPaginate(prev => ({ ...prev, page: 1 }));
        setPriceRange([0, 20000000]);
        setSearchParams(initParamseach);
        refeshData(paramSearchHT);
        setShowSideFilter(false);
    };

    const applyFilters = () => {
        setPaginate(prev => ({ ...prev, page: 1 }));
        
        setSearchParams({ ...searchParam, isCallAPI: true });
        setShowSideFilter(false);
    };

    return (
        <Drawer
            size={"large"}
            closeIcon={<CloseCircleOutlined className="text-xl p-5" />}
            title={<h3 className="text-3xl font-bold text-center"><i className="fas fa-filter mr-2"></i>Bộ Lọc</h3>}
            onClose={() => setShowSideFilter(false)}
            open={showSideFilter}
            footer={
                <div className="flex justify-between mb-4 mt-2">
                    <Button 
                        className="text-xl font-semibold py-5"
                        onClick={clearAllFilters}
                    >
                        <i className="fas fa-eraser mr-2"></i>Xóa bộ lọc
                    </Button>
                    <Button
                        type="primary"
                        className="text-xl font-semibold py-5 bg-gray-800 text-white"
                        onClick={applyFilters}
                    >
                        <i className="fas fa-search mr-2"></i>Tìm kiếm
                    </Button>
                </div>
            }
        >
            {/* Ngày nhận - trả phòng */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>Thời gian lưu trú
                </h4>
                <RangePicker
                    size="large"
                    style={{ width: '100%' }}
                    placeholder={['Ngày nhận phòng', 'Ngày trả phòng']}
                    value={searchParam.dateIn && searchParam.dateOut ? [dayjs(searchParam.dateIn), dayjs(searchParam.dateOut)] : null}
                    onChange={handleDateChange}
                    format="DD/MM/YYYY"
                />
            </div>

            {/* Số lượng khách */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-users mr-2 text-green-600"></i>Số lượng khách
                </h4>
                <Row gutter={16}>
                    <Col span={8}>
                        <div className="text-center">
                            <i className="fas fa-user text-xl text-blue-500 mb-2"></i>
                            <p className="text-lg font-semibold mb-2">Người lớn</p>
                            <InputNumber
                                min={1}
                                max={20}
                                value={searchParam.numberAdults}
                                onChange={(value) => handleNumberFilter('numberAdults', value)}
                                style={{ width: "100%" }}
                                size="large"
                            />
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="text-center">
                            <i className="fas fa-child text-xl text-orange-500 mb-2"></i>
                            <p className="text-lg font-semibold mb-2">Trẻ em</p>
                            <InputNumber
                                min={0}
                                max={10}
                                value={searchParam.numberChildren}
                                onChange={(value) => handleNumberFilter('numberChildren', value)}
                                style={{ width: "100%" }}
                                size="large"
                            />
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="text-center">
                            <i className="fas fa-baby text-xl text-pink-500 mb-2"></i>
                            <p className="text-lg font-semibold mb-2">Em bé</p>
                            <InputNumber
                                min={0}
                                max={5}
                                value={searchParam.numberBaby}
                                onChange={(value) => handleNumberFilter('numberBaby', value)}
                                style={{ width: "100%" }}
                                size="large"
                            />
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Khoảng giá */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-money-bill-wave mr-2 text-green-600"></i>Khoảng giá
                </h4>
                <Slider
                    range={true}
                    min={0}
                    tooltip={{ open: false }}
                    marks
                    max={20000000}
                    value={priceRange}
                    onChange={(value) => setPriceRange(value)}
                    step={50000}
                    className="text-xl"
                />
                <Row gutter={16} style={{ marginTop: '16px' }}>
                    <Col span={12}>
                        <InputNumber
                            min={0}
                            max={20000000}
                            formatter={(value) =>
                                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                            }
                            parser={(value) => {
                                return value ? parseInt(value.replace(/\$\s?|(,*)/g, ''), 10) : 0;
                            }}
                            value={priceRange[0]}
                            onChange={(value) => setPriceRange([value, priceRange[1]])}
                            style={{ width: "100%" }}
                            addonAfter={<span className="font-bold text-gray-700">VNĐ</span>}
                            size={"large"}
                            className="text-lg font-semibold"
                        />
                    </Col>
                    <Col span={12}>
                        <InputNumber
                            className="text-lg font-semibold"
                            min={0}
                            formatter={(value) =>
                                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                            }
                            parser={(value) => {
                                return value ? parseInt(value.replace(/\$\s?|(,*)/g, ''), 10) : 0;
                            }}
                            size={"large"}
                            max={20000000}
                            value={priceRange[1]}
                            onChange={(value) => setPriceRange([priceRange[0], value])}
                            style={{ width: "100%" }}
                            addonAfter={<span className="font-bold text-gray-700">VNĐ</span>}
                        />
                    </Col>
                </Row>
            </div>

            {/* Loại HomeStay */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-home mr-2 text-purple-600"></i>Loại phòng
                </h4>
                <Select
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Chọn loại phòng"
                    value={searchParam.homeStayType}
                    onChange={(value) => handleNumberFilter('homeStayType', value)}
                    allowClear
                >
                    {listTypeRoom.map((item) => (
                        <Option value={item} key={item}>
                            <i className="fas fa-building mr-2"></i>{item}
                        </Option>
                    ))}
                    
                </Select>
            </div>

           

            {/* Phòng tắm */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-bath mr-2 text-cyan-600"></i>Phòng tắm
                </h4>
                <Radio.Group
                    size="large"
                    buttonStyle="solid"
                    onChange={(e) => handleNumberFilter('bathroomCount', e.target.value)}
                    value={searchParam.bathroomCount}
                >
                    <Space direction="horizontal" wrap>
                        <Radio.Button className="text-lg" value={null}>Bất kỳ</Radio.Button>
                        {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                            <Radio.Button className="text-lg" key={val} value={val}>
                                {val}
                            </Radio.Button>
                        ))}
                    </Space>
                </Radio.Group>
            </div>

          

          

            {/* Số giường */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-bed mr-2 text-indigo-600"></i>Số lượng giường
                </h4>
                <Radio.Group
                    size="large"
                    buttonStyle="solid"
                    onChange={(e) => handleNumberFilter('numberOfBeds', e.target.value)}
                    value={searchParam.numberOfBeds}
                >
                    <Space direction="horizontal" wrap>
                        <Radio.Button className="text-lg" value={null}>Bất kỳ</Radio.Button>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((val) => (
                            <Radio.Button className="text-lg" key={val} value={val}>
                                {val}
                            </Radio.Button>
                        ))}
                    </Space>
                </Radio.Group>
            </div>

            {/* Diện tích phòng */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-expand-arrows-alt mr-2 text-teal-600"></i>Diện tích phòng (m²)
                </h4>
                <Select
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Chọn diện tích"
                    value={searchParam.roomSize}
                    onChange={(value) => handleNumberFilter('roomSize', value)}
                    allowClear
                >
                    <Option value="">
                        <i className="fas fa-all mr-2"></i>Tất cả
                    </Option>
                    <Option value="1-30">
                        <i className="fas fa-compress mr-2"></i>Nhỏ (dưới 30m²)
                    </Option>
                    <Option value="30-60">
                        <i className="fas fa-expand mr-2"></i>Vừa (30-60m²)
                    </Option>
                    <Option value="60-1000000000000000000">
                        <i className="fas fa-expand-arrows-alt mr-2"></i>Lớn (trên 60m²)
                    </Option>
                </Select>
            </div>

            {/* Đánh giá */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-star mr-2 text-yellow-500"></i>Điểm đánh giá
                </h4>
                <Rate
                    value={searchParam.rating}
                    onChange={(value) => handleNumberFilter('rating', value)}
                    style={{ fontSize: '24px' }}
                />
                {searchParam.rating && (
                    <Button 
                        type="link" 
                        onClick={() => handleNumberFilter('rating', null)}
                        className="ml-4"
                    >
                        Xóa
                    </Button>
                )}
            </div>

            {/* Tiện ích cơ bản */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-tools mr-2 text-gray-600"></i>Tiện ích cơ bản
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasBalcony}
                        onChange={(e) => handleBooleanFilter('hasBalcony', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-door-open mr-2 text-green-500"></i>Ban công
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasTv}
                        onChange={(e) => handleBooleanFilter('hasTv', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-tv mr-2 text-blue-500"></i>TV
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasAirConditioner}
                        onChange={(e) => handleBooleanFilter('hasAirConditioner', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-snowflake mr-2 text-cyan-500"></i>Máy lạnh
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasRefrigerator}
                        onChange={(e) => handleBooleanFilter('hasRefrigerator', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-thermometer-half mr-2 text-blue-400"></i>Tủ lạnh
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasWifi}
                        onChange={(e) => handleBooleanFilter('hasWifi', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-wifi mr-2 text-purple-500"></i>Wi-Fi
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasHotWater}
                        onChange={(e) => handleBooleanFilter('hasHotWater', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-fire mr-2 text-red-500"></i>Nước nóng
                    </Checkbox>
                </div>
            </div>

            {/* Tiện ích ngoài trời */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-tree mr-2 text-green-600"></i>Tiện ích ngoài trời
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasParking}
                        onChange={(e) => handleBooleanFilter('hasParking', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-car mr-2 text-gray-600"></i>Bãi đỗ xe
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasPool}
                        onChange={(e) => handleBooleanFilter('hasPool', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-swimming-pool mr-2 text-blue-500"></i>Hồ bơi
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasGarden}
                        onChange={(e) => handleBooleanFilter('hasGarden', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-leaf mr-2 text-green-500"></i>Vườn
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasSpaciousGarden}
                        onChange={(e) => handleBooleanFilter('hasSpaciousGarden', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-seedling mr-2 text-green-600"></i>Vườn rộng
                    </Checkbox>
                </div>
            </div>

            {/* View cảnh quan */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-eye mr-2 text-indigo-600"></i>View cảnh quan
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasLakeView}
                        onChange={(e) => handleBooleanFilter('hasLakeView', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-water mr-2 text-blue-400"></i>View hồ
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasMountainView}
                        onChange={(e) => handleBooleanFilter('hasMountainView', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-mountain mr-2 text-gray-700"></i>View núi
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasSeaView}
                        onChange={(e) => handleBooleanFilter('hasSeaView', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-umbrella-beach mr-2 text-blue-300"></i>View biển
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasRiceFieldView}
                        onChange={(e) => handleBooleanFilter('hasRiceFieldView', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-seedling mr-2 text-yellow-600"></i>View ruộng lúa
                    </Checkbox>
                </div>
            </div>

            {/* Hoạt động giải trí */}
            <div className="filter-section my-6">
                <h4 className="text-xl font-bold mb-4">
                    <i className="fas fa-gamepad mr-2 text-purple-600"></i>Hoạt động giải trí
                </h4>
                <div className="grid grid-cols-1 gap-4">
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasBilliardTable}
                        onChange={(e) => handleBooleanFilter('hasBilliardTable', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-circle mr-2 text-green-700"></i>Bàn bi-a
                    </Checkbox>
                    <Checkbox
                        className="text-lg"
                        checked={searchParam.hasManyActivities}
                        onChange={(e) => handleBooleanFilter('hasManyActivities', e.target.checked ? true : null)}
                    >
                        <i className="fas fa-running mr-2 text-orange-500"></i>Nhiều hoạt động
                    </Checkbox>
                </div>
            </div>

            {/* Tiện nghi từ API */}
            {amenities.length > 0 && (
                <div className="filter-section my-6">
                    <h4 className="text-xl font-bold mb-4">
                        <i className="fas fa-concierge-bell mr-2 text-gold-600"></i>Tiện nghi khác
                    </h4>
                    <Checkbox.Group
                        value={searchParam.amenities ? searchParam.amenities.filter(id => Number.isInteger(id)) : []}
                        onChange={handleAmenityChange}
                    >
                        <div className="grid grid-cols-2 gap-2">
                            {amenities.map((amenity) => (
                                <div key={amenity.amenityID} className="mb-2">
                                    <Checkbox className='text-lg' value={amenity.amenityID}>
                                        <span>
                                            <i className={`${amenity.icon} mr-2 text-lg text-gray-600`}></i>
                                            {amenity.name}
                                        </span>
                                    </Checkbox>
                                </div>
                            ))}
                        </div>
                    </Checkbox.Group>
                </div>
            )}
        </Drawer>
    );
};

export default memo(FilterSide);