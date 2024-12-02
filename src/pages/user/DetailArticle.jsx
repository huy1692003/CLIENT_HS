import React, { memo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { message, Spin } from "antd"; // Import Ant Design's loading spinner
import articleService from "../../services/articleService";

const DetailArticle = () => {
    const [searchParams] = useSearchParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    // Lấy id từ query params
    const id = searchParams.get("id");

    useEffect(() => {
        const getData = async () => {
            try {
                let res = await articleService.getById(id);
                setArticle(res);
                setLoading(false);
            } catch (error) {
                message.error("Có lỗi khi lấy dữ liệu");
                setLoading(false); // Đảm bảo loading tắt khi có lỗi
            }
        };
        id && getData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateString));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{article?.title}</h1>
            <h2 className="text-base font-bold mb-4">{formatDate(article?.publishDate)}</h2>
            {/* Sử dụng dangerouslySetInnerHTML để hiển thị nội dung HTML */}
            <div className="prose lg:prose-xl">
                <div dangerouslySetInnerHTML={{ __html: article?.content }} />
            </div>
        </div>
    );
};

export default memo( DetailArticle);
