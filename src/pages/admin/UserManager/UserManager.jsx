import { Table, Tag, Button, Popconfirm, Tooltip, Input, Space, notification } from "antd"; // Import thêm Input và Space
import { DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'; // Import các biểu tượng
import React, { useState, useEffect, memo } from "react";
import UserService from "../../../services/userService";

 const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Khởi tạo state cho tìm kiếm

    // Gọi API để lấy danh sách người dùng
    const fetchUsers = async () => {
        const response = await UserService.getAll(); // Thay URL của API thật vào đây
        setUsers(response.filter(user => user.username !== "admin"));
    };
    useEffect(() => {
        fetchUsers();
    }, []);


    // Xử lý khóa người dùng
    const handleToggleStatus = async (userID,statusCurrend) => {
        // Gọi API để khóa hoặc kích hoạt người dùng
        await UserService.updateStatus(userID,statusCurrend===1?0:1); // Thay đổi để gọi API khóa/kích hoạt người dùng
        notification.success({message:"Cập nhật trạng thái thành công"})
        fetchUsers()
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
            title: "Loại tài khoản", 
            dataIndex: "typeUser",
            key: "typeUser",
            render: (role) => <Tag color={role === 0 ? "blue" : "orange"}>{role === 0 ? "Quản trị viên" : "Khách hàng"}</Tag>,
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
                    {/* <Popconfirm
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
                    </Popconfirm> */}
                    <Tooltip title={record.status === 1 ? "Khóa" : "Kích hoạt"}>
                        <Button
                            type={record.status === 1 ? "default" : "primary"}
                            size="large" // Thay đổi kích thước nút
                            icon={record.status === 1 ? <LockOutlined style={{ fontSize: '16px' }} /> : <UnlockOutlined style={{ fontSize: '20px' }} />} // Tăng kích thước biểu tượng
                            style={{ width: 30, height: 30, backgroundColor: record.status === 1 ? "#f5222d" : "#52c41a", color: "#fff" }} // Thay đổi màu nền cho nút
                            onClick={() => handleToggleStatus(record.userID,record.status)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    // Lọc danh sách người dùng dựa trên từ khóa tìm kiếm
    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm?.toLowerCase()) || // Tìm theo tên đăng nhập
        user.fullName?.toLowerCase().includes(searchTerm?.toLowerCase()) || // Tìm theo họ tên
        user.email?.toLowerCase().includes(searchTerm?.toLowerCase()) // Tìm theo email
    );

    return (
        <div>
            <h3 className="text-xl font-bold mb-5">Quản lý người dùng
                <Space style={{ float: "right", marginBottom: 16 }}>
                    <Input
                        style={{ width: 400 }}
                        className="font-semibold"
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
