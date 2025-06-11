import React from 'react';
import { Table, Typography } from 'antd';

const { Title } = Typography;

const BookingListTable = ({ bookings }) => {
  const columns = [
    {
      title: 'Tên khách',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Check-in',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Check-out',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Tổng tiền (VNĐ)',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => price.toLocaleString(),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        if (record.isCancel) return 'Đã hủy';
        if (record.isSuccess) return 'Hoàn tất';
        if (record.isConfirm) return 'Đã xác nhận';
        return 'Chờ xử lý';
      },
    },
  ];

  // Bảng chi tiết phòng bên trong
  const expandedRowRender = (record) => {
    let roomDetails = [];
    try {
      roomDetails = JSON.parse(record.detailBookingString);
    } catch (err) {
      console.error('Lỗi parse detailBookingString:', err);
    }

    const roomColumns = [
      {
        title: 'Tên phòng',
        dataIndex: 'RoomName',
        key: 'RoomName',
      },
      {
        title: 'Loại phòng',
        dataIndex: 'RoomType',
        key: 'RoomType',
      },
      {
        title: 'Số người lớn',
        dataIndex: 'NumberAdults',
        key: 'NumberAdults',
      },
      {
        title: 'Số trẻ em',
        dataIndex: 'NumberChildren',
        key: 'NumberChildren',
      },
      {
        title: 'Giá/phòng (VNĐ)',
        dataIndex: 'TotalPriceRoom',
        key: 'TotalPriceRoom',
        render: (val) => val.toLocaleString(),
      },
    ];

    return (
      <Table
        columns={roomColumns}
        dataSource={roomDetails}
        pagination={false}
        rowKey={(room) => room.RoomId}
      />
    );
  };

  return (
    <>
      <Title level={3}>Danh sách Booking</Title>
      <Table
        columns={columns}
        dataSource={bookings}
        expandable={{ expandedRowRender }}
        rowKey="bookingID"
        pagination={{ pageSize: 5 }}
      />
    </>
  );
};

export default BookingListTable;
