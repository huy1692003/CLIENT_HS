import React, { memo, useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, notification, Space, Popconfirm, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import settingService from '../../../services/settingService';

const SettingManager = () => {
    const [settings, setSettings] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const { Option } = Select;

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await settingService.getAll();
            console.log(data);
            setSettings(data);
        } catch (error) {
            notification.error({ message: 'Lỗi khi tải danh sách cài đặt' });
        }
    };

    const showModal = (setting = null) => {
        setIsEditing(!!setting);
        setIsModalVisible(true);

        if (setting) {
            form.setFieldsValue({
                id: setting.id,
                key: setting.key,
                value: setting.value,
                valueType: setting.valueType,
                description: setting.description,
                isActive: setting.isActive
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                isActive: true
            });
        }
    };

    const handleOk = async (values) => {
        try {
            if (isEditing) {
                await settingService.update(values);
                notification.success({ message: 'Cập nhật cài đặt thành công!' });
            } else {
                await settingService.create(values);
                notification.success({ message: 'Thêm cài đặt thành công!' });
            }
            fetchSettings();
            setIsModalVisible(false);
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra!' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await settingService.delete(id);
            notification.success({ message: 'Xóa cài đặt thành công!' });
            fetchSettings();
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa cài đặt!' });
        }
    };

    const handleDeleteMultiple = async () => {
        try {
            await Promise.all(selectedRowKeys.map(id => settingService.delete(id)));
            notification.success({ message: `Đã xóa ${selectedRowKeys.length} cài đặt thành công!` });
            setSelectedRowKeys([]);
            fetchSettings();
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa các cài đặt!' });
        }
    };

    const filteredSettings = settings.filter(setting =>
        setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (setting.description && setting.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">
                Quản Lý Cài Đặt Hệ Thống
                <Space style={{ marginBottom: 16, float: "right" }}>
                    <Input
                        placeholder="Tìm kiếm cài đặt..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                    >
                        Thêm cài đặt
                    </Button>

                    {selectedRowKeys.length > 0 && (
                        <Popconfirm
                            title={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} cài đặt đã chọn?`}
                            onConfirm={handleDeleteMultiple}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button type="primary" danger>
                                Xóa {selectedRowKeys.length} mục đã chọn
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            </h1>

            <Table
                rowSelection={rowSelection}
                columns={[
                    {
                        title: 'STT',
                        key: 'index',
                        render: (text, record, index) => index + 1,
                        width: '60px'
                    },
                    { title: 'Khóa', dataIndex: 'key', key: 'key' },
                    { title: 'Giá trị', dataIndex: 'value', key: 'value' },
                    { title: 'Kiểu dữ liệu', dataIndex: 'valueType', key: 'valueType' },
                    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
                    {
                        title: 'Trạng thái',
                        dataIndex: 'isActive',
                        key: 'isActive',
                        render: (isActive) => (
                            <Tag color={isActive ? 'green' : 'red'}>
                                {isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </Tag>
                        )
                    },
                    {
                        title: 'Hành Động',
                        key: 'action',
                        render: (text, record) => (
                            <Space size="middle">
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => showModal(record)}
                                />
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa cài đặt này?"
                                    onConfirm={() => handleDelete(record.id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button icon={<DeleteOutlined />} danger />
                                </Popconfirm>
                            </Space>
                        ),
                    },
                ]}
                dataSource={filteredSettings}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={isEditing ? "Sửa cài đặt" : "Thêm cài đặt mới"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleOk}
                    layout="vertical"
                >
                    {isEditing && (
                        <Form.Item
                            name="id"
                            hidden
                        >
                            <Input />
                        </Form.Item>
                    )}
                    
                    <Form.Item
                        label="Key"
                        name="key"
                        rules={[{ required: true, message: 'Vui lòng nhập khóa!' }]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        label="Value"
                        name="value"
                        rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        label="Kiểu dữ liệu"
                        name="valueType"
                        rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu!' }]}
                    >
                        <Select>
                            <Option value="string">Chuỗi (String)</Option>
                            <Option value="number">Số (Number)</Option>
                            <Option value="boolean">Boolean</Option>
                            <Option value="date">Ngày tháng (Date)</Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    
                    <Form.Item
                        label="Trạng thái"
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Select>
                            <Option value={true}>Hoạt động</Option>
                            <Option value={false}>Không hoạt động</Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditing ? "Cập nhật" : "Thêm mới"}
                        </Button>
                        <Button 
                            style={{ marginLeft: 8 }} 
                            onClick={() => setIsModalVisible(false)}
                        >
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default memo(SettingManager);
