import { Button, notification, Spin, Table, DatePicker, Select } from "antd";
import { memo, useEffect, useState } from "react";
import dashboardService from "../../../services/dashboardService";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import { formatPrice } from "../../../utils/formatPrice";
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import BookingListModal from "./BookingListModal";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const months = Array.from({ length: 12 }, (_, i) => i + 1);
const { Option } = Select;

const Overview = () => {
    const [data, setData] = useState();
    const [dataChatRevenue, setDataChatRevenue] = useState();
    const [dataChatAds, setDataChatAds] = useState();
    const [profitData, setProfitData] = useState();
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1); // Tháng hiện tại
    const [selectedYear, setSelectedYear] = useState(dayjs().year()); // Năm hiện tại
    const [loadingProfit, setLoadingProfit] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false); // State for modal
    const owner = useRecoilValue(userState);
    const navigate = useNavigate();

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Biểu đồ trực quan',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    console.log(profitData);
    const lineOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Biểu đồ doanh thu thực nhận theo ngày',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return formatPrice(value);
                    }
                }
            },
        },
    };
    console.log(data)
    const columnsHomestay = [
        {
            title: 'ID',
            dataIndex: 'homestayID',
            key: 'homestayID',
            width: 60,
            align: 'center',
        },
        {
            title: 'Tên Homestay',
            dataIndex: 'homestayName',
            key: 'homestayName',
            width: 150,
            render: (text) => <span className="font-medium text-blue-600">{text.trim()}</span>,
        },
        {
            title: 'Tỉnh/Thành phố',
            dataIndex: 'province',
            key: 'province',
            width: 120,
        },
        {
            title: 'Phường/Xã',
            dataIndex: 'wardOrCommune',
            key: 'wardOrCommune',
            width: 140,
        },
        {
            title: 'Đánh giá',
            dataIndex: 'averageRating',
            key: 'averageRating',
            width: 80,
            align: 'center',
            render: (rating) => (
                <div className="flex items-center justify-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-semibold">{rating}</span>
                </div>
            ),
        },
        {
            title: 'Check-in',
            dataIndex: 'timeCheckIn',
            key: 'timeCheckIn',
            width: 80,
            align: 'center',
        },
        {
            title: 'Check-out',
            dataIndex: 'timeCheckOut',
            key: 'timeCheckOut',
            width: 80,
            align: 'center',
        },
        {
            title: 'Lượt xem',
            dataIndex: 'viewCount',
            key: 'viewCount',
            width: 80,
            align: 'center',
            render: (count) => <span className="text-green-600 font-medium">{count}</span>,
        },
        {
            title: 'Đánh giá',
            dataIndex: 'reviewCount',
            key: 'reviewCount',
            width: 80,
            align: 'center',
            render: (count) => <span className="text-blue-600">{count}</span>,
        },
        {
            title: 'Số lượt đặt phòng',
            dataIndex: 'countBK',
            key: 'countBK',
            width: 80,
            align: 'center',
            render: (count) => <span className="text-purple-600 font-medium">{count}</span>,
        },
       
    ];

    // Hàm lấy dữ liệu thống kê lợi nhuận
    const getProfitStatistics = async (month, year) => {
        setLoadingProfit(true);
        try {
            const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
            const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
            const endDate = `${year}-${month.toString().padStart(2, '0')}-${daysInMonth}`;

            const response = await dashboardService.getRevenueOwner(owner.idOwner, {
                startDate,
                endDate
            });

            // Tạo dữ liệu cho biểu đồ đường theo từng ngày trong tháng
            const dailyProfit = Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayStr = day.toString().padStart(2, '0');
                const dayProfit = response.bookings
                    .filter(booking => {
                        const checkOutDate = dayjs(booking.checkOutDate);
                        return checkOutDate.date() === day;
                    })
                    .reduce((sum, booking) => sum + booking.revenueBK, 0);
                return dayProfit;
            });

            const chartData = {
                labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}/${month}`),
                datasets: [
                    {
                        label: 'Thực nhận (VND)',
                        data: dailyProfit,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#10B981',
                        pointBorderColor: '#10B981',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                ],
            };

            setProfitData({
                chartData,
                totalBookings: response.totalBookings,
                totalRevenue: response.totalRevenue,
                bookings: response.bookings,
                floorFee: response.floorFee
            });

        } catch (error) {
            console.log(error);
            notification.error({ message: "Có lỗi xảy ra khi lấy dữ liệu thống kê lợi nhuận!" });
        } finally {
            setLoadingProfit(false);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                let res = await dashboardService.getDashboadOwner(owner.idOwner);
                setData(res);

                const revenueData = months.map(month => {
                    // Lấy doanh thu cho mỗi tháng, nếu không có dữ liệu thì gán 0
                    const monthData = res.revenueByMonth.find(data => data.month === month);
                    return monthData ? monthData.totalRevenue : 0;
                });

                const chartData = {
                    labels: months.map(month => `Tháng ${month}`), // Nhãn tháng
                    datasets: [
                        {
                            label: 'Doanh thu',
                            data: revenueData,
                            backgroundColor: '#7E5CAD',
                            borderColor: '#7E5CAD',
                            borderWidth: 1,

                        },
                    ],
                };
                setDataChatRevenue(chartData);

                const chartData_Ads = {
                    labels: res.listAdvertisement.map(ad => "#" + ad.adID), // Tiêu đề quảng cáo
                    datasets: [
                        {
                            label: 'Số lượt click',
                            data: res.listAdvertisement.map(ad => Number.parseInt(ad.totalClick)),
                            backgroundColor: '#E07B39', // Màu nền của các cột (màu đỏ nhạt)
                            borderColor: '#E07B39', // Màu viền của các cột (màu đỏ đậm)
                            borderWidth: 1,
                            hoverBorderColor: '#E07B39',
                        },
                    ],
                };
                setDataChatAds(chartData_Ads);

            } catch (error) {
                console.log(error);
                notification.error({ message: "Có lỗi xảy ra khi lấy dữ liệu !" });
            }
        };

        getData();
    }, [owner.idOwner]);

    // Lấy dữ liệu lợi nhuận khi component mount và khi thay đổi tháng/năm
    useEffect(() => {
        if (owner.idOwner) {
            getProfitStatistics(selectedMonth, selectedYear);
        }
    }, [selectedMonth, selectedYear, owner.idOwner]);

    if (!data) {
        return <div className="h-full w-full flex justify-center items-center"><Spin /></div>;
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-3">Dashboard</h3>
            <div>
                <div className="grid grid-cols-5 gap-4">
                    {/* Homestay */}
                    <div onClick={() => { navigate("/owner/homestay-current") }} className="flex justify-center items-center py-3 px-3 rounded-lg bg-blue-600 text-white text-xl hover:bg-white hover:text-blue-600 hover:border-l-2 border-blue-600 transition-all duration-300 cursor-pointer">
                        <i className="fas fa-home mr-4"></i>
                        Sở hữu {data.totalHomeStay} Homestay
                    </div>

                    {/* Đơn đặt phòng chờ xác nhận */}
                    <div onClick={() => { navigate("/owner/booking-manager") }} className="flex px-2 justify-center items-center py-3 rounded-lg bg-green-600 text-white text-xl hover:bg-white hover:text-green-600 hover:border-l-2 border-green-600 transition-all duration-300 cursor-pointer">
                        <i className="fas fa-clock mr-4"></i>
                        {data.totalBookingWaiting} đơn đặt phòng chờ xác nhận
                    </div>

                    {/* Doanh thu */}
                    <div className="flex px-2 justify-center items-center py-3 rounded-lg bg-yellow-600 text-white text-xl hover:bg-white hover:text-yellow-600 hover:border-l-2 border-yellow-600 transition-all duration-300 cursor-pointer">
                        <i className="fas fa-dollar-sign mr-4"></i>
                        Doanh thu tháng này {formatPrice(data.sumRevenue)}
                    </div>

                    {/* Quảng cáo */}
                    <div onClick={() => { navigate("/owner/advertisement-manager") }} className="flex px-2 justify-center items-center py-3 rounded-lg bg-red-600 text-white text-xl hover:bg-white hover:text-red-600 hover:border-l-2 border-red-600 transition-all duration-300 cursor-pointer">
                        <i className="fas fa-ad mr-4"></i>
                        {data.totalAds} quảng cáo đang chạy
                    </div>

                    {/* Thanh toán hoàn thành */}
                    <div onClick={() => { navigate("/owner/history-payment-booking") }} className="flex px-2 justify-center items-center py-3 rounded-lg bg-purple-600 text-white text-xl hover:bg-white hover:text-purple-600 hover:border-l-2 border-purple-600 transition-all duration-300 cursor-pointer">
                        <i className="fas fa-credit-card mr-4"></i>
                        {data.totalPayment} thanh toán hoàn thành
                    </div>
                </div>
            </div>

            {/* Khung thống kê lợi nhuận mới */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold">Doanh thu thực nhận</h3>

                    {/* Button to show booking details */}
                    {profitData && profitData.bookings && profitData.bookings.length > 0 && (
                        <Button
                            type="primary"
                            icon={<i className="fas fa-list-alt"></i>}
                            onClick={() => setShowBookingModal(true)}
                        >
                            Xem chi tiết booking ({profitData.bookings.length})
                        </Button>
                    )}
                </div>

                {/* Bộ lọc tháng và năm */}
                <div className="mb-4 flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Tháng:</span>
                        <Select
                            value={selectedMonth}
                            onChange={setSelectedMonth}
                            style={{ width: 120 }}
                        >
                            {months.map(month => (
                                <Option key={month} value={month}>Tháng {month}</Option>
                            ))}
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Năm:</span>
                        <Select
                            value={selectedYear}
                            onChange={setSelectedYear}
                            style={{ width: 120 }}
                        >
                            {Array.from({ length: 5 }, (_, i) => dayjs().year() - i).map(year => (
                                <Option key={year} value={year}>{year}</Option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Thông tin tổng quan */}
                {profitData && !loadingProfit && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                            <div className="flex items-center">
                                <i className="fas fa-chart-line text-2xl mr-3"></i>
                                <div>
                                    <p className="text-sm opacity-90">Tổng lợi nhuận sau khi đã trừ {(profitData.floorFee)}% phí sàn</p>
                                    <p className="text-xl font-bold">{formatPrice(profitData.totalRevenue)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                            <div className="flex items-center">
                                <i className="fas fa-calendar-check text-2xl mr-3"></i>
                                <div>
                                    <p className="text-sm opacity-90">Tổng booking</p>
                                    <p className="text-xl font-bold">{profitData.totalBookings}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Biểu đồ lợi nhuận */}
            </div>
            {loadingProfit ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" />
                </div>
            ) : profitData ?

                (
                    <Line className="w-full" data={profitData?.chartData} options={lineOptions} />
                ) : (
                    <div className="flex justify-center items-center h-64 text-gray-500">
                        Không có dữ liệu

                    </div>
                )}

            <div>
                <h3 className="text-2xl font-semibold mt-[60px] mb-3">Thống kê thông tinHomestay</h3>
                <Table
                    columns={columnsHomestay}
                    dataSource={data?.listHomestay}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} mục`,
                    }}
                    scroll={{ x: 1000 }}
                    size="middle"
                    bordered
                    rowHover
                />

            </div>
            <div>
                <h3 className="text-2xl font-semibold mt-[60px] mb-3">Thống kê quảng cáo</h3>
                {dataChatAds ?
                    <>
                        <Bar data={dataChatAds} options={options} />
                        <Table
                            className="mt-5"
                            dataSource={data.listAdvertisement}
                            rowKey="adID"
                            bordered
                        >
                            <Table.Column title="ID Quảng Cáo" dataIndex="adID" key="adID" />
                            <Table.Column title="Tiêu đề Quảng Cáo" dataIndex="adTitle" key="adTitle" />
                            <Table.Column title="Số Lượt Click" dataIndex="totalClick" key="totalClick" />
                            <Table.Column title="Đánh giá tổng quan" dataIndex="totalClick" key="totalClick"
                                render={(click) => click > 5 ? "Quảng cáo chất lượng" : "Cần cải thiện chất lượng quảng cáo"}
                            />
                        </Table>
                    </>
                    : <Spin />}
                <h3 className="text-2xl font-semibold mt-[30px] my-2">Thống kê doanh thu trong năm</h3>
                {dataChatRevenue ? <Bar data={dataChatRevenue} options={options} /> : <Spin />}
            </div>

            {/* Booking Modal */}
            <BookingListModal
                visible={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                bookings={profitData?.bookings || []}
            />
        </div>
    );
};

export default memo(Overview);