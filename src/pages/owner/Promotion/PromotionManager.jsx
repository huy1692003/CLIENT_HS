import React, { memo, useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, notification, Space, Tag, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import promotionService from '../../../services/promotionService';
import moment from 'moment';
import { useRecoilState } from 'recoil';
import { userState } from '../../../recoil/atom';
import { formatPrice } from '../../../utils/formatPrice';
import dayjs from 'dayjs';
import { convertDateTime, convertTimezoneToVN } from '../../../utils/convertDate';

const PromotionManager = () => {
    const [promotions, setPromotions] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
    const [form] = Form.useForm();
    const [owner] = useRecoilState(userState);

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const data = await promotionService.getAllByOwnwer(owner.idOwner);
            setPromotions(data);
            setFilteredPromotions(data);
            setPagination((prev) => ({ ...prev, total: data.length }));
        } catch (error) {
            notification.error({ message: 'Lỗi khi tải danh sách khuyến mãi' });
        }
    };

    const handleTableChange = (pagination) => {
        setPagination({ current: pagination.current, pageSize: pagination.pageSize });
    };

    const handleSearch = () => {
        const filtered = promotions.filter((promotion) =>
            promotion.discountCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPromotions(filtered);
        setPagination((prev) => ({ ...prev, total: filtered.length, current: 1 }));
    };

    const paginatedData = filteredPromotions.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
    );

    const showModal = (promotion = null) => {
        setIsEditing(!!promotion);
        setIsModalVisible(true);
        if (promotion) {
            form.setFieldsValue({
                prmID: promotion.prmID,
                discountCode: promotion.discountCode,
                discountAmount: promotion.discountAmount,
                description: promotion.description,
                startDate: dayjs(promotion.startDate),
                endDate: dayjs(promotion.endDate),
                ownerID: owner.idOwner,
            });
        } else {
            form.resetFields();
        }
    };

    const handleOk = async (values) => {
        let payload = {
            ...values,
            startDate: convertTimezoneToVN(values.startDate),
            endDate: convertTimezoneToVN(values.endDate),
            ownerID: owner.idOwner,
        };
        try {
            if (isEditing) {
                await promotionService.update(payload);
                notification.success({ message: 'Cập nhật khuyến mãi thành công!' });
            } else {
                await promotionService.add(payload);
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

    const columns = [
        { title: 'ID', dataIndex: 'prmID', key: 'prmID' },
        {
            title: 'Mã Code',
            dataIndex: 'discountCode',
            key: 'discountCode',
            render: (data) => <Tag className="text-xl w-11/12" color="blue-inverse">{data}</Tag>,
        },
        {
            title: 'Giá Trị Giảm Giá',
            dataIndex: 'discountAmount',
            key: 'discountAmount',
            render: (data) => <span className="font-bold text-orange-600">{formatPrice(data)}</span>,
        },
        { title: 'Mô Tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Ngày Bắt Đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => convertDateTime(date),
        },
        {
            title: 'Ngày Kết Thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => convertDateTime(date),
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.prmID)} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">
                Quản Lý Khuyến Mãi
                <Space style={{ marginBottom: 16, float: "right" }}>
                    <Input.Search
                        
                        className='font-semibold'
                        placeholder="Tìm kiếm khuyến mãi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onSearch={handleSearch}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                        Thêm Khuyến Mãi
                    </Button>
                </Space>
            </h1>

            <Table
                columns={columns}
                dataSource={paginatedData}
                rowKey="prmID"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />

            <Modal
                title={isEditing ? "Sửa Khuyến Mãi" : "Thêm Khuyến Mãi"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form form={form} onFinish={handleOk} layout="vertical">
                    {isEditing && (
                        <Form.Item label="Mã Khuyến Mãi" name="prmID">
                            <Input disabled />
                        </Form.Item>
                    )}
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
                        <DatePicker showTime format="DD-MM-YYYY HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Ngày Kết Thúc"
                        name="endDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                    >
                        <DatePicker showTime format="DD-MM-YYYY HH:mm" style={{ width: '100%' }} />
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

export default memo(PromotionManager);
