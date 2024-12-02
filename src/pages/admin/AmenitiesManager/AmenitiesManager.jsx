import React, { useState, useEffect, memo } from 'react';
import { Table, Input, Button, Modal, Form, notification, message, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import amenitiesService from '../../../services/amenitiesService';

const AmenitiesManager = () => {
    const [form] = Form.useForm(); // Tạo form từ Ant Design
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);

    // Định nghĩa các cột cho bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'amenityID',
            key: 'id',
            render: (text) => <p style={{ width: 100 }}>{text}</p>
        },
        {
            title: 'Tên tiện nghi',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <p style={{ width: 350 }}>{text}</p>
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <span className='inline-block w-1/2'>
                    <Button type='primary' icon={<EditOutlined />} onClick={() => showModal(record)} style={{ marginRight: 10 }} />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa tiện nghi này?"
                        onConfirm={() => handleDelete(record.amenityID)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type='primary' icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </span>
            ),
        },
    ];

    // Hàm gọi API để lấy dữ liệu tiện nghi
    const fetchAmenities = async () => {
        try {
            const amenities = await amenitiesService.getAll();
            setData(amenities);
        } catch (error) {
            message.error('Lỗi khi gọi API: ' + error);
        }
    };

    useEffect(() => {
        fetchAmenities();
    }, []);

    const showModal = (item = null) => {
        setEditItem(item);
        if (item) {
            form.setFieldsValue({ name: item.name });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditItem(null);
    };

    const handleOk = async (values) => {
        try {
            if (editItem) {
                await amenitiesService.update({ ...values, amenityID: editItem.amenityID });
                setData((prev) =>
                    prev.map((item) => item.amenityID === editItem.amenityID ? { ...item, ...values } : item)
                );
                notification.success({ message: "Cập nhật tiện nghi thành công" });
            } else {
                const newAmenity = await amenitiesService.add(values);
                setData((prev) => [...prev, newAmenity]);
                notification.success({ message: "Thêm mới tiện nghi thành công" });
            }
            handleCancel();
        } catch (error) {
            message.error('Lỗi khi thêm/cập nhật tiện nghi: ' + error);
        }
    };

    const handleDelete = async (amenityID) => {
        try {
            await amenitiesService.delete(amenityID);
            setData((prev) => prev.filter((item) => item.amenityID !== amenityID));
            notification.success({ message: "Xóa tiện nghi thành công", description: `Bạn vừa xóa tiện nghi có ID = ${amenityID}` });
        } catch (error) {
            message.error('Lỗi khi xóa tiện nghi: ' + error);
        }
    };

    const filteredData = data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <h3 className="text-2xl font-bold mb-5 flex justify-between">
                <span>Quản lý tiện nghi</span>
                <Input.Search
                    placeholder="Tìm kiếm tiện nghi"
                    onSearch={setSearchTerm}
                    style={{ marginBottom: 20, width: 500 }}
                />
                <Button type="primary" onClick={() => showModal(null)} style={{ marginBottom: 20 }}>
                    Thêm mới
                </Button>
            </h3>
            <Table
                pagination={{ pageSize: 8 }}
                dataSource={filteredData}
                rowKey="amenityID"
                columns={columns}
                bordered
            />
            <Modal
                title={editItem === null ? "Thêm tiện nghi" : "Sửa tiện nghi"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleOk}>
                    <Form.Item
                        name="name"
                        label="Tên tiện nghi"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tiện nghi!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editItem ? "Cập nhật" : "Thêm"}
                        </Button>
                        <Button onClick={handleCancel} style={{ marginLeft: 10 }}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default memo(AmenitiesManager);
