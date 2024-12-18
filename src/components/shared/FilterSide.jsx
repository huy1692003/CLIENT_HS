import { Drawer, Button, Slider, InputNumber, Radio, Space, Row, Col, Checkbox } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { memo, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { initParamseach, paramSearchHT } from '../../recoil/atom';
import amenitiesService from '../../services/amenitiesService';

const FilterSide = ({ showSideFilter, setShowSideFilter, refeshData, setPaginate , priceRange  ,setPriceRange}) => {
    const [searchParam, setSearchParams] = useRecoilState(paramSearchHT)
    const [amenities, setAmenities] = useState([])


    useEffect(() => {
        const getDataAmenities = async () => {
            let res = await amenitiesService.getAll()
            setAmenities(res)
        }
        getDataAmenities()
    }, [])
    
 
    useEffect(() => {
        console.log("gt")
        console.log(priceRange)
        if (priceRange.length == 2 && priceRange[0]!==0 && priceRange[1]!==20000000) {
            setSearchParams((prev) => ({ ...prev, priceRange: priceRange[0] + "-" + priceRange[1], isCallAPI: false }))
        }
        else{
            setSearchParams((prev) => ({ ...prev, priceRange: null, isCallAPI: true }))
        }

    }, [priceRange])


    const handleAmenityChange = (selectedValues) => {
        // Tạo một Set mới từ selectedValues (là mảng các giá trị)
        const updatedAmenities = new Set(selectedValues);
        setSearchParams((prev) => ({
            ...prev,
            amenities: updatedAmenities, // Cập nhật lại Set tiện ích
            isCallAPI: false, // Cập nhật trạng thái là chưa gọi API
        }));
    };
    console.log(searchParam)
    return (
        <Drawer
          
            size={"large"}
            closeIcon={<CloseCircleOutlined className="text-2xl p-5" />}
            title={<h3 className="text-3xl font-bold text-center">Bộ Lọc</h3>}
            onClose={() => setShowSideFilter(false)}
            open={showSideFilter}
            footer={
                <div className="flex justify-between mb-4 mt-2">
                    <Button className="text-xl font-semibold py-5"
                        onClick={() => {
                            setPaginate(prev=>({...prev,page:1}))
                            setPriceRange([0, 20000000])
                            setSearchParams(initParamseach)
                            refeshData()
                            refeshData()
                            setShowSideFilter(false)

                        }

                        }>Xóa bộ lọc</Button>
                    <Button
                        type="primary"
                        className="text-xl font-semibold py-5 bg-gray-800 text-white"
                        onClick={() => {
                            setPaginate(prev=>({...prev,page:1}))
                            setSearchParams({ ...searchParam, isCallAPI: true })
                        }
                        }
                    >
                        Tìm kiếm
                    </Button>
                </div>
            }
        >
            {/* Khoảng giá */}
            <div className="filter-section my-4">
                <h4 className="text-2xl font-bold">Khoảng giá</h4>
                <Slider
                    range={true}
                    min={0}
                    tooltip={{ open: false }}
                    marks
                    max={20000000}
                    value={priceRange}
                    onChange={(value) => setPriceRange(value)}
                    step={50000}
                    className="text-2xl"
                />
                <Row gutter={16}>
                    <Col span={12}>
                        <InputNumber
                            min={0}
                            max={20000000}
                            formatter={(value) =>
                                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                            }
                            parser={(value) => {
                                // Xử lý khi value là string và trả về số
                                return value ? parseInt(value.replace(/\$\s?|(,*)/g, ''), 10) : 0;
                            }}
                            value={priceRange[0]}
                            onChange={(value) => setPriceRange([value, priceRange[1]])}
                            style={{ width: "100%" }}
                            addonAfter={<span className="font-bold text-gray-700">VNĐ</span>}
                            size={"large"}
                            className="text-2xl font-semibold"
                        />
                    </Col>
                    <Col span={12}>
                        <InputNumber
                            className="text-2xl font-semibold"
                            min={0}
                            formatter={(value) =>
                                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                            }
                            parser={(value) => {
                                // Xử lý khi value là string và trả về số
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

            {/* Phòng khách */}
            <div className="filter-section my-4">
                <h4 className="text-2xl font-bold my-10">Phòng khách</h4>
                <Radio.Group
                    size="large"
                    buttonStyle="solid"
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, numberOfLivingRooms: e.target.value, isCallAPI: false }))}
                    value={searchParam.numberOfLivingRooms}
                >
                    <Space direction="horizontal">
                        <Radio.Button className="text-xl " block value={null}>Bất kỳ</Radio.Button>
                        {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                            <Radio.Button className="text-xl " block key={val} value={val}>
                                {val}
                            </Radio.Button>
                        ))}
                    </Space>
                </Radio.Group>
            </div>
            {/* Phòng tắm */}
            <div className="filter-section my-4">
                <h4 className="text-2xl font-bold my-10">Phòng tắm</h4>
                <Radio.Group
                    size="large"
                    buttonStyle="solid"
                    block={true}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, numberOfBathrooms: e.target.value, isCallAPI: false }))}
                    value={searchParam.numberOfBathrooms}
                >
                    <Space direction="horizontal">
                        <Radio.Button className="text-xl " value={null}>Bất kỳ</Radio.Button>
                        {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                            <Radio.Button className="text-xl " key={val} value={val}>
                                {val}
                            </Radio.Button>
                        ))}
                    </Space>
                </Radio.Group>
            </div>

            {/* Phòng ngủ */}
            <div className="filter-section my-4">
                <h4 className="text-2xl font-bold my-10">Phòng ngủ</h4>
                <Radio.Group
                    size="large"
                    buttonStyle="solid"
                    block={true}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, numberOfBedrooms: e.target.value, isCallAPI: false }))}
                    value={searchParam.numberOfBedrooms}
                >
                    <Space direction="horizontal">
                        <Radio.Button className="text-xl " value={null}>Bất kỳ</Radio.Button>
                        {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                            <Radio.Button className="text-xl " key={val} value={val}>
                                {val}
                            </Radio.Button>
                        ))}
                    </Space>
                </Radio.Group>
            </div>
            {/* Phòng bếp */}
            <div className="filter-section my-4">
                <h4 className="text-2xl font-bold my-10">Phòng bếp</h4>
                <Radio.Group
                    size="large"
                    buttonStyle="solid"
                    block={true}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, numberOfKitchens: e.target.value, isCallAPI: false }))}
                    value={searchParam.numberOfKitchens}
                >
                    <Space direction="horizontal">
                        <Radio.Button className="text-xl " value={null}>Bất kỳ</Radio.Button>
                        {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                            <Radio.Button className="text-xl " key={val} value={val}>
                                {val}
                            </Radio.Button>
                        ))}
                    </Space>
                </Radio.Group>
            </div>
            {/* Phòng bếp */}
            <div className="filter-section my-4">
                <h4 className="text-2xl font-bold my-10">Tiện nghi</h4>
                <Checkbox.Group
                    value={[...searchParam.amenities]} //
                    onChange={handleAmenityChange}
                >
                    <div className="grid grid-cols-2 leading-[50px]">
                        {amenities.map((amenity) => (
                            <div key={amenity.amenityID} className="mr-4  mb-2">
                                <Checkbox className='text-xl' value={amenity.amenityID}><span><i className={amenity.icon + " mr-4 text-xl text-gray-600"}></i>{amenity.name}</span></Checkbox>
                            </div>
                        ))}
                    </div>
                </Checkbox.Group>
            </div>

        </Drawer>
    );
};

export default memo(FilterSide);
