import { Modal, Table, Tag, Descriptions, Button, Space } from "antd";
import dayjs from 'dayjs';
import { formatPrice } from "../../../utils/formatPrice";
import { URL_SERVER } from "../../../constant/global";

const BookingListModal = ({ visible, onClose, bookings }) => {
    // Parse detail booking string to get room information
    const parseBookingDetails = (detailString) => {
        try {
            return JSON.parse(detailString);
        } catch (error) {
            return [];
        }
    };

    const columns = [
        {
            title: 'Booking ID',
            dataIndex: 'bookingID',
            key: 'bookingID',
            width: 120,
            render: (id) => <Tag color="blue">#{id}</Tag>
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            width: 200,
            render: (_, record) => (
                <div>
                    <div className="font-semibold">{record.name}</div>
                    <div className="text-gray-500 text-sm">{record.email}</div>
                    <div className="text-gray-500 text-sm">CMND: {record.cmnd}</div>
                </div>
            )
        },
        {
            title: 'Chi tiết phòng',
            key: 'roomDetails',
            width: 300,
            render: (_, record) => {
                const details = parseBookingDetails(record.detailBookingString);
                return (
                    <div>
                        {details.map((room, index) => (
                            <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                                <div className="font-medium text-blue-600">{room.RoomName}</div>
                                <div className="text-sm text-gray-600">{room.RoomType}</div>
                                <div className="text-sm">
                                    <span>Người lớn: {room.NumberAdults}</span>
                                    <span className="ml-2">Trẻ em: {room.NumberChildren}</span>
                                    <span className="ml-2">Em bé: {room.NumberBaby}</span>
                                </div>
                                <div className="text-sm text-green-600 font-medium">
                                    {dayjs(room.DateStart).format('DD/MM/YYYY')} - {dayjs(room.DateEnd).format('DD/MM/YYYY')}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        },
        {
            title: 'Giá tiền',
            key: 'pricing',
            width: 200,
            render: (_, record) => (
                <div>
                    <div className="text-sm">
                        <span className="text-gray-500">Giá phòng gốc:</span>
                        <span className="ml-2 font-medium">{formatPrice(record.originalPrice)}</span>
                    </div>
                    
                        <div className="text-sm">
                            <span className="text-gray-500">Giảm giá:</span>
                            <span className="ml-2 text-red-500">-{formatPrice(record?.discountPrice || 0)}</span>
                            {record?.discountCode && (
                                <Tag color="orange" size="small" className="ml-1">
                                    {record?.discountCode}
                                </Tag>
                            )}
                        </div>
                    
                    {record.extraCost > 0 && (
                        <div className="text-sm">
                            <span className="text-gray-500">Phụ phí phát sinh:</span>
                            <span className="ml-2 text-orange-500">+{formatPrice(record.extraCost)}</span>
                        </div>
                    )}
                    <div className="text-sm border-t mt-1 pt-1">
                        <span className="text-gray-500">Sau khi trừ phí sàn</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-500">Thực lĩnh nhận về:</span>
                        <span className="ml-2 font-bold text-blue-600">{formatPrice(record.revenueBK)}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Hóa đơn',
            key: 'bill',
            width: 100,
            render: (_, record) => (
                <div>
                    {record.linkBill ? (
                        <Button 
                            type="link" 
                            size="small"
                            onClick={() => window.open(URL_SERVER+record.linkBill, '_blank')}
                        >
                            <i className="fas fa-file-pdf"></i> Xem
                        </Button>
                    ) : (
                        <span className="text-gray-400 text-sm">Chưa có</span>
                    )}
                </div>
            )
        }
    ];

    const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.revenueBK, 0) || 0;
    const totalBookings = bookings?.length || 0;
    const totalOriginalPrice = bookings?.reduce((sum, booking) => sum + booking.originalPrice, 0) || 0;
    const totalDiscount = bookings?.reduce((sum, booking) => sum + booking.discountPrice, 0) || 0;

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <i className="fas fa-list-alt mr-2 text-blue-500"></i>
                    Chi tiết booking trong tháng
                </div>
            }
            open={visible}
            onCancel={onClose}
            width={1200}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>
            ]}
            bodyStyle={{ padding: 0 }}
        >
            

            {/* Bảng chi tiết */}
            <div className="p-4">
                <Table
                    columns={columns}
                    dataSource={bookings || []}
                    rowKey="bookingID"
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                        showTotal: (total, range) => 
                            `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} booking`
                    }}
                    scroll={{ x: 1000 }}
                    size="small"
                />
            </div>
        </Modal>
    );
};

export default BookingListModal;