import { Carousel, Image, notification } from 'antd';
import '../../styles/user/cardhomestay.scss'
import { formatPrice } from '../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';
import { createRef, memo } from 'react';
import { URL_SERVER } from '../../constant/global';
import { RecoilState, useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atom';
import favoritesService from '../../services/favoritesService';
import CarouselButton from '../shared/CarouselButton';
const CardHomeStay = ({ data }) => {
    const navigate = useNavigate()
    const cus = useRecoilValue(userState)
    const carouselRef = createRef();
    const next = () => {
        carouselRef.current.next();
    }
    const previous = () => {
        carouselRef.current.prev();
    }


    const addFavorites = async () => {
        if (!cus) {
            notification.error({ message: "Yêu cầu đăng nhập !", description: "Bạn cần đăng nhập để sử dụng chức năng này" })
        }
        try {
            await favoritesService.addFavorites(data.homeStay.homestayID,cus.idCus)
            notification.success({message:'Thông báo',description:"Thêm thành công HomeStay vào danh sách yêu thích của bạn"})
        } catch (error) {
            notification.error({message: "Thông báo", description: "Bạn đã thêm HomeStay này vào danh sách yêu thích rồi"})
        }

        
    }
    return (


        <div key={data.homeStay.homestayID} className="card-homestay-homepage" style={{ position: 'relative' }} >
            <div style={{ cursor: "pointer" }} className="heart-icon" onClick={addFavorites}>
                <i className="fa-regular fa-heart" ></i>
            </div>
            
            <div className='list-image-preview relative'>
                <CarouselButton direction="prev" onClick={previous} />
                <CarouselButton direction="next" onClick={next} />
                <Carousel ref={carouselRef}  dots>
                    {data.homeStay.imagePreview?.map((i) =>
                        <div style={{ borderRadius: 20, width: '100%', height: '400px' }}>
                            <Image src={URL_SERVER + i} preview={false} />
                        </div>)}
                </Carousel>
            </div>
            <div style={{ cursor: "pointer" }} onClick={() => navigate(`/detail-homestay?id=${data.homeStay.homestayID}`)}>
                <h3 className='name-homestay text-lg font-bold leading-5 mb-2 '>{data.homeStay.homestayName} </h3>
                <h4 className='name-homestay text-sm text-green-600 mb-1'><i className="fa-solid fa-location-crosshairs mr-1"></i>{data.homeStay.addressDetail}</h4>
                <h4 className='name-homestay text-xs '>{
                    data.detailHomeStay.numberOfBedrooms + ' phòng khách - ' +
                    data.detailHomeStay.numberOfLivingRooms + ' phòng ngủ - ' +
                    data.detailHomeStay.numberOfBathrooms + ' phòng tắm '
                }</h4>
            </div>
            <h4 className='name-homestay text-xl font-bold mt-2 ' style={{ color: "#F4511E", bottom: -5 }}>Từ {formatPrice(data.homeStay.pricePerNight
            )} / đêm</h4>
            <h4 className='name-homestay text-base font-bold truncate mt-1  bottom' title={data.homeStay.province + '-' + data.homeStay.district}>
                <i className="fa-solid fa-location-dot mr-1 mt-1" style={{ fontSize: 18, color: "#11497C" }}></i>
                {data.homeStay.province + ' - ' + data.homeStay.district}

            </h4>
        </div>
    );
};
export default memo(CardHomeStay)