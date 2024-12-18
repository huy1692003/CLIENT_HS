import React, { memo, useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useRecoilValue } from 'recoil';
import { adminState } from '../../../recoil/atom';
import FAQService from '../../../services/faqService';

const FAQManager = () => {
    const [faqs, setFaqs] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const admin = useRecoilValue(adminState);  // Lấy thông tin admin
    const [pagination, setPagination] = useState({
        current: 1,      // Trang hiện tại
        pageSize: 5,     // Số câu hỏi mỗi trang
        total: 0,        // Tổng số câu hỏi
    });
    const [searchTerm, setSearchTerm] = useState('');  // Từ khóa tìm kiếm

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            const data = await FAQService.getAll();  // Lấy tất cả dữ liệu FAQ từ API
            setFaqs(data);
            setPagination(prev => ({
                ...prev,
                total: data.length,  // Cập nhật tổng số câu hỏi
            }));
        } catch (error) {
            notification.error({ message: 'Không thể tải dữ liệu câu hỏi thường gặp!' });
        }
    };

    const handleTableChange = (pagination) => {
        setPagination({
            ...pagination,
        });
    };

    const currentFAQs = faqs.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
    );

    const showModal = (faq = null) => {
        setIsEditing(!!faq);
        setIsModalVisible(true);

        // Reset form values khi mở modal
        if (faq) {
            form.setFieldsValue({
                faqID: faq.faqID,
                question: faq.question,
                answer: faq.answer,
            });
        } else {
            form.resetFields();
        }
    };

    const handleOk = async (values) => {
        try {
            const faqData = {
                ...values,
                authorID: admin.idAdmin || ""  // Lấy ID admin từ Recoil
            };

            if (isEditing) {
                await FAQService.update(faqData);  // Cập nhật FAQ
                notification.success({ message: 'Cập nhật FAQ thành công!' });
            } else {
                await FAQService.add(faqData);  // Thêm FAQ mới
                notification.success({ message: 'Thêm FAQ thành công!' });
            }
            fetchFAQs();  // Tải lại danh sách FAQ
            setIsModalVisible(false);
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra!' });
        }
    };

    const handleDelete = async (faqID) => {
        try {
            await FAQService.delete(faqID);
            notification.success({ message: 'Xóa FAQ thành công!' });
            fetchFAQs();  // Tải lại danh sách FAQ
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa FAQ!' });
        }
    };

    const columns = [
        {
            title: 'Câu Hỏi',
            dataIndex: 'question',
            key: 'question',
        },
        {
            title: 'Trả Lời',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.faqID)} />
                </Space>
            ),
        },
    ];

    const filteredFAQs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = (value) => {
        setSearchTerm(value);  // Cập nhật từ khóa tìm kiếm
    };

    return (
        <div>
            <div className='flex justify-between'>
                <h1 className="text-xl font-bold mb-4">Quản Lý Câu Hỏi Thường Gặp</h1>
                <Input.Search
                    placeholder="Tìm kiếm theo câu hỏi hoặc trả lời"
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
                Thêm Câu Hỏi
            </Button>
            <Table
                columns={columns}
                dataSource={filteredFAQs}  // Sử dụng dữ liệu đã lọc
                rowKey="faqID"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    pageSizeOptions: [5, 10, 20],
                    showSizeChanger: true,  // Cho phép thay đổi số lượng câu hỏi mỗi trang
                }}
                onChange={handleTableChange}  // Cập nhật phân trang khi thay đổi trang
            />
            <Modal
                title={isEditing ? "Cập Nhật Câu Hỏi" : "Thêm Câu Hỏi"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
            >
                <Form form={form} onFinish={handleOk} layout="vertical">
                    {isEditing && (
                        <Form.Item
                            label="ID Câu Hỏi"
                            name="faqID"
                        >
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Câu Hỏi"
                        name="question"
                        rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Trả Lời"
                        name="answer"
                        rules={[{ required: true, message: 'Vui lòng nhập câu trả lời!' }]}
                    >
                        <Input.TextArea rows={4} />
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

export default memo(FAQManager);
