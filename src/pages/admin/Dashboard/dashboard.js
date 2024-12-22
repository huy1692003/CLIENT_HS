import { Button, notification, Spin, Table } from "antd";
import { memo, useEffect, useState } from "react";
import dashboardService from "../../../services/dashboardService";
import { useNavigate } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { formatPrice } from "../../../utils/formatPrice";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = Array.from({ length: 12 }, (_, i) => i + 1);

const AdminDashboard = () => {
    const [data, setData] = useState();
    const [dataChatRevenue, setDataChatRevenue] = useState();
    const navigate = useNavigate();

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Thống kê doanh thu theo tháng',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    useEffect(() => {
        const getData = async () => {
            try {
                let res = await dashboardService.getDashboadAdmin();
                setData(res);

                const revenueData = months.map(month => {
                    const monthData = res.revenueByMonth.find(data => data.month === month);
                    return monthData ? monthData.totalRevenue : 0;
                });

                const chartData = {
                    labels: months.map(month => `Tháng ${month}`),
                    datasets: [
                        {
                            label: 'Doanh thu',
                            data: revenueData,
                            backgroundColor: '#FFA500', // Màu cam
                            borderColor: '#FFA500',
                            borderWidth: 1,
                        },
                    ],
                };
                setDataChatRevenue(chartData);
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
            <h3 className="text-xl font-bold mb-3">Dashboard - Admin</h3>
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

            <div>
                <h3 className="text-2xl font-semibold mt-[30px] my-2">Thống kê doanh thu</h3>
                {dataChatRevenue ? <Bar data={dataChatRevenue} options={options} /> : <Spin />}
            </div>
        </div>
    );
};

export default memo(AdminDashboard);
