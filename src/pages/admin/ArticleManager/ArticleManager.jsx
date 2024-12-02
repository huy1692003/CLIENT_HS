import React, { memo, useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, notification, Space, Select, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import articleService from '../../../services/articleService';
import categoryArticleService from '../../../services/categoryArticleService';
import { uploadService } from '../../../services/uploadService';
import createFromData from '../../../utils/createFormData';
import { useRecoilState } from 'recoil';
import { render } from '@testing-library/react';
import { URL_SERVER } from '../../../constant/global';

 const ArticleManager = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchArticles();
        fetchCategories();
    }, []);

    const fetchArticles = async () => {
        const data = await articleService.getAll();
        setArticles(data);
    };

    const fetchCategories = async () => {
        const data = await categoryArticleService.getAll(); // Gọi API để lấy danh sách thể loại
        setCategories(data);
    };

    const showModal = (article = null) => {
        setIsEditing(!!article);
        setIsModalVisible(true);

        // Reset form values khi mở modal
        if (article) {
            form.setFieldsValue({
                articleID: article.articleID,
                title: article.title,
                cateArtID: article.cateArtID,

            });
            setContent(article.content); // Thiết lập nội dung vào CKEditor
        } else {
            form.resetFields();
            setContent('');
        }
    };

    const handleOk = async (values) => {
        console.log(values)
        try {
            const picturePreview = values.picturePreview ? await uploadService.postSingle(createFromData.single(values.picturePreview.fileList)) : ""
            const articleData = { ...values, content, picturePreview: picturePreview.filePath, authorID: "huy24334534" }; // Lấy nội dung từ CKEditor
            console.log(articleData)
            if (isEditing) {
                // Cập nhật bài viết
                await articleService.update(articleData);
                notification.success({ message: 'Cập nhật bài viết thành công!' });
            } else {
                // Thêm bài viết
                await articleService.add(articleData);
                notification.success({ message: 'Thêm bài viết thành công!' });
            }
            fetchArticles(); // Tải lại danh sách bài viết
            setIsModalVisible(false);
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra!' });
        }
    };

    const handleDelete = async (articleID) => {
        try {
            await articleService.delete(articleID);
            notification.success({ message: 'Xóa bài viết thành công!' });
            fetchArticles(); // Tải lại danh sách bài viết
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa bài viết!' });
        }
    };


    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Ảnh xem trước',
            dataIndex: 'picturePreview',
            key: 'picturePreview',
            render: (data) => <Image width={190} height={120} src={URL_SERVER + data} />
        },

        {
            title: 'Thể loại',
            dataIndex: 'cateArtID',
            key: 'cateArtID',
            render: (cateArtID) => {
                const category = categories.find(cat => cat.cateID === cateArtID);
                return category ? category.cateName : 'Chưa xác định';
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.articleID)} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Quản Lý Bài Viết</h1>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                style={{ marginBottom: 16 }}
            >
                Thêm Bài Viết
            </Button>
            <Table
                columns={columns}
                dataSource={articles}
                rowKey="articleID"
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title={isEditing ? "Cập Nhật Bài Viết" : "Thêm Bài Viết"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={1000}
            >
                <Form form={form} onFinish={handleOk} layout="vertical">
                    {isEditing && (
                        <Form.Item
                            label="ID Bài Viết"
                            name="articleID"
                        >
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Thể Loại"
                        name="cateArtID"
                        rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                    >
                        <Select placeholder="Chọn thể loại">
                            {categories.map(category => (
                                <Select.Option key={category.cateID} value={category.cateID}>
                                    {category.cateName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Tiêu Đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Ảnh xem trước bài viết"
                        name="picturePreview"
                    >
                        <Upload
                            accept=".jpg,.png,.webp,.jpeg"
                            listType="picture-card"
                            maxCount={1}

                        >
                            <div className='block'>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải lên</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="Nội Dung"
                        name="content"
                    >
                        <CKEditor
                            editor={ClassicEditor}
                            data={content}

                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setContent(data); // Cập nhật nội dung khi người dùng gõ
                            }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditing ? "Cập Nhật" : "Thêm"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default memo(ArticleManager)
