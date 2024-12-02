import React, { memo, useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, notification, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import roleService from '../../../services/roleService';

 const RoleManager = () => {
    const [roles, setRoles] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm(); // Khởi tạo form
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const data = await roleService.getAll(); // Gọi API để lấy danh sách vai trò
            setRoles(data);
        } catch (error) {
            notification.error({ message: 'Lỗi khi tải danh sách vai trò' });
        }
    };

    const showModal = (role = null) => {
        setIsEditing(!!role);
        setIsModalVisible(true);

        // Reset form values khi mở modal
        if (role) {
            form.setFieldsValue({
                roleID: role.roleID,
                nameRole: role.nameRole,
            });
        } else {
            form.resetFields();
        }
    };

    const handleOk = async (values) => {
        try {
            if (isEditing) {
                // Sửa vai trò
                await roleService.update(values);
                notification.success({ message: 'Sửa vai trò thành công!' });
            } else {
                // Thêm vai trò
                await roleService.create(values);
                notification.success({ message: 'Thêm vai trò thành công!' });
            }
            fetchRoles(); // Tải lại danh sách vai trò
            setIsModalVisible(false);
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra!' });
        }
    };

    const handleDelete = async (roleID) => {
        try {
            await roleService.delete(roleID);
            notification.success({ message: 'Xóa vai trò thành công!' });
            fetchRoles(); // Tải lại danh sách vai trò
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa vai trò!' });
        }
    };

    const handleDeleteMultiple = async () => {
        try {
            // Gọi API để xóa nhiều vai trò
            await Promise.all(selectedRowKeys.map(roleID => roleService.delete(roleID)));
            notification.success({ message: `Đã xóa ${selectedRowKeys.length} vai trò thành công!` });
            setSelectedRowKeys([]); // Reset selection
            fetchRoles(); // Tải lại danh sách
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa các vai trò!' });
        }
    };

    const filteredRoles = roles.filter(role =>
        role.nameRole.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">
                Quản Lý Vai Trò
                <Space style={{ marginBottom: 16, float: "right" }}>
                    <Input
                        placeholder="Tìm kiếm vai trò..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                    >
                        Thêm Vai Trò
                    </Button>
                    {selectedRowKeys.length > 0 && (
                        <Popconfirm
                            title={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} vai trò đã chọn?`}
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
                        width: '80px'
                    },                   
                    { title: 'Tên Vai Trò', dataIndex: 'nameRole', key: 'nameRole' },
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
                                    onClick={() => handleDelete(record.roleID)}
                                />
                            </Space>
                        ),
                    },
                ]}
                dataSource={filteredRoles}
                rowKey="roleID"
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title={isEditing ? "Sửa Vai Trò" : "Thêm Vai Trò"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form} // Gán form
                    onFinish={handleOk}
                    layout="vertical"
                >
                    {isEditing && (
                        <Form.Item
                            label="Mã Vai Trò"
                            name="roleID"
                        >
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Tên Vai Trò"
                        name="nameRole"
                        rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
                    >
                        <Input />
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
export default memo(RoleManager)
