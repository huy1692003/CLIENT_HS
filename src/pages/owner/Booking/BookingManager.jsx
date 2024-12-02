import { Table, Tooltip, Space, Tag, message, Button, notification, Modal, Input, Descriptions } from "antd";
import { memo, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import bookingService from "../../../services/bookingService";
import { CheckCircleFilled, CloseSquareFilled, EyeFilled, ProfileTwoTone } from '@ant-design/icons';

const BookingManager = ({ status }) => {
    const [bookings, setBookings] = useState([]);
    const [owner, _] = useRecoilState(userState);
    const [reason, setReason] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null); // Booking được chọn để xem chi tiết
    const [isModalVisible, setIsModalVisible] = useState(false);  // Trạng thái hiển thị Modal


    useEffect(() => {
        getData();
    }, [status, owner]);

    const handleViewDetail = (record) => {
        setSelectedBooking(record); // Lưu thông tin booking được chọn
        setIsModalVisible(true);    // Hiển thị modal
    };

    const handleModalClose = () => {
        setIsModalVisible(false);   // Ẩn modal
        setSelectedBooking(null);   // Xóa thông tin booking sau khi đóng modal
    };
    const getData = async () => {
        try {
            let data = await bookingService.getBookingByOwner(owner.idOwner, status);
            data && setBookings(data);
        } catch (error) {
            message.error("Có lỗi khi lấy dữ liệu từ máy chủ, hãy thử lại sau!");
        }
    };
    const handleConfirm = async (record) => {
        // Logic xác nhận đơn đặt phòng

        try {
            await bookingService.confirm(record.bookingID);
            notification.success({
                message: "Thành Công",
                description: `Xác nhận đơn đặt phòng #${record.bookingID} thành công!`,
            });
            getData()

        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: `Có lỗi khi xác nhận đơn đặt phòng #${record.bookingID}. Hãy thử lại sau!`,
            });
        }
    };

    const handleReject = (record) => {
        setReason("")
        Modal.confirm({
            width: 500,
            title: 'Xác Nhận Từ Chối',
            content: (
                <div >
                    <p>Vui lòng nhập lý do từ chối đơn đặt phòng <span className="font-bold">#{record.bookingID}</span>:</p>
                    <Input.TextArea
                        rows={4}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
            ),
            onOk: async () => {
                try {
                    await bookingService.cancel(record.bookingID, reason); // Truyền lý do từ chối vào service
                    notification.success({
                        message: "Đã Từ Chối",
                        description: `Từ chối đơn đặt phòng #${record.bookingID} thành công!`,
                    });
                    getData();
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: `Có lỗi khi từ chối đơn đặt phòng #${record.bookingID}. Hãy thử lại sau!`,
                    });
                }
            },
            onCancel() { },
        });
    }

    const columns = [
        {
            title: "Mã Đặt Phòng",
            dataIndex: "bookingID",
            key: "bookingID",
        },
        {
            title: "Mã HomeStay",
            dataIndex: "homeStayID",
            key: "homeStayID",
        },
        {
            title: "Tên Khách",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số Điện Thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Ngày Đến",
            dataIndex: "checkInDate",
            key: "checkInDate",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Ngày Đi",
            dataIndex: "checkOutDate",
            key: "checkOutDate",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Tổng Giá Tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => `${price.toLocaleString()} VND`,
        },
        {
            title: "Trạng Thái",
            key: "status",
            render: (record) => {
                let statusText;
                let color;

                switch (status) {
                    case 0:
                        statusText = "Chờ xác nhận";
                        color = "orange"; // Màu cho trạng thái chờ xác nhận
                        break;
                    case 1:
                        statusText = "Chờ nhận phòng";
                        color = "blue"; // Màu cho trạng thái chờ nhận phòng
                        break;
                    case 2:
                        statusText = "Đã hoàn tất";
                        color = "green"; // Màu cho trạng thái đã hoàn tất
                        break;
                    case 3:
                        statusText = "Đã hủy";
                        color = "red"; // Màu cho trạng thái đã hủy
                        break;
                    default:
                        statusText = "Không xác định"; // Nếu không có trạng thái nào phù hợp
                        color = "gray"; // Màu mặc định
                }

                return <Tag color={color}>{statusText}</Tag>;
            },

        },
        {
            title: "Hành Động",
            key: "action",
            render: (record) => (
                <>
                    {status === 0 && <ButtonPending record={record} />}
                    {status === 1 && <ButtonWaiting record={record} />}
                    {(status === 2 || status === 3) && <ButtonCancelOrSuccess record={record} />}
                </>
            ),
        },
    ];
    const ButtonPending = ({ record }) => {
        return (
            <Space size={"small"}>
                <Tooltip title="Xem Chi Tiết">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<EyeFilled />}
                        onClick={() => handleViewDetail(record)}
                    />
                </Tooltip>
                <Tooltip title="Xác Nhận">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<CheckCircleFilled />}
                        onClick={() => handleConfirm(record)}
                        style={{ backgroundColor: 'green', borderColor: 'green' }}
                    />
                </Tooltip>
                <Tooltip title="Từ Chối">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<CloseSquareFilled />}
                        onClick={() => handleReject(record)}
                        style={{ backgroundColor: 'red', borderColor: 'red' }}
                    />
                </Tooltip>
            </Space>)
    }
    const ButtonWaiting = ({ record }) => {
        return (
            <Space size={"small"}>
                <Tooltip title="Xem Chi Tiết">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<EyeFilled />}
                        onClick={() => handleViewDetail(record)}
                    />
                </Tooltip>
                <Tooltip title="Xử lý">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<ProfileTwoTone />}
                        onClick={() => handleConfirm(record)}
                        style={{ backgroundColor: 'green', borderColor: 'green' }}
                    />
                </Tooltip>
            </Space>)
    }
    const ButtonCancelOrSuccess = ({ record }) => {
        return (
            <Space size={"small"}>
                <Tooltip title="Xem Chi Tiết">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<EyeFilled />}
                        onClick={() => handleViewDetail(record)}
                    />
                </Tooltip>
            </Space>)
    }


    console.log(selectedBooking)
    return (
        <div >
            <h3 className="text-xl font-bold mb-5 flex justify-between items-center">
                <span className="flex items-center space-x-3">
                    <span className="text-gray-800">Danh sách đơn đặt phòng</span>
                    {status === 0 && (
                        <span className="text-lg bg-blue-300 text-blue-700 px-3 py-1 rounded-md shadow-sm">
                            Chờ xác nhận
                        </span>
                    )}
                    {status === 1 && (
                        <span className="text-lg bg-orange-100 text-orange-600 px-3 py-1 rounded-md shadow-sm">
                            Chờ nhận phòng
                        </span>
                    )}
                    {status === 2 && (
                        <span className="text-lg bg-green-100 text-green-600 px-3 py-1 rounded-md shadow-sm">
                            Đã hoàn thành
                        </span>
                    )}
                    {status === 3 && (
                        <span className="text-lg bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md shadow-sm">
                            Bị Huỷ
                        </span>
                    )}
                </span>
            </h3>
            <Table
                className="w-full"
                style={{ overflowX: "scroll" }}
                bordered
                columns={columns}
                dataSource={bookings}
                rowKey="bookingID"
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title={`Chi Tiết Đơn Đặt Phòng #${selectedBooking?.bookingID}`}
                visible={isModalVisible}
                width={900}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Đóng
                    </Button>,
                ]}
            >
                {selectedBooking && (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Mã Đặt Phòng">
                            {selectedBooking.bookingID}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã HomeStay">
                            {selectedBooking.homeStayID}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên Khách">
                            {selectedBooking.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {selectedBooking.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số Điện Thoại">
                            {selectedBooking.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng số người sử dụng">
                            {selectedBooking.numberOfGuests   +" người"                         }
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày Đến">
                            {new Date(selectedBooking.checkInDate).toLocaleDateString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày Về">
                            {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng Giá Tiền">
                            {`${selectedBooking.totalPrice.toLocaleString()} VND`}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng Thái">
                            {status === 0 ? 'Chờ xác nhận' :
                                status === 1 ? 'Chờ nhận phòng' :
                                    status === 2 ? 'Đã hoàn tất' : 'Đã hủy'}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>


        </div>
    );
};
export default memo(BookingManager)

