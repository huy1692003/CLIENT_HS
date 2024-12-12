import React, { memo, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { CalendarOutlined, CommentOutlined } from '@ant-design/icons';
import articleService from '../../services/articleService';
import categoryArticleService from '../../services/categoryArticleService';
import { useNavigate } from 'react-router-dom';
import { URL_SERVER } from '../../constant/global';
import CardArticle from '../../components/user/CardArticle';

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
            <div className="text-2xl font-bold text-center mt-10 mb-5 py-5 rounded-2xl" style={{ backgroundColor: '#F5F5F5' }}>
                Danh mục bài viết mới nhất
            </div>
            <div className="container mx-auto px-2 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {article.map((item, index) => (
                        <CardArticle key={index} item={item} index={index} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default memo( Article );
