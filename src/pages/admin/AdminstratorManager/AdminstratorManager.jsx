import { Table, Tag, Button, Popconfirm, Tooltip, Input, Space, Modal, Form, message, Select, Upload, Image, notification } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect, memo } from "react";
import adminService from "../../../services/adminService";
import roleService from "../../../services/roleService";
import { URL_SERVER } from "../../../constant/global";
import { uploadService } from "../../../services/uploadService";
import createFromData from "../../../utils/createFormData";

/**
 * Component quản lý danh sách quản trị viên
 */
const AdminstratorManager = () => {
    const [admins, setAdmins] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [userEdit, setUserEdit] = useState(null);

    /**
     * Hook gọi API lấy dữ liệu ban đầu
     */
    useEffect(() => {
        fetchAdmins();
        fetchRoles();
    }, []);
    
    
    /**
     * Lấy danh sách quản trị viên từ API
     */
    const fetchAdmins = async () => {
        try {
            const data = await adminService.getAll();
            setAdmins(data);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu quản trị viên");
        }
    };

    /**
     * Lấy danh sách vai trò từ API
     */
    const fetchRoles = async () => {
        try {
            const data = await roleService.getAll();
            setRoles(data);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu vai trò");
        }
    };

    console.log(fileList);
    /**
     * Xử lý khi thay đổi file upload
     */
    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    /**
     * Xử lý submit form thêm/sửa quản trị viên
     * @param {Object} values - Dữ liệu form
     */
    const handleSubmit = async (values) => {
        try {
            let fileImg = fileList?.[0]?.originFileObj;
            if (fileImg) {
                const uploadResult = await uploadService.postSingle(createFromData.single(fileList));
                values.profilePicture = uploadResult.filePath;
            }
            else {
                values.profilePicture = fileList?.[0]?.urlRoot || "";
            }


            form.getFieldValue("userID") ?
                await adminService.update({
                    ...values,
                    userID: userEdit?.userID,
                    password: userEdit?.password,
                    typeUser: 0,
                    status: 1
                }) :
                await adminService.insertAdmin(values);
            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
            fetchAdmins();
            notification.success({
                message: form.getFieldValue("userID") ? "Cập nhật quản trị viên thành công" : "Thêm quản trị viên thành công",
            });
        } catch (error) {
            console.log(error);
            message.error(form.getFieldValue("userID") ? "Lỗi khi cập nhật quản trị viên" : "Lỗi khi thêm quản trị viên");
        }
    };

    /**
     * Cấu hình các cột hiển thị trong bảng
     */
    const columns = [
        {
            title: "Tài khoản",
            dataIndex: ["user", "username"],
            key: "username",
        },
        {
            title: "Họ tên",
            dataIndex: ["user", "fullName"],
            key: "fullName",
        },
        {
            title: "Email",
            dataIndex: ["user", "email"],
            key: "email",
            render: (text) => text || "Trống",
        },
        {
            title: "Số điện thoại",
            dataIndex: ["user", "phoneNumber"],
            key: "phoneNumber",
            render: (text) => text || "Trống",
        },
        {
            title: "Địa chỉ",
            dataIndex: ["user", "address"],
            key: "address",
            render: (text) => text || "Trống",
        },
        {
            title: "Ảnh đại diện",
            dataIndex: ["user", "profilePicture"],
            key: "avatar",
            render: (profilePicture) => profilePicture ? <Image width={50} height={50} className='rounded-full' src={URL_SERVER + profilePicture} /> : <span>Chưa cập nhật</span>
        },
        {
            title: "Vai trò",
            dataIndex: "roleID",
            key: "role",
            render: (roleID) => {
                const role = roles.find(r => r.roleID === roleID);
                return <Tag color="blue">{role ? role.nameRole : "Không xác định"}</Tag>;
            }
        },
        {
            title: "Trạng thái",
            dataIndex: ["user", "status"],
            key: "status",
            render: (status) => (
                <Tag color={status === 1 ? "success" : "error"}>
                    {status === 1 ? "Hoạt động" : "Khóa"}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setUserEdit({
                                    ...record.user,
                                    roleID: record.roleID
                                })
                                form.setFieldsValue({
                                    ...record.user,
                                    roleID: record.roleID
                                });
                                if (record.user.profilePicture) {
                                    setFileList([{
                                        uid: '-1',
                                        name: 'preview.png',
                                        status: 'done',
                                        url: URL_SERVER + record.user.profilePicture,
                                        urlRoot: record.user.profilePicture
                                    }]);
                                }
                                setIsModalVisible(true);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    /**
     * Lọc danh sách admin dựa trên từ khóa tìm kiếm
     */
    const filteredAdmins = admins.filter(admin =>
        admin.user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h3 className="text-xl font-bold mb-5">
                Quản lý quản trị viên
                <Space style={{ float: "right", marginBottom: 16 }}>
                    <Input
                        placeholder="Tìm kiếm ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalVisible(true);
                            setFileList([]);
                        }}
                    >
                        Thêm mới
                    </Button>
                </Space>
            </h3>

            <Table
                columns={columns}
                dataSource={filteredAdmins}
                rowKey={record => record.user.userID}
                bordered
                pagination={{ pageSize: 10 }}
            />

            {/* Add/Edit Modal */}
            <Modal
                title={form.getFieldValue("userID") ? "Chỉnh sửa quản trị viên" : "Thêm quản trị viên mới"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);

                    setFileList([]);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >

                    {form.getFieldValue("userID") && (
                        <Form.Item
                            name="userID"
                            label="Mã ID"

                        >
                            <Input readOnly={form.getFieldValue("userID")} />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input readOnly={form.getFieldValue("userID")} />
                    </Form.Item>
                    {!form.getFieldValue("userID") && (
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="fullName"
                        label="Họ tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="profilePicture"
                        label="Ảnh đại diện"
                    >
                        <Upload
                            accept=".jpg,.png,.webp,.jpeg"
                            listType="picture-card"
                            maxCount={1}
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={() => false}
                        >
                            {fileList.length < 1 && (
                                <div className='block'>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="roleID"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select>
                            {roles.map(role => (
                                <Select.Option key={role.roleID} value={role.roleID}>
                                    {role.nameRole}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {form.getFieldValue("userID") ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default memo(AdminstratorManager);
