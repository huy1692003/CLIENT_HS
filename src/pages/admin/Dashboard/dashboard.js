import { Button, notification, Spin, Table } from "antd";
import { memo, useEffect, useState } from "react";
import dashboardService from "../../../services/dashboardService";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { formatPrice } from "../../../utils/formatPrice";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const months = Array.from({ length: 12 }, (_, i) => i + 1);

const AdminDashboard = () => {
    const [data, setData] = useState();
    const [dataChatRevenue, setDataChatRevenue] = useState();
    const [dataAdsRevenue, setDataAdsRevenue] = useState();
    const [dataBookingChart, setDataBookingChart] = useState();
    const navigate = useNavigate();

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(value);
                    }
                }
            },
        },
    };

    const optionsTotalBooking = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',    
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value + " đơn";
                    }
                }
            },
        },
    };




    useEffect(() => {
        const getData = async () => {
            try {
                let res = await dashboardService.getDashboadAdmin();
                setData(res);

                // Biểu đồ doanh thu theo tháng (existing)
                const revenueData = months.map(month => {
                    const monthData = res.revenueByMonth.find(data => data.month === month);
                    return monthData ? monthData.totalRevenue : 0;
                });

                const countBooking = months.map(month => {
                    const monthData = res.revenueByMonth.find(data => data.month === month);
                    return monthData ? monthData.totalBooking : 0;
                });

                const chartData = {
                    labels: months.map(month => `Tháng ${month}`),
                    datasets: [
                        {
                            label: 'Doanh thu',
                            data: revenueData,
                            backgroundColor: '#FFA500',
                            borderColor: '#FFA500',
                            borderWidth: 1,
                        },
                    ],
                };
                setDataChatRevenue(chartData);

                const chartBooking = {
                    labels: months.map(month => `Tháng ${month}`),
                    datasets: [
                        {
                            label: 'Số lượng đơn đặt phòng',
                            data: countBooking,
                            backgroundColor: '#FFA500',
                            borderColor: '#FFA500',
                            borderWidth: 1,
                        },
                    ],
                };
                setDataBookingChart(chartBooking);

                // Biểu đồ doanh thu quảng cáo tháng này
                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();

                const currentMonthAds = res.revenueAds.filter(ad => {
                    const adDate = new Date(ad.timePayment);
                    return adDate.getMonth() + 1 === currentMonth && adDate.getFullYear() === currentYear;
                });

                // Nhóm theo vị trí đặt quảng cáo
                const placementRevenue = {};
                const placementNames = {
                    1: 'Phần Banner',
                    2: 'Phần Sidebar',
                    3: 'Phần Homestay nổi bật'
                };

                currentMonthAds.forEach(ad => {
                    const placement = ad.placement;
                    if (!placementRevenue[placement]) {
                        placementRevenue[placement] = 0;
                    }
                    placementRevenue[placement] += ad.cost;
                });

                const adsRevenueData = {
                    labels: Object.keys(placementRevenue).map(key => placementNames[key] || `Vị trí ${key}`),
                    datasets: [
                        {
                            label: 'Doanh thu quảng cáo',
                            data: Object.values(placementRevenue),
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF'
                            ],
                            borderWidth: 1,
                        },
                    ],
                };
                setDataAdsRevenue(adsRevenueData);

              


            } catch (error) {
                console.log(error);
                notification.error({ message: "Có lỗi xảy ra khi lấy dữ liệu !" });
            }
        };

        getData();
    }, []);

    if (!data) {
        return <div className="h-full w-full flex justify-center items-center"><Spin /></div>;
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-3">Dashboard</h3>
            <div>
                <div className="grid grid-cols-5 gap-6">
                    {/* Chủ sở hữu */}
                    <div className=" px-3 items-center py-4 rounded-lg bg-green-500 text-white text-xl hover:bg-white hover:text-green-500 hover:border-l-2 border-green-500 transition-all duration-300 cursor-pointer">
                        <div className="text-center">
                            <i className="fas fa-handshake mr-4"></i><br />
                            {data.totalOwner} đối tác Chủ HomeStay
                        </div>
                    </div>

                    {/* Đối tác */}
                    <div className=" px-3 items-center py-4 rounded-lg bg-blue-500 text-white text-xl hover:bg-white hover:text-blue-500 hover:border-l-2 border-blue-500 transition-all duration-300 cursor-pointer">
                        <div className="text-center">
                            <i className="fas fa-users mr-4"></i><br />
                            {data.totalPartnership} đơn đăng ký hợp tác chờ duyệt
                        </div>
                    </div>

                    {/* Quảng cáo chờ duyệt */}
                    <div className=" px-3 items-center py-4 rounded-lg bg-red-500 text-white text-xl hover:bg-white hover:text-red-500 hover:border-l-2 border-red-500 transition-all duration-300 cursor-pointer">
                        <div className="text-center">
                            <i className="fas fa-ad mr-4"></i><br />
                            {data.totalAdsWaiting} Quảng cáo chờ duyệt
                        </div>
                    </div>

                    {/* Homestay chờ duyệt */}
                    <div className=" px-3 items-center py-4 rounded-lg bg-orange-500 text-white text-xl hover:bg-white hover:text-orange-500 hover:border-l-2 border-orange-500 transition-all duration-300 cursor-pointer">
                        <div className="text-center">
                            <i className="fas fa-home mr-4"></i><br />
                            {data.homestayWaiting} Homestay chờ duyệt
                        </div>
                    </div>

                    {/* Người dùng */}
                    <div className="px-3 items-center py-4 rounded-lg bg-purple-500 text-white text-xl hover:bg-white hover:text-purple-500 hover:border-l-2 border-purple-500 transition-all duration-300 cursor-pointer">
                        <div className="text-center">
                            <i className="fas fa-user-circle mr-4"></i><br />
                            {data.totalUser} Người dùng hệ thống
                        </div>
                    </div>
                </div>
            </div>

            {/* Biểu đồ section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Biểu đồ số lượng đơn hàng theo tháng */}
                <div className="bg-white w-full p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Số lượng đơn đặt phòng theo tháng</h3>
                    {dataBookingChart ? <Line data={dataBookingChart} options={optionsTotalBooking} /> : <Spin />}
                </div>

                {/* Biểu đồ doanh thu quảng cáo tháng này */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Doanh thu quảng cáo tháng {new Date().getMonth() + 1}</h3>
                    {dataAdsRevenue ? (
                        dataAdsRevenue.datasets[0].data.length > 0 ?
                            <Bar data={dataAdsRevenue} options={options} /> :
                            <div className="text-center text-gray-500 py-8">Chưa có dữ liệu quảng cáo tháng này</div>
                    ) : <Spin />}


                </div>

            </div>
                


                {/* Biểu đồ doanh thu theo tháng */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Doanh thu năm</h3>
                    {dataChatRevenue ? <Bar data={dataChatRevenue} options={options} /> : <Spin />}
                </div>


        </div>
    );
};

export default memo(AdminDashboard);