import { Button, notification, Spin, Table } from "antd";
import { memo, useEffect, useState } from "react";
import dashboardService from "../../../services/dashboardService";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import { formatPrice } from "../../../utils/formatPrice";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = Array.from({ length: 12 }, (_, i) => i + 1);

const Overview = () => {
    const [data, setData] = useState();
    const [dataChatRevenue, setDataChatRevenue] = useState();
    const [dataChatAds, setDataChatAds] = useState();
    const owner = useRecoilValue(userState);
    const navigate = useNavigate()

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
                            data: res.listAdvertisement.map(ad => ad.totalClick),
                            backgroundColor: '#E07B39', // Màu nền của các cột (màu đỏ nhạt)
                            borderColor: '#E07B39', // Màu viền của các cột (màu đỏ đậm)
                            borderWidth: 1,
                        },
                    ],
                };
                setDataChatAds(chartData_Ads)

            } catch (error) {
                console.log(error);
                notification.error({ message: "Có lỗi xảy ra khi lấy dữ liệu !" });
            }
        };

        getData();
    }, [owner.idOwner]);

    if (!data) {
        return <div className="h-full w-full flex justify-center items-center"><Spin /></div>;
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-3">Dashboard</h3>
            <div>
                <div className="grid grid-cols-5 gap-4">
                    {/* Homestay */}
                    <div onClick={() => { navigate("/owner/homestay-current") }} className="flex justify-center items-center py-8 rounded-lg bg-blue-600 text-white text-xl hover:bg-white hover:text-blue-600 hover:border-l-2 border-blue-600 transition-all duration-300 cursor-pointer">
                        <i className="fas fa-home mr-4"></i>
                        {data.totalHomeStay} Homestay
                    </div>

                    {/* Đơn đặt phòng chờ xác nhận */}
                    <div onClick={() => { navigate("/owner/booking-manager") }} className="flex px-2 justify-center items-center py-3 rounded-lg bg-green-600 text-white text-xl hover:bg-white hover:text-green-600 hover:border-l-2 border-green-600 transition-all duration-300 cursor-pointer">
                        <i className="fas fa-clock mr-4"></i>
                        {data.totalBookingWaiting} đơn đặt phòng chờ xác nhận
                    </div>

                    {/* Doanh thu */}
                    <div className="flex px-2 justify-center items-center py-3 rounded-lg bg-yellow-600 text-white text-xl hover:bg-white hover:text-yellow-600 hover:border-l-2 border-yellow-600 transition-all duration-300 cursor-pointer">
                        <i className="fas fa-dollar-sign mr-4"></i>
                        Doanh thu {formatPrice(data.sumRevenue)}
                    </div>

                    {/* Quảng cáo */}
                    <div onClick={() => { navigate("/owner/advertisement-manager") }} className="flex px-2 justify-center items-center py-3 rounded-lg bg-red-600 text-white text-xl hover:bg-white hover:text-red-600 hover:border-l-2 border-red-600 transition-all duration-300 cursor-pointer">
                        <i className="fas fa-ad mr-4"></i>
                        {data.totalAds} quảng cáo
                    </div>

                    {/* Thanh toán hoàn thành */}
                    <div onClick={() => { navigate("/owner/history-payment-booking") }} className="flex px-2 justify-center items-center py-3 rounded-lg bg-purple-600 text-white text-xl hover:bg-white hover:text-purple-600 hover:border-l-2 border-purple-600 transition-all duration-300 cursor-pointer">
                        <i className="fas fa-credit-card mr-4"></i>
                        {data.totalPayment} thanh toán hoàn thành
                    </div>
                </div>
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
                <h3 className="text-2xl font-semibold mt-[30px] my-2">Thống kê doanh thu</h3>
                {dataChatRevenue ? <Bar data={dataChatRevenue} options={options} /> : <Spin />}
            </div>

        </div>
    );
};

export default memo(Overview);
