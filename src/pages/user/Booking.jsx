import React, { memo, useState } from 'react';
import { ConfigProvider, DatePicker } from 'antd';
import locale from 'antd/locale/vi_VN';  // Cấu hình locale tiếng Việt cho antd
import dayjs from 'dayjs';
import 'dayjs/locale/vi';  // Import locale tiếng Việt cho dayjs
dayjs.locale('vi');  // Thiết lập tiếng Việt cho dayjs

const { RangePicker } = DatePicker;

 const Booking = () => {
    const [bookedDates] = useState([
        { CheckInDate: '2024-10-10', CheckOutDate: '2024-10-12' },
        { CheckInDate: '2024-10-15', CheckOutDate: '2024-10-17' },
    ]);

    const disabledDate = (current) => {
        return bookedDates.some(
            (booking) => {
                const startDate = dayjs(booking.CheckInDate);
                const endDate = dayjs(booking.CheckOutDate);
                return current.isSame(startDate, 'day') ||
                    current.isSame(endDate, 'day') ||
                    (current.isAfter(startDate, 'day') && current.isBefore(endDate, 'day'));
            }
        );
    };

    return (
        <ConfigProvider locale={locale}>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Chọn khoảng thời gian đặt phòng</h2>
                <RangePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                    className="border border-gray-300 rounded-md p-2 w-64"
                />
            </div>
        </ConfigProvider>
    );
};
export default memo (Booking)
