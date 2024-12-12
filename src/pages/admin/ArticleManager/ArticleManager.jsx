import React, { memo, useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, notification, Space, Select, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import articleService from '../../../services/articleService';
import categoryArticleService from '../../../services/categoryArticleService';
import { uploadService } from '../../../services/uploadService';
import createFromData from '../../../utils/createFormData';
import { useRecoilState, useRecoilValue } from 'recoil';
import { render } from '@testing-library/react';
import { URL_SERVER } from '../../../constant/global';
import { adminState } from '../../../recoil/atom';

const ArticleManager = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [content, setContent] = useState('');
    const [fileList, setFileList] = useState([]);
    const admin = useRecoilValue(adminState)
    const [pagination, setPagination] = useState({
        current: 1,      // Trang hiện tại
        pageSize: 3,     // Số bài viết mỗi trang
        total: 0,        // Tổng số bài viết
    });
    const [searchTerm, setSearchTerm] = useState('');  // State lưu giá trị tìm kiếm
    useEffect(() => {
        fetchArticles();
        fetchCategories();
    }, []);

    const fetchArticles = async () => {
        try {
            const data = await articleService.getAll();  // Lấy tất cả dữ liệu bài viết từ API
            setArticles(data);                           // Lưu vào state articles
            setPagination(prev => ({
                ...prev,
                total: data.length,  // Cập nhật tổng số bài viết
            }));
        } catch (error) {
            notification.error({ message: 'Không thể tải dữ liệu bài viết!' });
        }
    };
    const handleTableChange = (pagination) => {
        setPagination({
            ...pagination,
        });
    }

    const currentArticles = articles.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
    );

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

            // Set preview image when editing
            if (article.picturePreview) {
                setFileList([{
                    uid: '-1',
                    name: 'preview.png',
                    status: 'done',
                    url: URL_SERVER + article.picturePreview,
                    urlRoot: article.picturePreview
                }]);
            }
        } else {
            form.resetFields();
            setContent('');
            setFileList([]);
        }
    };

    const handleOk = async (values) => {
        try {
            let picturePreview;
            if (values.picturePreview?.fileList?.length > 0) {
                const uploadResult = await uploadService.postSingle(createFromData.single(values.picturePreview.fileList));
                picturePreview = uploadResult.filePath;
            } else if (fileList.length > 0 && fileList[0].urlRoot) {
                picturePreview = fileList[0].urlRoot;
            }

            const articleData = {
                ...values,
                content,
                picturePreview,
                authorID: admin.idAdmin || ""
            };

            if (isEditing) {
                await articleService.update(articleData);
                notification.success({ message: 'Cập nhật bài viết thành công!' });
            } else {
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

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
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
            render: (data) => <Image width={190} height={120} className='rounded-lg' src={URL_SERVER + data} />
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

    const filteredArticles = articles.filter(article => {
        const titleMatch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = categories.find(category => category.cateID === article.cateArtID)
            ?.cateName.toLowerCase().includes(searchTerm.toLowerCase());

        return titleMatch || categoryMatch;  // Trả về bài viết nếu tiêu đề hoặc thể loại có chứa từ khóa tìm kiếm
    });

    

    const handleSearch = (value) => {
        setSearchTerm(value);  // Xử lý khi nhấn nút tìm kiếm hoặc Enter
    };

    return (
        <div>
            <div className='flex justify-between'>

                <h1 className="text-xl font-bold mb-4">Quản Lý Bài Viết</h1>
                <Input.Search
                    placeholder="Tìm kiếm theo tiêu đề hoặc thể loại"
                   
                    onSearch={handleSearch}  // Xử lý khi nhấn Enter hoặc click vào nút tìm kiếm
                    enterButton={<SearchOutlined />}
                    style={{ marginBottom: 16, width: 300 }}
                />
            </div>
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
                dataSource={filteredArticles}  // Sử dụng dữ liệu phân trang
                rowKey="articleID"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    pageSizeOptions: [3, 10, 20, 50, 100],
                    showSizeChanger: true,  // Cho phép thay đổi số lượng bài viết mỗi trang
                }}
                onChange={handleTableChange}  // Cập nhật phân trang khi thay đổi trang
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
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={() => false}
                        >
                            {fileList.length < 1 && (
                                <div className='block'>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                            )}
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
