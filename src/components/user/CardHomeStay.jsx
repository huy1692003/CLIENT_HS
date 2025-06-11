import { Button, Carousel, Image, notification, Tag, Tooltip, Rate } from 'antd';
import '../../styles/user/cardhomestay.scss';
import { formatPrice } from '../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';
import { createRef, memo, useState } from 'react';
import { URL_SERVER } from '../../constant/global';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atom';
import favoritesService from '../../services/favoritesService';
import CarouselButton from '../shared/CarouselButton';
import { HeartOutlined, EnvironmentOutlined, HomeOutlined, StarOutlined, FireOutlined } from '@ant-design/icons';

const CardHomeStay = ({ data, width = "100%" , isTopView = false }) => {
    const navigate = useNavigate();
    const cus = useRecoilValue(userState);
    const carouselRef = createRef();
    const [showButtons, setShowButtons] = useState(false);
    const [showAddFavorites, setShowAddFavorites] = useState(false);
    
    const next = () => {
        carouselRef.current.next();
    }
    
    const previous = () => {
        carouselRef.current.prev();
    }

    const addFavorites = async () => {
        if (!cus) {
            notification.error({ 
                showProgress: true, 
                message: "Yêu cầu đăng nhập !", 
                description: "Bạn cần đăng nhập để sử dụng chức năng này", 
                btn: <Button onClick={() => navigate('/login-user')}>Đăng nhập ngay</Button>, 
                duration: 4 
            });
        } else {
            try {
                await favoritesService.addFavorites(data.homeStay.homestayID, cus.idCus);
                notification.success({ 
                    message: 'Thông báo', 
                    description: "Thêm thành công HomeStay vào danh sách yêu thích của bạn" 
                });
            } catch (error) {
                notification.error({ 
                    message: "Thông báo", 
                    description: "Bạn đã thêm HomeStay này vào danh sách yêu thích rồi" 
                });
            }
        }
    }

    // Get features to display
    const getFeatures = () => {
        const features = [];
        if (data.detailHomeStay.hasSwimmingPool) features.push("Hồ bơi");
        if (data.detailHomeStay.hasBilliardTable) features.push("Bàn bi-a");
        if (data.detailHomeStay.spaciousGarden) features.push("Vườn rộng");
        if (data.detailHomeStay.lakeView) features.push("View hồ");
        if (data.detailHomeStay.mountainView) features.push("View núi");
        if (data.detailHomeStay.seaView) features.push("View biển");
        if (data.detailHomeStay.riceFieldView) features.push("View đồng lúa");
        return features.slice(0, 3); // Limit to 3 features
    }

    // Get room amenities
    const getRoomAmenities = () => {
        const amenities = [];
        if (data.rooms[0]?.hasBalcony) amenities.push("Ban công");
        if (data.rooms[0]?.hasTv) amenities.push("TV");
        if (data.rooms[0]?.hasAirConditioner) amenities.push("Điều hòa");
        if (data.rooms[0]?.hasWifi) amenities.push("Wifi");
        if (data.rooms[0]?.hasHotWater) amenities.push("Nước nóng");
        return amenities.slice(0, 3); // Limit to 3 amenities
    }

    return (
        <div 
            key={data.homeStay.homestayID} 
            onMouseEnter={() => setShowAddFavorites(true)} 
            onMouseLeave={() => setShowAddFavorites(false)} 
            className="card-homestay-homepage shadow-md rounded-xl overflow-hidden" 
            style={{ position: 'relative', marginBottom: 20, width: width }}
        >
            {/* Hot tag ribbon */}
            {isTopView && (
                <div 
                    className="absolute top-0 left-0 z-30 overflow-hidden" 
                    style={{ width: '80px', height: '80px' }}
                >
                    <div 
                        className="absolute flex items-center justify-center bg-red-600 text-white font-bold py-1 px-6 shadow-lg"
                        style={{ 
                            transform: 'rotate(-45deg) translateY(-20px)', 
                            width: '120px', 
                            left: '-30px', 
                            top: '24px',
                            fontSize: '0.8rem'
                        }}
                    >
                        <FireOutlined className="mr-1" /> HOT
                    </div>
                </div>
            )}
            
            {showAddFavorites && 
                <Tooltip title="Thêm vào yêu thích">
                    <Button 
                        shape="circle" 
                        icon={<HeartOutlined />} 
                        onClick={addFavorites}
                        className="bg-white hover:bg-pink-50 hover:text-pink-500 shadow-md"
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
                    {data.homeStay.imageHomestay?.split(",").splice(0,10).map((i) =>
                        <div style={{ borderRadius: 20, width: '100%', height: '400px' }}>
                            <Image width={"100%"} src={URL_SERVER + i} preview={false} />
                        </div>)}
                </Carousel>
                
                {data.homeStay.averageRating > 0 && (
                    <div className={`absolute  bg-white px-2 py-1 rounded-lg shadow-md flex items-center ${isTopView ? 'bottom-5 left-2' : 'top-3 left-3'}`}>
                        <StarOutlined className="text-yellow-500 mr-1" />
                        <span className="font-bold">{data.homeStay.averageRating.toFixed(1)}</span>
                    </div>
                )}
                {data.homeStay.viewCount > 0 && (
                    <div className={`absolute bg-white px-2 py-1 rounded-lg shadow-md flex items-center ${isTopView ? 'bottom-5 right-2' : 'bottom-3 left-3'}`}>
                        <Tooltip title={`${data.homeStay.viewCount} lượt xem`}>
                            <span className="text-gray-600 font-bold"><i className="mr-1 fa-solid fa-eye text-blue-700"></i>{data.homeStay.viewCount} </span>
                        </Tooltip>
                    </div>
                )}
            </div>
            
            <div 
                className="p-2 cursor-pointer" 
                onClick={() => navigate(`/detail-homestay?id=${data.homeStay.homestayID}`)}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 truncate mr-2">{data.homeStay.homestayName}</h3>
                   
                </div>
                
                <div className="flex items-center mb-2 text-gray-600">
                    <EnvironmentOutlined className="mr-1 text-red-500" />
                    <p className="text-sm truncate">
                        {data.homeStay.addressDetail}, {data.homeStay.district}, {data.homeStay.province}
                    </p>
                </div>
                
                <div className="flex items-center mb-3 text-gray-600">
                    <HomeOutlined className="mr-1" />
                    <p className="text-xs">
                        {data.rooms[0]?.roomSize}m² • {data.rooms[0]?.maxAdults} người lớn 
                        {data.rooms[0]?.maxChildren > 0 && ` • ${data.rooms[0].maxChildren} trẻ em`}
                    </p>
                </div>
                
                <div className="mb-3 flex flex-wrap  gap-y-2">
                    {getFeatures().slice(0, 3).map((feature, index) => (
                        <Tag key={index} color="blue">{feature}</Tag>
                    ))}
                    {getRoomAmenities().slice(0, 3).map((amenity, index) => (
                        <Tag key={`amenity-${index}`} color="green">{amenity}</Tag>
                    ))}
                </div>
                
                <div className="flex justify-between items-center mt-2">
                    <div>
                        <span className="text-gray-500 text-xs">Từ </span>
                        <span className="text-base font-bold text-orange-600">{formatPrice(data.rooms[0]?.pricePerNight)}</span>
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

export default memo(CardHomeStay);
