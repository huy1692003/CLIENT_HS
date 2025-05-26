import { Breadcrumb, Empty, Card, Tag, Button, Steps, notification, Tabs, Modal, Input, InputNumber } from "antd";
import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bookingService from "../../services/bookingService";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atom";
import { CheckCircleOutlined, CheckOutlined, CommentOutlined, DownSquareFilled, GlobalOutlined, HomeOutlined, Loading3QuartersOutlined, LoadingOutlined, LogoutOutlined, MailOutlined, MoneyCollectOutlined, PhoneOutlined, SearchOutlined, TeamOutlined } from "@ant-design/icons";
import { convertDate, convertDateTime } from "../../utils/convertDate";
import { formatPrice } from "../../utils/formatPrice";
import paymentMomoSerivce from "../../services/paymentMomoService";
import moment from "moment";
import TabPane from "antd/es/tabs/TabPane";
import { statusBooking } from "../owner/Booking/BookingManager";
import CreateReview from "../../components/user/CreateReview";
import useSignalR from "../../hooks/useSignaIR";

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const cus = useRecoilValue(userState);
    const [search, setSearch] = useState({ email: "", phone: "", isCallApi: false })
    const [status, setStatus] = useState(10);
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [showCreateReview, setShowCreateReview] = useState(false)
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (cus) {
            getBookingByUser();
        }
        else if (search.isCallApi) {
            getBookingByUser();
        }

    }, [cus, status, search.isCallApi]);

    console.log(search)
    // Hàm để lấy danh sách booking từ API
    const getBookingByUser = async () => {
        try {

            let res = await bookingService.getBookingByCus(search.phone, search.email, cus ? cus.idCus : "", status);
            console.log(res)
            setBookings(res);
        } catch (error) {
            console.log(error);
            setBookings([]);
        }
    };

    useSignalR("ReseiverPaymentNew", (_, notifi, cusID) => {
        if (cusID === cus.idCus) {
            notification.info({
                message: "Thanh toán thành công",
                description: "Đơn hàng của bạn đã thanh toán thành công hãy chú ý thời điểm nhận phòng nhé !",
                duration: 5,
                showProgress: true
            });
            getBookingByUser()
        }
    });
    const RenderStatus = ({ statusCurrent }) => {

        const status = statusBooking.find(item => item.index === statusCurrent); // Tìm trạng thái theo index
        if (status) {
            return (
                <Tag
                    className={`text-lg font-medium ${status.color} ${status.backgroundColor} px-3 py-1 rounded-2xl`}
                >
                    {status.des}
                </Tag>
            );
        }
        return <Tag color="gray">Không xác định</Tag>;
    }



    const handleReject = (id) => {
        setReason("")
        Modal.confirm({
            width: 700,
            title: 'Xác Nhận Hủy Đơn Đặt Phòng #' + id,
            content: (
                <div >
                    <p>Vui lòng nhập lý do hủy đơn</p>
                    <Input.TextArea className="w-full"
                        rows={6}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
            ),
            onOk: async () => {
                setLoading(true);
                try {
                    await bookingService.cancel(id, reason); // Truyền lý do từ chối vào service
                    notification.success({
                        message: "Đã hủy đơn đặt phòng",
                        description: `Hủy đơn đặt phòng #${id} thành công!`,
                    });
                    getBookingByUser();
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: `Có lỗi khi hủy đơn đặt phòng #${id}. Hãy thử lại sau!`,
                    });
                } finally {
                    setLoading(false);
                }
            },
            onCancel() { },
        });
    }


    const handlePayment = async (data) => {
        try {
            let timenow = moment().format('YYYYMMDDHHmmss')
            let res = await paymentMomoSerivce.create({
                "orderInfor": timenow + "-" + data.bookingID + "-tp",
                "fullName": data.name,
                "descrtiption": "Thanh toán đặt phòng cho mã đơn hàng: " + data.bookingID,
                "amount": data.totalPrice,
            }
            )
            console.log(res)
            if (res && res.payUrl) {

                window.open(res.payUrl, "_blank")
            }
            else {
                notification.error({ message: "Đơn thanh toán hiện tại của bạn đã tồn tại trên hệ thống!" })
            }
        } catch (error) {
            notification.error({ message: "Có lỗi khi thanh toán" })
        }
    }

    const handleCreateReview = (booking) => {
        setSelectedBooking(booking)
        setShowCreateReview(true)
    }
    return (
        <div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg">
                <Breadcrumb
                    items={[
                        {
                            title: <Link to="/">Trang chủ</Link>,
                        },
                        {
                            title: "Lịch sử đặt phòng",
                        },
                    ]}
                />
            </div>

            {
                !cus && (
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm mt-4">
                        <Input
                            placeholder="Nhập số điện thoại"
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearch({ ...search, phone: value, isCallApi: false });
                            }}
                            className="flex-1"
                            allowClear
                            prefix={<PhoneOutlined className="text-gray-400" />}
                            maxLength={11}
                            pattern="^0[0-9]{9,10}$"
                            onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (charCode < 48 || charCode > 57) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <Input
                            placeholder="Nhập email"
                            onChange={(e) => setSearch({ ...search, email: e.target.value, isCallApi: false })}
                            className="flex-1"
                            allowClear
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            prefix={<MailOutlined className="text-gray-400" />}
                        />
                        <Button
                            type="primary"
                            onClick={() => setSearch({ ...search, isCallApi: true })}
                            className="bg-blue-500 hover:bg-blue-600 flex items-center"
                            icon={<SearchOutlined />}
                        >
                            Tìm kiếm
                        </Button>
                    </div>
                )
            }





            <div className="text-center mb-4 px-5">
                <h3 className="my-4 mt-7 text-xl font-bold">Lịch sử đặt phòng của tôi</h3>
                {/* Tabs để chuyển đổi giữa các trạng thái */}
                <Tabs style={{ margin: "0 auto" }} defaultActiveKey={status.toString()} onChange={(key) => setStatus(parseInt(key))} className="px-5">
                    {statusBooking.map((item) => (
                        <TabPane tab={item.des} key={item.index.toString()} />
                    ))}
                </Tabs>
            </div>
            <div className="p-4">
                {bookings.length === 0 ? (
                    <Empty description={cus || search.isCallApi === true ? "Không có lịch sử đặt phòng nào " : "Vui lòng nhập thông tin tìm kiếm để xem lịch sử đặt phòng của bạn"} />
                ) : (

                    <div className="w-full">
                        {bookings.map((booking, index) => (
                            <Card
                                key={index}
                                title={<div className="bg-blue-400 inline-block  my-2 p-3 mt-7 rounded-lg text-white"> {`Booking ID: ${booking.bookingID}`}</div>}
                                extra={
                                    <div className="flex gap-2">
                                        <RenderStatus statusCurrent={booking.status} />
                                        {(booking.status < 3 && !booking.isCancel) && <Button type="primary" loading={loading} className="text-xl mt-auto p-5 rounded-3xl" onClick={() => { handleReject(booking.bookingID) }} danger>
                                            Hủy đơn đặt phòng
                                        </Button>}
                                    </div>}

                                className="shadow-xl mb-4 rounded-lg border-2 border-gray-300"
                            >
                                <div className="flex justify-between ">
                                    <div className="space-y-2 w-[45%]">
                                        <table className="min-w-full table-auto text-sm text-left text-gray-500">
                                            <thead>
                                                <tr className="border-b bg-gray-100">
                                                    <th className="px-4 py-2 font-semibold text-gray-700">Thông tin</th>
                                                    <th className="px-4 py-2 font-semibold text-gray-700">Chi tiết</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Ngày đặt</td>
                                                    <td className="px-4 py-2">{convertDateTime(booking.bookingTime)}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Tên khách hàng</td>
                                                    <td className="px-4 py-2">{booking.name}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Số điện thoại</td>
                                                    <td className="px-4 py-2">{booking.phone}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Email</td>
                                                    <td className="px-4 py-2">{booking.email}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">ID HomeStay</td>
                                                    <td className="px-4 py-2">{booking.homeStayID}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Ngày nhận phòng</td>
                                                    <td className="px-4 py-2">{convertDate(booking.checkInDate)}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Ngày trả phòng</td>
                                                    <td className="px-4 py-2">{convertDate(booking.checkOutDate)}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">  Số khách                                                 </td>
                                                    <td className="flex px-4 py-2 gap-2">
                                                        <span className="text-gray-800">
                                                            <span className="font-semibold">{booking.numberAdults || 0}</span> người lớn
                                                        </span>
                                                        <span className="text-gray-800">
                                                            <span className="font-semibold">{booking.numberChildren || 0}</span> trẻ em
                                                        </span>
                                                        <span className="text-gray-800">
                                                            <span className="font-semibold">{booking.numberBaby || 0}</span> em bé
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Giá gốc</td>
                                                    <td className="px-4 py-2">{formatPrice(booking.originalPrice)}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Voucher</td>
                                                    <td className="px-4 py-2">{booking.discountCode || "Không có"}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Giảm giá</td>
                                                    <td className="px-4 py-2">{booking.discountPrice ? formatPrice(booking.discountPrice) : "Không có"}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Tổng hóa đơn</td>
                                                    <td className="px-4 py-2">{new Intl.NumberFormat().format(booking.totalPrice)} VNĐ</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium col-span-2"><b>Thông tin về gia chủ </b></td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Tên gia chủ :</td>
                                                    <td className="px-4 py-2">{booking.nameOwner}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">Số điện thoại liên hệ</td>
                                                    <td className="px-4 py-2">{booking.phoneOwner || "0364174636"} </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {

                                        booking.isConfirm &&
                                        <div className="w-[54%] bg-gray-100 p-4 rounded-lg shadow-lg">
                                            <h3 className="text-lg font-semibold mb-2">Quy trình đặt phòng</h3>
                                            <Steps
                                                direction="vertical"
                                                size="small"

                                                current={booking?.status === 6 ? 7 : booking.status - 1}
                                                items={[
                                                    {
                                                        title: 'Tiếp nhận đơn đặt phòng',
                                                        description: "Đã tiếp nhận ngày : " + convertDateTime(booking?.timeConfirm),
                                                        icon: <DownSquareFilled />,

                                                    },
                                                    {
                                                        title: 'Thanh toán tiền phòng',
                                                        description: booking?.status === 2 ? <Button onClick={() => handlePayment(booking)} type="">Thanh toán ngay</Button> : "Đã thanh toán ngày : " + convertDateTime(booking?.bookingProcess.paymentTime),
                                                        subTitle: booking?.bookingProcess.stepOrder === 0 && "- Số tiền phải thanh toán : " + formatPrice(booking.totalPrice),
                                                        icon: <MoneyCollectOutlined />,

                                                    },
                                                    {
                                                        title: 'Chờ nhận phòng',
                                                        subTitle: booking.status > 2 ? "Nhận phòng vào ngày :" + convertDate(booking?.checkInDate) : "",
                                                        icon: <GlobalOutlined />,

                                                    },
                                                    {
                                                        title: 'Check-in',
                                                        description: booking?.status > 4 ? "Hoàn thành thủ tục CheckIn vào : " + convertDateTime(booking?.bookingProcess.checkInTime) : 'Nhận phòng và làm thủ tục check-in',
                                                        icon: <HomeOutlined />,

                                                    },
                                                    {
                                                        title: 'Check-out',
                                                        description: booking?.status > 5 ? "Hoàn thành thủ tục CheckOut vào : " + convertDateTime(booking?.bookingProcess.checkOutTime) : 'Thực hiện Hoàn tất thủ tục trả phòng',
                                                        icon: <LogoutOutlined />,

                                                    },
                                                    {
                                                        title: 'Hoàn thành thuê phòng',
                                                        description: "Quy trình hoàn tất",
                                                        icon: <CheckCircleOutlined />,

                                                    },
                                                    {
                                                        title: 'Đánh giá HomeStay',
                                                        description: booking?.status === 6 ?
                                                            (booking.timeReviewRating ?
                                                                "Đã đánh giá vào " + convertDateTime(booking.timeReviewRating)
                                                                : <Button onClick={() => handleCreateReview(booking)} className="mt-2" type="primary" danger>Đánh giá ngay</Button>)
                                                            : "Đánh giá trải nghiệm sau khi thuê",
                                                        icon: <CommentOutlined />,

                                                    },

                                                ]}
                                            />
                                        </div>
                                    }

                                </div>

                            </Card>
                        ))}
                    </div>
                )}
            </div>
            {selectedBooking && showCreateReview && <CreateReview bookingID={selectedBooking.bookingID} IDHomeStay={selectedBooking.homeStayID} idCus={selectedBooking.customerID} show={showCreateReview} onClose={setShowCreateReview} refesh={getBookingByUser} />}
        </div>
    );
};

export default memo(BookingHistory);
