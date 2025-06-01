import React, { memo, useEffect, useState } from 'react';
import { Breadcrumb, Card, message } from 'antd';
import { CalendarFilled, CoffeeOutlined, CommentOutlined, HomeFilled } from '@ant-design/icons';
import articleService from '../../services/articleService';
import categoryArticleService from '../../services/categoryArticleService';
import { Link, useNavigate } from 'react-router-dom';
import { URL_SERVER } from '../../constant/global';
import CardArticle from '../../components/user/CardArticle';

const cateIcons = [
    { icon: <i className="fas fa-plane-departure text-blue-800 text-3xl"></i> },     // Du lịch, chuyến bay
    { icon: <i className="fas fa-utensils text-blue-800 text-3xl"></i> },             // Ẩm thực
    { icon: <i className="fas fa-camera-retro text-blue-800 text-3xl"></i> },         // Chụp ảnh, cảnh đẹp
    { icon: <i className="fas fa-map-marker-alt text-blue-800 text-3xl"></i> },       // Vị trí, địa điểm
    { icon: <i className="fas fa-users text-blue-800 text-3xl"></i> },                // Khách mời, nhóm bạn
    { icon: <i className="fas fa-heart text-blue-800 text-3xl"></i> },                // Yêu thích, sự lãng mạn
    { icon: <i className="fas fa-share-alt text-blue-800 text-3xl"></i> },            // Chia sẻ
    { icon: <i className="fas fa-search text-blue-800 text-3xl"></i> },               // Tìm kiếm
    { icon: <i className="fas fa-newspaper text-blue-800 text-3xl"></i> },            // Tin tức, báo chí
];
const { Meta } = Card;

const Article = () => {
    const [article, setArticle] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            try {
                const dataCate = await categoryArticleService.getAll(); // Gọi API để lấy danh sách thể loại
                setCategories(dataCate);
                let data = await articleService.getAll();
                setArticle(
                    data.map((_article) => {
                        return {
                            ..._article,
                            category: dataCate.find(c => c.cateID === _article.cateArtID)?.cateName || 'Unknown',
                        };
                    })
                );
            } catch (error) {
                message.error('Có lỗi rồi');
            }
        };
        getData();
    }, []);



    return (
        <>
            <div className="px-4 py-2 bg-gray-100">
                <Breadcrumb
                    items={[
                        {
                            title: <Link to="/">Trang chủ</Link>,
                        },
                        {
                            title: 'Danh mục tin tức',
                        },
                    ]}
                />
            </div>

            <div className='px-2 py-3'>
                {
                    categories.length > 0 && categories.map((c, indexParent) =>
                        <>
                            <div className='mb-7'>
                                <p className='text-3xl font-bold my-3 font-sans text-gray-600'>{c.cateName} {cateIcons[indexParent].icon}</p>
                                <div className="mx-auto ">
                                    <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-3">
                                        {article.filter(s => s.cateArtID === c.cateID).map((item, index) => (
                                            <>
                                                {indexParent % 2 === 0 ?

                                                    <span className={index === 0 ? "col-span-2" : ""}>
                                                        <CardArticle key={index} item={item} index={index} />
                                                    </span> :
                                                    <span className={index === 2 ? "col-span-2" : ""}>
                                                        <CardArticle key={index} item={item} index={index} />
                                                    </span>
                                                }

                                            </>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }
            </div>

        </>
    );
};

export default memo(Article);
