import { Button, Carousel, Image } from 'antd';
import { memo } from 'react';

import Banner1 from '../../assets/Banner/banner1.jpg';
import Banner2 from '../../assets/Banner/banner2.jpg';
import { URL_SERVER } from '../../constant/global';
import advertisementService from '../../services/advertisementService';

const Banner = ({ listAdvertisement }) => {
    const handleClick=async(ad)=>{
        try {
            await advertisementService.updateClick(ad.adID)
             window.open(ad.urlClick, "_blank")
        } catch (error) {
            window.open(ad.urlClick, "_blank")
        }
    }
    return (
        <Carousel autoplay dotPosition="bottom"  className="rounded-3xl overflow-hidden">
            
            {/* Banner 2 */}           
            {listAdvertisement.map((ad, index) => (
                <div title={ad.adTitle} key={index} className="relative cursor-pointer"  onClick={()=>handleClick(ad)}>
                    <Image style={{ maxHeight:435,width:"100vw"}} src={URL_SERVER+ad.adPicture} preview={false} className="w-full object-cover " />
                    <div className="absolute bottom-10 left-5 text-white text-xl font-semibold bg-black bg-opacity-50 p-2 rounded-md">
                        {ad.adDescription}
                    </div>
                    <Button onClick={() => handleClick(ad)} className="absolute bottom-10 right-5 text-white text-xl font-semibold bg-black bg-opacity-50 p-2 rounded-md">
                        Xem ngay
                    </Button>
                </div>
            ))}
        </Carousel>
    );
};

export default memo(Banner);
