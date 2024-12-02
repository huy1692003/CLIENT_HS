import React, { memo, useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, notification, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import promotionService from '../../../services/promotionService'; // Đảm bảo đường dẫn đúng với dịch vụ của bạn
import moment from 'moment';
import { useRecoilSnapshot, useRecoilState } from 'recoil';
import { userState } from '../../../recoil/atom';
import { formatPrice } from '../../../utils/formatPrice';

const PromotionManager = () => {
    const [promotions, setPromotions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [form] = Form.useForm();
    const [owner, _] = useRecoilState(userState)

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const data = await promotionService.getAll(); // Gọi API để lấy danh sách khuyến mãi
            setPromotions(data);
        } catch (error) {
            notification.error({ message: 'Lỗi khi tải danh sách khuyến mãi' });
        }
    };

    const showModal = (promotion = null) => {
        setIsEditing(!!promotion);
        setIsModalVisible(true);

        if (promotion) {
            form.setFieldsValue({
                prmID: promotion.prmID,
                discountCode: promotion.discountCode,
                discountAmount: promotion.discountAmount,
                description: promotion.description,
                startDate: promotion.startDate,
                endDate: promotion.endDate,
                ownerID: promotion.ownerID,
            });
        } else {
            form.resetFields();
        }
    };

    const handleOk = async (values) => {
        try {
            if (isEditing) {
                await promotionService.update(values);
                notification.success({ message: 'Cập nhật khuyến mãi thành công!' });
            } else {
                await promotionService.add(values);
                notification.success({ message: 'Thêm khuyến mãi thành công!' });
            }
            fetchPromotions();
            setIsModalVisible(false);
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra!' });
        }
    };

    const handleDelete = async (prmID) => {
        try {
            await promotionService.delete(prmID);
            notification.success({ message: 'Xóa khuyến mãi thành công!' });
            fetchPromotions();
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa khuyến mãi!' });
        }
    };

    const filteredPromotions = promotions.filter(promotion =>
        promotion.discountCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">
                Quản Lý Khuyến Mãi
                <Space style={{ marginBottom: 16, float: "right" }}>
                    <Input
                        placeholder="Tìm kiếm khuyến mãi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                    >
                        Thêm Khuyến Mãi
                    </Button>
                </Space>
            </h1>

            <Table
                columns={[
                    { title: 'Mã Khuyến Mãi', dataIndex: 'prmID', key: 'prmID' },
                    { title: 'Mã Giảm Giá', dataIndex: 'discountCode', key: 'discountCode', render: (data) => <Tag className='text-xl w-11/12' color="blue-inverse">{data}</Tag> },
                    { title: 'Giá Trị Giảm Giá', dataIndex: 'discountAmount', key: 'discountAmount', render: (data) => <span className='font-bold text-orange-600'>{formatPrice(data)}</span> },
                    { title: 'Mô Tả', dataIndex: 'description', key: 'description' },
                    { title: 'Ngày Bắt Đầu', dataIndex: 'startDate', key: 'startDate', render: (date) => new Date(date).toLocaleDateString() },
                    { title: 'Ngày Kết Thúc', dataIndex: 'endDate', key: 'endDate', render: (date) => new Date(date).toLocaleDateString() },
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
                                    onClick={() => handleDelete(record.prmID)}
                                />
                            </Space>
                        ),
                    },
                ]}
                dataSource={filteredPromotions}
                rowKey="prmID"
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title={isEditing ? "Sửa Khuyến Mãi" : "Thêm Khuyến Mãi"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    onFinish={handleOk}
                    layout="vertical"
                >
                    {isEditing && <Form.Item
                        label="Mã Khuyến Mãi"
                        name="prmID"
                    >
                        <Input disabled />
                    </Form.Item>}
                    <Form.Item
                        label="Mã Giảm Giá"
                        name="discountCode"
                        rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Giá Trị Giảm Giá"
                        name="discountAmount"
                        rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm giá!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Mô Tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Ngày Bắt Đầu"
                        name="startDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item
                        label="Ngày Kết Thúc"
                        name="endDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    {
                        <Form.Item
                            hidden
                            initialValue={owner.idOwner}
                            label="Mã Chủ Sở Hữu"
                            name="ownerID"
                            rules={[{ required: true, message: 'Vui lòng nhập mã chủ sở hữu!' }]}
                        >
                            <Input />
                        </Form.Item>
                    }
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
export default memo(PromotionManager)