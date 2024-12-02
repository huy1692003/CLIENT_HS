import { Table, Tag, Button, Popconfirm, Tooltip, Input, Space } from "antd"; // Import thêm Input và Space
import { DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'; // Import các biểu tượng
import React, { useState, useEffect, memo } from "react";
import UserService from "../../../services/userService";

 const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Khởi tạo state cho tìm kiếm

    // Gọi API để lấy danh sách người dùng
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await UserService.getAll(); // Thay URL của API thật vào đây
            setUsers(response);
        };
        fetchUsers();
    }, []);

    // Xử lý xóa người dùng
    const handleDelete = async (userID) => {
        // Gọi API để xóa người dùng
        // await UserService.delete(userID); // Thay đổi để gọi API xóa người dùng
        // setUsers(users.filter(user => user.userID !== userID)); // Cập nhật danh sách người dùng
    };

    // Xử lý khóa người dùng
    const handleToggleStatus = async (userID) => {
        // Gọi API để khóa hoặc kích hoạt người dùng
        // await UserService.toggleStatus(userID); // Thay đổi để gọi API khóa/kích hoạt người dùng
        // const updatedUsers = users.map(user =>
        //     user.userID === userID ? { ...user, status: user.status === 1 ? 0 : 1 } : user
        // );
        // setUsers(updatedUsers); // Cập nhật danh sách người dùng
    };

    // Cấu hình các cột cho bảng
    const columns = [
        {
            title: "Tài khoản",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Họ tên",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text) => text || "Trống", // Hiển thị 'Trống' nếu email là null
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            render: (text) => text || "Trống", // Hiển thị 'Trống' nếu phoneNumber là null
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            render: (text) => text || "Trống", // Hiển thị 'Trống' nếu address là null
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text) => (
                <Tag bordered={false} color={text === 1 ? "success" : "error"}>
                    {text === 1 ? "Kích hoạt" : "Đã khóa"}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (text, record) => (
                <div>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => handleDelete(record.userID)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Tooltip title="Xóa">
                            <Button
                                type="primary"
                                danger // Thay đổi thành `danger` để có màu đỏ
                                size="large" // Thay đổi kích thước nút
                                icon={<DeleteOutlined style={{ fontSize: '16px' }} />} // Tăng kích thước biểu tượng
                                style={{ marginRight: 8, width: 30, height: 30 }}
                            />
                        </Tooltip>
                    </Popconfirm>
                    <Tooltip title={record.status === 1 ? "Khóa" : "Kích hoạt"}>
                        <Button
                            type={record.status === 1 ? "default" : "primary"}
                            size="large" // Thay đổi kích thước nút
                            icon={record.status === 1 ? <LockOutlined style={{ fontSize: '16px' }} /> : <UnlockOutlined style={{ fontSize: '20px' }} />} // Tăng kích thước biểu tượng
                            style={{ width: 30, height: 30, backgroundColor: record.status === 1 ? "#f5222d" : "#52c41a", color: "#fff" }} // Thay đổi màu nền cho nút
                            onClick={() => handleToggleStatus(record.userID)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    // Lọc danh sách người dùng dựa trên từ khóa tìm kiếm
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || // Tìm theo tên đăng nhập
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || // Tìm theo họ tên
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) // Tìm theo email
    );

    return (
        <div>
            <h3 className="text-xl font-bold mb-5">Quản lý người dùng
                <Space style={{ float: "right", marginBottom: 16 }}>
                    <Input
                        style={{ width: 400 }}
                        placeholder="Tìm kiếm người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
                    />
                </Space>
            </h3>

            <Table
                columns={columns}
                dataSource={filteredUsers} // Sử dụng danh sách người dùng đã lọc
                bordered
                rowKey="userID"  // Sử dụng userID làm khóa chính
                pagination={{ pageSize: 5 }}  // Hiển thị 5 hàng mỗi trang
            />
        </div>
    );

};
export default memo(UserManager)
