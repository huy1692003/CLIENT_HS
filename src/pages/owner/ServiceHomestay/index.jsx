import React, { memo, useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, notification, Space, Tag, Upload, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import serviceHomestayService from '../../../services/serviceHomestayService';
import { useRecoilState } from 'recoil';
import { userState } from '../../../recoil/atom';
import { formatPrice } from '../../../utils/formatPrice';
import { uploadService } from '../../../services/uploadService';
import { URL_SERVER } from '../../../constant/global';

const ServiceHomestay = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });
    const [form] = Form.useForm();
    const [owner] = useRecoilState(userState);
    const [fileList, setFileList] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await serviceHomestayService.getAllServices(owner.idOwner);
            setServices(data);
            setFilteredServices(data);
            setPagination(prev => ({
                ...prev,
                total: data.length,
                current: 1
            }));
        } catch (error) {
            notification.error({ message: 'Lỗi khi tải danh sách dịch vụ' });
        }
    };

    const handleTableChange = (paginationConfig) => {
        setPagination({
            current: paginationConfig.current,
            pageSize: paginationConfig.pageSize,
            total: filteredServices.length
        });
    };

    const handleSearch = () => {
        const filtered = services.filter((service) =>
            service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredServices(filtered);
        setPagination(prev => ({
            ...prev,
            total: filtered.length,
            current: 1
        }));
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const showModal = (service = null) => {
        setIsEditing(!!service);
        setIsModalVisible(true);
        setFileList([]);
        setImagePreview(null);

        if (service) {
            form.setFieldsValue({
                serviceID: service.serviceID,
                serviceName: service.serviceName,
                description: service.description,
                price: service.price,
                unit: service.unit,
                ownerID: owner.idOwner,
            });

            if (service.imagePreview) {
                setImagePreview(service.imagePreview);
            }
        } else {
            form.resetFields();
            form.setFieldsValue({
                ownerID: owner.idOwner,
            });
        }
    };

    const handleOk = async (values) => {
        try {
            let imageUrl = '';

            if (fileList.length > 0) {
                const uploadedImages = await uploadService.upload(fileList);
                imageUrl = uploadedImages[0] || '';
            }

            const serviceData = {
                ...values,
                imagePreview: imageUrl || imagePreview || ''
            };

            if (isEditing) {
                await serviceHomestayService.updateService(serviceData);
                notification.success({ message: 'Cập nhật dịch vụ thành công!' });
            } else {
                await serviceHomestayService.addService(serviceData);
                notification.success({ message: 'Thêm dịch vụ thành công!' });
            }
            fetchServices();
            setIsModalVisible(false);
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra!' });
        }
    };

    const handleDelete = async (serviceID) => {
        try {
            await serviceHomestayService.deleteService(serviceID);
            notification.success({ message: 'Xóa dịch vụ thành công!' });
            fetchServices();
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa dịch vụ!' });
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'serviceID', key: 'serviceID' },
        {
            title: 'Hình ảnh',
            dataIndex: 'imagePreview',
            key: 'imagePreview',
            render: (imagePreview) => (
                imagePreview ?
                    <Image
                        src={URL_SERVER + imagePreview}
                        alt="Hình ảnh dịch vụ"
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover' }}
                    /> :
                    <div className="text-gray-400">Không có ảnh</div>
            ),
        },
        {
            title: 'Tên Dịch Vụ',
            dataIndex: 'serviceName',
            key: 'serviceName',
            render: (text) => <span className="font-semibold">{text}</span>,
        },
        { title: 'Mô Tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => <span className="font-bold text-orange-600">{formatPrice(price)}</span>,
        },
        {
            title: 'Đơn Vị',
            dataIndex: 'unit',
            key: 'unit',
            render: (unit) => <Tag color="blue">{unit}</Tag>,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            ),
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.serviceID)} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">
                Quản Lý Dịch Vụ
                <Space style={{ marginBottom: 16, float: "right" }}>
                    <Input.Search
                        className='font-semibold'
                        placeholder="Tìm kiếm dịch vụ..."
                        value={searchTerm}
                        allowClear
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onSearch={handleSearch}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                        Thêm dịch vụ
                    </Button>
                </Space>
            </h1>

            <Table
                columns={columns}
                dataSource={filteredServices}
                rowKey="serviceID"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} dịch vụ`,
                    pageSizeOptions: ['5', '10', '20', '50'],
                }}
                onChange={handleTableChange}
            />

            <Modal
                title={isEditing ? "Sửa dịch vụ" : "Thêm dịch vụ"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form form={form} onFinish={handleOk} layout="vertical">
                    {isEditing && (
                        <Form.Item label="Mã dịch vụ" name="serviceID">
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item name="ownerID" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tên Dịch Vụ"
                        name="serviceName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mô Tả"
                        name="description"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Đơn Vị"
                        name="unit"
                        rules={[{ required: true, message: 'Vui lòng nhập đơn vị tính!' }]}
                    >
                        <Input placeholder="VD: Giờ, Ngày, Lần..." />
                    </Form.Item>
                    <Form.Item label="Hình ảnh dịch vụ">
                        {imagePreview && (
                            <div className="mb-3">
                                <Image
                                    src={URL_SERVER + imagePreview}
                                    alt="Hình ảnh dịch vụ"
                                    width={200}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        )}
                        <Upload
                            accept=".jpg,.png,.webp,.jpeg"
                            listType="picture"
                            maxCount={1}
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                        </Upload>
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

export default memo(ServiceHomestay);