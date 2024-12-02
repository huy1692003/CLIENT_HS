import React, { memo, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { CalendarOutlined, CommentOutlined } from '@ant-design/icons';
import articleService from '../../services/articleService';
import categoryArticleService from '../../services/categoryArticleService';
import { useNavigate } from 'react-router-dom';
import { URL_SERVER } from '../../constant/global';

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

    const CardArticle = memo(({ item, index }) => (
        <Card
            onClick={() => navigate('/detail-article?id=' + item.articleID)}
            key={index}
            hoverable
            cover={<img alt={item.title} src={URL_SERVER + item.picturePreview} />}
            className="shadow-lg rounded-lg"
        >
            <div className="flex items-center mb-2">
                <div className="text-sm font-bold text-purple-600">{item.category}</div>
            </div>
            <Meta
                title={<h2 className="text-lg font-bold text-blue-600">{item.title}</h2>}
                description={<p className="text-gray-500">{item.description}</p>}
            />
            <div className="flex justify-between items-center text-gray-400 text-sm mt-4">
                <span>
                    <CalendarOutlined /> {new Date(item.publishDate).toLocaleDateString('vi-VN')}
                </span>
                <span>
                    <CommentOutlined /> 0 Bình luận
                </span>
            </div>
        </Card>
    ));

    return (
        <>
            <div className="text-2xl font-bold text-center mt-10 mb-5 py-5 rounded-2xl" style={{ backgroundColor: '#F5F5F5' }}>
                Danh mục bài viết mới nhất
            </div>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {article.map((item, index) => (
                        <CardArticle key={index} item={item} index={index} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default memo( Article);
