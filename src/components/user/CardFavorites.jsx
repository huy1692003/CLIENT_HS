import { Button, Carousel, Image, notification, Tooltip } from 'antd';
import '../../styles/user/cardhomestay.scss'
import { formatPrice } from '../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';
import React, { memo } from 'react';
import { URL_SERVER } from '../../constant/global';
import { RecoilState, useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atom';
import favoritesService from '../../services/favoritesService';
import CarouselButton from '../shared/CarouselButton';



const CardFavorites = ({ idFav,data,detailHomeStay ,refeshData}) => {
    const navigate = useNavigate()
    const cus = useRecoilValue(userState)

    const deleteFavorites=async()=>{
        try {
            await favoritesService.deleteFavorites(idFav)
            refeshData()
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error.message,
              });
        }
    }

    const carouselRef = React.createRef();
    const next = () => {
        carouselRef.current.next();
    }
    const previous = () => {
        carouselRef.current.prev();
    }

    return (
        <div key={data.homestayID} className="card-homestay-homepage" style={{ position: 'relative' }} >
           
           <Tooltip title="Xóa khỏi danh sách yêu thích">
                <div style={{ cursor: "pointer" }} className="heart-icon" onClick={deleteFavorites}>
                    <i className="fa-solid fa-trash text-red-500"></i>
                </div>
            </Tooltip>

            <div className='list-image-preview relative'>
                <CarouselButton direction="prev" onClick={previous} />
                <CarouselButton direction="next" onClick={next} />
                <Carousel ref={carouselRef}  dots>
                    {data.imagePreview?.map((i) =>
                        <div style={{ borderRadius: 20, width: '100%', height: '400px' }}>
                            <Image src={URL_SERVER + i} preview={false} />
                        </div>)}
                </Carousel>
            </div>
            <div style={{ cursor: "pointer" }} onClick={() => navigate(`/detail-homestay?id=${data.homestayID}`)}>
                <h3 className='name-homestay text-lg font-bold leading-5 mb-2 '>{data.homestayName} </h3>
                <h4 className='name-homestay text-sm text-green-600 mb-1'><i className="fa-solid fa-location-crosshairs mr-1"></i>{data.addressDetail}</h4>
                <h4 className='name-homestay text-xs '>{
                    detailHomeStay.numberOfBedrooms + ' phòng khách - ' +
                    detailHomeStay.numberOfLivingRooms + ' phòng ngủ - ' +
                    detailHomeStay.numberOfBathrooms + ' phòng tắm '
                }</h4>
            </div>
            <h4 className='name-homestay text-xl font-bold mt-2 ' style={{ color: "#F4511E", bottom: -5 }}>Từ {formatPrice(data.pricePerNight
            )} / đêm</h4>
            <h4 className='name-homestay text-base font-bold truncate mt-1  bottom' title={data.province + '-' + data.district}>
                <i className="fa-solid fa-location-dot mr-1 mt-1" style={{ fontSize: 18, color: "#11497C" }}></i>
                {data.province + ' - ' + data.district}

            </h4>
        </div>
    );
};
export default memo(CardFavorites)