import React, { memo, useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, notification, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import categoryArticleService from '../../../services/categoryArticleService';

 const CategoryArticleManager = () => {
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [form] = Form.useForm(); // Khởi tạo form

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryArticleService.getAll(); // Gọi API để lấy danh sách thể loại
            setCategories(data);
        } catch (error) {
            notification.error({ message: 'Lỗi khi tải danh sách thể loại' });
        }
    };

    const showModal = (category = null) => {
        setIsEditing(!!category);
        setIsModalVisible(true);

        // Reset form values khi mở modal
        if (category) {
            form.setFieldsValue({
                cateID: category.cateID,
                cateName: category.cateName,
                description: category.description,
            });
        } else {
            form.resetFields();
        }
    };

    const handleOk = async (values) => {
        console.log(values)
        try {
            if (isEditing) {
                // Sửa thể loại
                await categoryArticleService.update(values);
                notification.success({ message: 'Sửa thể loại thành công!' });
            } else {
                // Thêm thể loại
                await categoryArticleService.add(values);
                notification.success({ message: 'Thêm thể loại thành công!' });
            }
            fetchCategories(); // Tải lại danh sách thể loại
            setIsModalVisible(false);
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra!' });
        }
    };

    const handleDelete = async (cateID) => {
        try {
            await categoryArticleService.delete(cateID);
            notification.success({ message: 'Xóa thể loại thành công!' });
            fetchCategories(); // Tải lại danh sách thể loại
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa thể loại!' });
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.cateName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div >
            <h1 className="text-xl font-bold mb-4">
                Quản Lý Thể Loại Bài Viết
                <Space style={{ marginBottom: 16, float: "right" }}>
                    <Input
                        placeholder="Tìm kiếm thể loại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                    >
                        Thêm Thể Loại
                    </Button>
                </Space>
            </h1>

            <Table
                columns={[
                    { title: 'Mã Thể Loại', dataIndex: 'cateID', key: 'cateID' },
                    { title: 'Tên Thể Loại', dataIndex: 'cateName', key: 'cateName' },
                    { title: 'Mô Tả', dataIndex: 'description', key: 'description' },
                    {
                        title: 'Hành Động',
                        key: 'action',
                        render: (text, record) => (
                            <Space size="middle">
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => showModal(record)}
                                />
                                <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDelete(record.cateID)}
                                />
                            </Space>
                        ),
                    },
                ]}
                dataSource={filteredCategories}
                rowKey="cateID"
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title={isEditing ? "Sửa Thể Loại" : "Thêm Thể Loại"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form} // Gán form
                    onFinish={handleOk}
                    layout="vertical"
                >
                    {isEditing && <Form.Item
                        label="Mã Thể Loại"
                        name="cateID" >
                        <Input disabled />
                    </Form.Item>}
                    <Form.Item
                        label="Tên Thể Loại"
                        name="cateName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên thể loại!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mô Tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea />
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
export default memo(CategoryArticleManager)
