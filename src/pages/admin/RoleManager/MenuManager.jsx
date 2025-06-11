import React, { memo, useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, notification, Space, Popconfirm, Select, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LogoutOutlined } from '@ant-design/icons';
import menuService from '../../../services/menuService';
import { useNavigate } from 'react-router-dom';

const MenuManager = () => {
    const [menus, setMenus] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm(); // Khởi tạo form
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const data = await menuService.getAll(); // Gọi API để lấy danh sách menu
            setMenus(data);
        } catch (error) {
            notification.error({ message: 'Lỗi khi tải danh sách menu' });
        }
    };

    const showModal = (menu = null) => {
        setIsEditing(!!menu);
        setIsModalVisible(true);

        // Reset form values khi mở modal
        if (menu) {
            form.setFieldsValue({
                menuID: menu.menuID||0,
                name: menu.name,
                url: menu.url,
                icon: menu.icon,
                parentMenuID: menu.parentMenuID,
                sort:menu.sort
            });
        } else {
            form.resetFields();
        }
    };

    const handleOk = async (values) => {
        try {
            if (isEditing) {
                // Sửa menu
                await menuService.update(values.menuID, values);
                notification.success({ message: 'Sửa menu thành công!' });
            } else {
                // Thêm menu
                await menuService.create(values);
                notification.success({ message: 'Thêm menu thành công!' });
            }
            fetchMenus(); // Tải lại danh sách menu
            setIsModalVisible(false);
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra!' });
        }
    };

    const handleDelete = async (menuID) => {
        try {
            await menuService.delete(menuID);
            notification.success({ message: 'Xóa menu thành công!' });
            fetchMenus(); // Tải lại danh sách menu
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa menu!' });
        }
    };

    const handleDeleteMultiple = async () => {
        try {
            // Gọi API để xóa nhiều menu
            await Promise.all(selectedRowKeys.map(menuID => menuService.delete(menuID)));
            notification.success({ message: `Đã xóa ${selectedRowKeys.length} menu thành công!` });
            setSelectedRowKeys([]); // Reset selection
            fetchMenus(); // Tải lại danh sách
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa các menu!' });
        }
    };

    const filteredMenus = menus.filter(menu =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">
                Quản Lý Menu
                <Space style={{ marginBottom: 16, float: "right" }}>
                    <Input
                        className='font-semibold'
                        placeholder="Tìm kiếm menu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                    >
                        Thêm Menu
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={() => navigate("/admin/role-manager")}
                    >
                        Quay lại
                    </Button>
                    {selectedRowKeys.length > 0 && (
                        <Popconfirm
                            title={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} menu đã chọn?`}
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
                    { title: 'Tên Menu', dataIndex: 'name', key: 'name' },
                    { title: 'URL', dataIndex: 'url', key: 'url' },
                    {
                        title: 'Menu Cha',
                        key: 'parentMenu',
                        render: (text, record) => {
                            const parentMenu = menus.find(menu => menu.menuID === record.parentMenuID);
                            return parentMenu ? parentMenu.name : 'Không có';
                        },
                    },
                    {
                        title: 'Icon',
                        key: 'icon', // Tạo cột icon
                        render: (text, record) => (
                            <Space>
                                {/* Hiển thị icon từ class */}
                                {record.icon ? (
                                    <i className={record.icon} />
                                ) : (
                                 "" 
                                )}
                            </Space>
                        ),
                    },
                    {
                        title: 'Đường dẫn',
                        key: 'url', // Tạo cột icon
                        render: (text, record) => (
                           <span>{record.url}</span>
                        ),
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
                                <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDelete(record.menuID)}
                                />
                            </Space>
                        ),
                    },
                ]}
                dataSource={filteredMenus}
                rowKey="menuID"
                pagination={{ pageSize: 8 }}
            />
            <Modal
                title={isEditing ? "Sửa Menu" : "Thêm Menu"}
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
                            label="Mã Menu"
                            name="menuID"
                        >
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Tên Menu"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên menu!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="URL"
                        name="url"
                       >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Icon"
                        name="icon"
                     
                    >
                        <Input placeholder="Nhập class của icon, ví dụ: 'fa fa-home'" />
                    </Form.Item>
                    <Form.Item
                        label="Sắp xếp"
                        name="sort"
                     
                    >
                        <InputNumber className='w-full' placeholder="Sắp xếp" />
                    </Form.Item>
                    <Form.Item
                        label="Menu Cha"
                        name="parentMenuID"
                    >
                        <Select
                            allowClear
                            placeholder="Chọn Menu Cha"
                        >
                            {menus.map(menu => (
                                <Select.Option key={menu.menuID} value={menu.menuID}>
                                    {menu.name}
                                </Select.Option>
                            ))}
                        </Select>
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

export default memo(MenuManager);
