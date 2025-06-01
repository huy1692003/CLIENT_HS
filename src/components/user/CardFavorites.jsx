import { Button, Carousel, Image, notification, Tag, Tooltip } from 'antd';
import '../../styles/user/cardhomestay.scss';
import { formatPrice } from '../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';
import { createRef, memo, useState } from 'react';
import { URL_SERVER } from '../../constant/global';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atom';
import favoritesService from '../../services/favoritesService';
import CarouselButton from '../shared/CarouselButton';
import { DeleteOutlined, EnvironmentOutlined, HomeOutlined, StarOutlined } from '@ant-design/icons';

const CardFavorites = ({ data, refeshData, width = "100%" }) => {
    const navigate = useNavigate();
    const cus = useRecoilValue(userState);
    const carouselRef = createRef();
    const [showButtons, setShowButtons] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    
    const next = () => {
        carouselRef.current.next();
    }
    
    const previous = () => {
        carouselRef.current.prev();
    }

    const deleteFavorites = async () => {
        try {
            await favoritesService.deleteFavorites(data.favoriteID);
            notification.success({ 
                message: 'Thông báo', 
                description: "Xóa thành công HomeStay khỏi danh sách yêu thích" 
            });
            refeshData();
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error.message,
            });
        }
    }

    // Extract homestay and detail data
    const homestay = data.homestay;
    const detailHomeStay = data.detailHomeStay;
    const rooms = data.rooms;

    // Get features to display
    const getFeatures = () => {
        const features = [];
        if (detailHomeStay.hasSwimmingPool) features.push("Hồ bơi");
        if (detailHomeStay.hasBilliardTable) features.push("Bàn bi-a");
        if (detailHomeStay.spaciousGarden) features.push("Vườn rộng");
        if (detailHomeStay.lakeView) features.push("View hồ");
        if (detailHomeStay.mountainView) features.push("View núi");
        if (detailHomeStay.seaView) features.push("View biển");
        if (detailHomeStay.riceFieldView) features.push("View đồng lúa");
        return features.slice(0, 3); // Limit to 3 features
    }

    // Get room amenities
    const getRoomAmenities = () => {
        const amenities = [];
        if (rooms[0]?.hasBalcony) amenities.push("Ban công");
        if (rooms[0]?.hasTv) amenities.push("TV");
        if (rooms[0]?.hasAirConditioner) amenities.push("Điều hòa");
        if (rooms[0]?.hasWifi) amenities.push("Wifi");
        if (rooms[0]?.hasHotWater) amenities.push("Nước nóng");
        return amenities.slice(0, 3); // Limit to 3 amenities
    }

    return (
        <div 
            key={homestay.homestayID} 
            onMouseEnter={() => setShowDeleteButton(true)} 
            onMouseLeave={() => setShowDeleteButton(false)} 
            className="card-homestay-homepage shadow-md rounded-xl overflow-hidden" 
            style={{ position: 'relative', marginBottom: 20, width: width }}
        >
            {showDeleteButton && 
                <Tooltip title="Xóa khỏi danh sách yêu thích">
                    <Button 
                        shape="circle" 
                        icon={<DeleteOutlined />} 
                        onClick={deleteFavorites}
                        className="bg-white hover:bg-red-50 hover:text-red-500 shadow-md"
                        style={{ position: 'absolute', top: 17, right: 17, zIndex: 30 }}
                    />
                </Tooltip>
            }

            <div
                className='list-image-preview relative'
                onMouseEnter={() => setShowButtons(true)}
                onMouseLeave={() => setShowButtons(false)}
            >
                {showButtons && (
                    <>
                        <CarouselButton direction="prev" onClick={previous} />
                        <CarouselButton direction="next" onClick={next} />
                    </>
                )}
                <Carousel ref={carouselRef} dots>
                    {homestay.imageHomestay?.split(",").splice(0,10).map((i, index) =>
                        <div key={index} style={{ borderRadius: 20, width: '100%', height: '400px' }}>
                            <Image width={"100%"} src={URL_SERVER + i} preview={false} />
                        </div>)}
                </Carousel>
                
                {homestay.averageRating >= 0 && (
                    <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-lg shadow-md flex items-center">
                        <StarOutlined className="text-yellow-500 mr-1" />
                        <span className="font-bold">{homestay.averageRating.toFixed(1)}</span>
                    </div>
                )}
                {homestay.viewCount > 0 && (
                    <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded-lg shadow-md flex items-center">
                        <Tooltip title={`${homestay.viewCount} lượt xem`}>
                            <span className="text-gray-600 font-bold"><i className="mr-1 fa-solid fa-eye text-blue-700"></i>{homestay.viewCount} </span>
                        </Tooltip>
                    </div>
                )}
            </div>
            
            <div 
                className="p-2 cursor-pointer" 
                onClick={() => navigate(`/detail-homestay?id=${homestay.homestayID}`)}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 truncate mr-2">{homestay.homestayName}</h3>
                </div>
                
                <div className="flex items-center mb-2 text-gray-600">
                    <EnvironmentOutlined className="mr-1 text-red-500" />
                    <p className="text-sm truncate">
                        {homestay.addressDetail}, {homestay.district}, {homestay.province}
                    </p>
                </div>
                
                <div className="flex items-center mb-3 text-gray-600">
                    <HomeOutlined className="mr-1" />
                    <p className="text-xs">
                        {rooms[0]?.roomSize}m² • {rooms[0]?.maxAdults} người lớn 
                        {rooms[0]?.maxChildren > 0 && ` • ${rooms[0].maxChildren} trẻ em`}
                    </p>
                </div>
                
                <div className="mb-3 flex flex-wrap gap-y-2">
                    {getFeatures().map((feature, index) => (
                        <Tag key={index} color="blue">{feature}</Tag>
                    ))}
                    {getRoomAmenities().map((amenity, index) => (
                        <Tag key={`amenity-${index}`} color="green">{amenity}</Tag>
                    ))}
                </div>
                
                <div className="flex justify-between items-center mt-2">
                    <div>
                        <span className="text-gray-500 text-xs">Từ </span>
                        <span className="text-base font-bold text-orange-600">{formatPrice(rooms[0]?.pricePerNight)}</span>
                        <span className="text-gray-500 text-xs"> / đêm</span>
                    </div>
                    <Button type="primary" size="small" className="bg-blue-500">
                        Xem chi tiết
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default memo(CardFavorites);