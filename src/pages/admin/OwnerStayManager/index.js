import { Table, Tag, Button, Popconfirm, Tooltip, Input, Space, notification, Modal, Form, Input as AntdInput } from "antd";
import { DeleteOutlined, LockOutlined, UnlockOutlined, MailOutlined, CloseOutlined } from "@ant-design/icons";
import React, { useState, useEffect, memo } from "react";
import UserService from "../../../services/userService";
import { convertDate, convertDateTime } from "../../../utils/convertDate";

const OwnerManager = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Khởi tạo state cho tìm kiếm
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [emailContent, setEmailContent] = useState({
        title: "",
        content: "",
        emailTo: "",
        idOwner:""
    });

    // Gọi API để lấy danh sách người dùng
    const fetchUsers = async () => {
        const response = await UserService.getOwnerStay();
        setUsers(response);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Xử lý khóa người dùng
    const handleToggleStatus = async (userID, statusCurrend) => {
        await UserService.updateStatus(userID, statusCurrend === 1 ? 0 : 1);
        notification.success({ message: "Cập nhật trạng thái thành công" });
        fetchUsers();
    };

    // Mở modal gửi email
    const showSendMailModal = (emailTo,idOwner) => {
        console.log(idOwner)
        setEmailContent({
            ...emailContent,
            emailTo,
            title: "",
            content: "",
            idOwner:idOwner
        });
        setIsModalVisible(true);
    };

    // Xử lý gửi email
    const handleSendMail = async () => {
        const mailContent = {
            title: emailContent.title,
            content: emailContent.content,
            emailTo: emailContent.emailTo
        };
        console.log(emailContent.idOwner)
        try {
            await UserService.sendMailOwner(emailContent.idOwner,mailContent);
            notification.success({ message: "Gửi email thành công" });
            setIsModalVisible(false);
        } catch (error) {
            notification.error({ message: "Gửi email thất bại", description: error.message });
        }
    };

    // Xử lý xóa người dùng
    const handleDelete = async (idOwner) => {
        try {
            await UserService.deleteOwner(idOwner);
            notification.success({ message: "Hủy hợp tác thành công" });
            fetchUsers();
        } catch (error) {
            notification.error({ message: "Hủy hợp tác thất bại", description: error.message });
        }
    };

    // Cấu hình các cột cho bảng
    const columns = [
        {
            title: "Tài khoản",
            key: "username",
            render: (text, record) => record.user?.username || "Trống",
        },
        {
            title: "Họ tên",
            key: "fullName",
            render: (text, record) => record.user?.fullName || "Trống",
        },
        {
            title: "Email",
            key: "email",
            render: (text, record) => record.user?.email || "Trống",
        },
        {
            title: "Số điện thoại",
            key: "phoneNumber",
            render: (text, record) => record.user?.phoneNumber || "Trống",
        },
        {
            title: "Địa chỉ",
            key: "address",
            render: (text, record) => record.user?.address || "Trống",
        },
        {
            title: "Loại tài khoản",
            dataIndex: "user.typeUser", // Dùng thuộc tính typeUser trong user
            key: "typeUser",
            render: (role) => "Chủ Homestay",
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (text) => (
                <Tag bordered={false} color={text.user.status === 1 ? "success" : "error"}>
                    {text.user.status === 1 ? "Hoạt động" : "Đã khóa"}
                </Tag>
            ),
        },
        {
            title: "Thời gian tham gia",
            dataIndex: "timePart", // Dùng thuộc tính timePart
            key: "timePart",
            render: (text) => (convertDate(text)), // Chuyển đổi thời gian thành chuỗi
        },
        {
            title: "Thao tác",
            key: "action",
            render: (text, record) => (
                <Space>
                    <Tooltip title={record.user.status === 1 ? "Khóa" : "Kích hoạt"}>
                        <Button
                            type={record.user.status === 1 ? "default" : "primary"}
                            icon={record.user.status === 1 ? <LockOutlined /> : <UnlockOutlined />}
                            onClick={() => handleToggleStatus(record.user.userID, record.user.status)}
                        />
                    </Tooltip>

                    <Tooltip title="Gửi email">
                        <Button
                            type="default"
                            icon={<MailOutlined />}
                            onClick={() => showSendMailModal(record.user.email,record.idOwner)}
                        />
                    </Tooltip>

                    
                </Space>
            ),
        },
    ];

    // Lọc danh sách người dùng dựa trên từ khóa tìm kiếm
    const filteredUsers = users.filter(
        (user) =>
            user.user.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            user.user.fullName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            user.user.email?.toLowerCase().includes(searchTerm?.toLowerCase())
    );

    return (
        <div>
            <h3 className="text-xl font-bold mb-5">
                Quản lý đối tác
                <Space style={{ float: "right", marginBottom: 16 }}>
                    <Input
                        style={{ width: 400 }}
                        placeholder="Tìm kiếm đối tác..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Space>
            </h3>

            <Table
                columns={columns}
                dataSource={filteredUsers}
                bordered
                rowKey="user.userID" // Dùng userID của user để làm key
                pagination={{ pageSize: 5 }}
            />

            {/* Modal gửi email */}
            <Modal
                title="Gửi email cho người dùng"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSendMail}
                okText="Gửi"
            >
                <Form layout="vertical">
                    <Form.Item label="Tiêu đề" required>
                        <AntdInput
                            value={emailContent.title}
                            onChange={(e) => setEmailContent({ ...emailContent, title: e.target.value })}
                            placeholder="Nhập tiêu đề email"
                        />
                    </Form.Item>
                    <Form.Item label="Nội dung" required>
                        <AntdInput.TextArea
                            value={emailContent.content}
                            onChange={(e) => setEmailContent({ ...emailContent, content: e.target.value })}
                            placeholder="Nhập nội dung email"
                            rows={4}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default memo(OwnerManager);
