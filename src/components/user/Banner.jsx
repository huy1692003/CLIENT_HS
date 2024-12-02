import { Carousel, Image } from "antd";

import Banner1 from '../../assets/Banner/banner1.jpg'
import Banner2 from '../../assets/Banner/banner2.jpg'
import { memo } from "react";
// import Banner3 from '../../assets/Banner/banner3.jpg'
 const Banner = () => {

    return (
        <Image src={Banner2} preview={false} className="rounded-3xl" />
    );
};
export default memo(Banner)