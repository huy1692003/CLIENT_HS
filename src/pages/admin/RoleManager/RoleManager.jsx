import React, { memo, useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, notification, Space, Popconfirm, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import roleService from '../../../services/roleService';
import menuService from '../../../services/menuService';
import { useNavigate } from 'react-router-dom';

const RoleManager = () => {
    const [roles, setRoles] = useState([]);
    const [menus, setMenus] = useState([]);
    const [isRoleModalVisible, setIsRoleModalVisible] = useState(false); // Modal cho thêm/sửa chức vụ
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false); // Modal cho gán menu
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm(); // Khởi tạo form
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [roleForMenu, setRoleForMenu] = useState(null); // Lưu role đang được gán menu
    const [selectedMenus, setSelectedMenus] = useState([]); // Lưu danh sách menu được chọn
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoles();
        fetchMenus(); // Lấy danh sách menu
    }, []);

    const fetchRoles = async () => {
        try {
            const data = await roleService.getAll(); // Gọi API để lấy danh sách chức vụ
            setRoles(data);
        } catch (error) {
            
            notification.error({ message: 'Lỗi khi tải danh sách chức vụ' });
        }
    };

    const fetchMenus = async () => {
        try {
            const data = await menuService.getAll(); // Gọi API để lấy danh sách menu
            setMenus(data);
        } catch (error) {
            notification.error({ message: 'Lỗi khi tải danh sách menu' });
        }
    };

    const showRoleModal = (role = null) => {
        setIsEditing(!!role);
        setIsRoleModalVisible(true);

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

    const showGranMenu = (role) => {
        setRoleForMenu(role);
        setSelectedMenus(role.listMenus || []); // Lấy danh sách menu hiện tại của role
        setIsMenuModalVisible(true);
    };

    const handleOk = async (values) => {
        try {
            if (isEditing) {
                // Sửa chức vụ
                await roleService.update(values);
                notification.success({ message: 'Sửa chức vụ thành công!' });
            } else {
                // Thêm chức vụ
                await roleService.create(values);
                notification.success({ message: 'Thêm chức vụ thành công!' });
            }
            fetchRoles(); // Tải lại danh sách chức vụ
            setIsRoleModalVisible(false);
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra!' });
        }
    };

    const handleDelete = async (roleID) => {
        try {
            await roleService.delete(roleID);
            notification.success({ message: 'Xóa chức vụ thành công!' });
            fetchRoles(); // Tải lại danh sách chức vụ
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa chức vụ!' });
        }
    };

    const handleDeleteMultiple = async () => {
        try {
            // Gọi API để xóa nhiều chức vụ
            await Promise.all(selectedRowKeys.map(roleID => roleService.delete(roleID)));
            notification.success({ message: `Đã xóa ${selectedRowKeys.length} chức vụ thành công!` });
            setSelectedRowKeys([]); // Reset selection
            fetchRoles(); // Tải lại danh sách
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi xóa các chức vụ!' });
        }
    };

    const handleGrandMenu = async () => {
        try {
            await roleService.grandMenu(roleForMenu.roleID, selectedMenus);
            notification.success({ message: 'Gán menu thành công!' });
            setIsMenuModalVisible(false);
            fetchRoles(); // Tải lại danh sách chức vụ
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra khi gán menu!' });
        }
    };

    const handleMenuChange = (checkedValues) => {
        setSelectedMenus(checkedValues); // Cập nhật danh sách menu đã chọn
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
                Quản Lý chức vụ
                <Space style={{ marginBottom: 16, float: "right" }}>
                    <Input
                        placeholder="Tìm kiếm chức vụ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showRoleModal()}
                    >
                        Thêm chức vụ
                    </Button>
                    <Button
                        type="primary"
                        className="bg-green-700 text-white"
                        icon={<MenuOutlined />}
                        onClick={() => navigate("/admin/menu-manager")}
                    >
                        Quản lý Menu
                    </Button>

                    {selectedRowKeys.length > 0 && (
                        <Popconfirm
                            title={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} chức vụ đã chọn?`}
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
                    { title: 'Tên chức vụ', dataIndex: 'nameRole', key: 'nameRole' },
                 
                    {
                        title: 'Hành Động',
                        key: 'action',
                        render: (text, record) => (
                            <Space size="middle">
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => showRoleModal(record)}
                                />
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa chức vụ này?"
                                    onConfirm={() => handleDelete(record.roleID)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button icon={<DeleteOutlined />} />
                                </Popconfirm>
                                <Button
                                    type='primary'
                                    icon={<MenuOutlined />}
                                    onClick={() => showGranMenu(record)}
                                >
                                    Gán Menu
                                </Button>
                            </Space>
                        ),
                    },
                ]}
                dataSource={filteredRoles}
                rowKey="roleID"
                pagination={{ pageSize: 5 }}
            />

            {/* Modal để thêm/sửa chức vụ */}
            <Modal
                title={isEditing ? "Sửa chức vụ" : "Thêm chức vụ"}
                visible={isRoleModalVisible}
                onCancel={() => setIsRoleModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleOk}
                    layout="vertical"
                >
                    {isEditing && (
                        <Form.Item
                            label="Mã chức vụ"
                            name="roleID"
                        >
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Tên chức vụ"
                        name="nameRole"
                        rules={[{ required: true, message: 'Vui lòng nhập tên chức vụ!' }]} >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditing ? "Cập Nhật" : "Thêm"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal để gán menu */}
            <Modal
                title="Gán Menu"
                visible={isMenuModalVisible && roleForMenu}
                onCancel={() => setIsMenuModalVisible(false)}
                onOk={handleGrandMenu}
            >
                <Table
                    rowKey="menuID"
                    dataSource={menus}
                    pagination={false}
                    columns={[
                        {
                            title: 'Chọn',
                            key: 'select',
                            render: (_, menu) => (
                                <Checkbox
                                    value={menu.menuID}
                                    checked={selectedMenus.includes(menu.menuID)} // Kiểm tra xem menu có được chọn không
                                    onChange={(e) => handleMenuChange(e.target.checked ? [...selectedMenus, menu.menuID] : selectedMenus.filter(id => id !== menu.menuID))} // Cập nhật khi checkbox thay đổi
                                />
                            ),
                        },
                        {
                            title: 'Tên Menu',
                            dataIndex: 'name',
                            key: 'name',
                        },
                    ]}
                />
            </Modal>
        </div>
    );
};

export default memo(RoleManager);
