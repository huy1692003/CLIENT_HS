import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SearchHomeStay from "../../components/user/SearchHomeStay";
import { memo, useEffect, useState } from "react";
import { Button, Col, Image, Space, Table, Modal, Tag, DatePicker, InputNumber, Row, message, notification, Spin, Breadcrumb, Empty } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { formatPrice } from './../../utils/formatPrice';
import HomeStayReviews from "../../components/user/HomeStayReviews";
import homestayService from "../../services/homestayService";
import bookingService from "../../services/bookingService";
import moment from "moment";
import CreateDetailBooking from "../../components/user/CreateDetailBooking";
import { URL_SERVER } from "../../constant/global";
import favoritesService from "../../services/favoritesService";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atom";
import TextArea from "antd/es/input/TextArea";
import promotionService from "../../services/promotionService";
import VoucherCard from "../../components/shared/VoucherCard";
import reviewRatingService from "../../services/reviewRatingService";
import ReviewItem from "../../components/user/ReviewItem";


export const getDisabledDates = (bookedDates) => {
    const disabledDates = [];

    bookedDates.forEach(({ checkInDate, checkOutDate }) => {
        const start = moment(checkInDate);
        const end = moment(checkOutDate);

        // Duyệt qua từng ngày trong khoảng và thêm vào mảng disabledDates
        for (let date = start; date.isBefore(end); date.add(1, 'days')) {
            disabledDates.push(date.clone());
        }
       
    });


    return disabledDates;
};

const DetailHomeStay = () => {
    const [param] = useSearchParams();
    const id = param.get('id');
    const [detail, setDetail] = useState();
    const [bookedDate, setBookedDate] = useState([]);
    const [showCreateBooking, setShowCreateBooking] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [booking, setBooking] = useState({
        numberofGuest: null,
        dateIn: null,
        dateOut: null
    });
    const cus = useRecoilValue(userState)
    const navigate = useNavigate()


    useEffect(() => {
        detail && getPromotion()
        getReviews()
    }, [detail])

    const getPromotion = async () => {
        // Lấy danh sách các voucher từ dịch vụ
        let res = await promotionService.getAllByOwnwer(detail.homeStay.ownerID);
        // Lấy ngày hiện tại
        const date = new Date();
        // Lọc các voucher hợp lệ dựa trên ngày bắt đầu và kết thúc
        const validPromotions = res.filter(voucher => {
            const startDate = new Date(voucher.startDate); // Chuyển startDate thành đối tượng Date
            const endDate = new Date(voucher.endDate); // Chuyển endDate thành đối tượng Date  

            return date >= startDate && date <= endDate;
        });

        // Cập nhật các voucher hợp lệ vào trạng thái
        setPromotions(validPromotions);
    }
    // Hàm tạo các ngày đã đặt phòng rồi

    const getReviews = async () => {
        try {
            let res = await reviewRatingService.getReviewByHomeStay(id)
            res && setReviews(res)
        } catch (error) {
            setReviews([])
        }
    }

    // 
    const disabledDate = (current) => {
        // Không cho phép chọn ngày trước ngày hiện tại
        const disabledDates = getDisabledDates(bookedDate)

        // Kiểm tra nếu ngày hiện tại là ngày trước hôm nay
        const isPastDate = current && current <= moment().startOf('day');

        // Kiểm tra xem ngày hiện tại có trong danh sách tùy chọn không
        const isDisabledDate = disabledDates.some(date => current.isSame(date, 'day'));

        // Trả về true nếu ngày hiện tại là ngày quá khứ hoặc là một trong các ngày tùy chọn
        return isPastDate || isDisabledDate;

    };

    const addFavorites = async () => {
        if (!cus) {
            notification.error({ showProgress: true, message: "Yêu cầu đăng nhập !", description: "Bạn cần đăng nhập để sử dụng chức năng này", btn: <Button onClick={() => navigate('/login-user')}>Đăng nhập ngay</Button>, duration: 4 })
        }
        else {
            try {
                await favoritesService.addFavorites(detail.homeStay.homestayID, cus.idCus)
                notification.success({ message: 'Thông báo', description: "Thêm thành công HomeStay vào danh sách yêu thích của bạn" })
            } catch (error) {
                notification.error({ message: "Thông báo", description: "Bạn đã thêm HomeStay này vào danh sách yêu thích rồi" })
            }
        }
    }

    const getDataDetail = async () => {
        try {
            let result = await homestayService.viewDetailHomeStay(id);
            result && setDetail(result);
            // Lay ve cac ngay ma booking da dc dat
            let resDateBooking = await bookingService.getBookingDateExisted(id);
            resDateBooking && setBookedDate(resDateBooking)
        } catch (error) {
            message.error("Có lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getDataDetail();
    }, []);





    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div >

            {detail ? <div>
                <div className="rounded-xl">
                    <SearchHomeStay />
                </div>

                <div className="px-16">
                    <div className="px-4 py-2 text-base mb-5">
                        <Breadcrumb
                            className="text-base"
                            items={[
                                {
                                    title: <Link to="/">Trang chủ</Link>,
                                },
                                {
                                    title: 'Chi tiết về HomeStay #' + id,
                                },
                            ]}
                        />
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <h1 className="name-homestay text-3xl font-bold mb-2">{detail.homeStay.homestayName} ⚡</h1>
                            <h4 className="name-homestay text-base font-normal mt-1">
                                <i className="fa-solid fa-location-dot mr-1" style={{ fontSize: 18, color: "#11497C" }}></i>
                                <span className="font-semibold" >{detail.homeStay.addressDetail}</span> -
                                <span className="font-semibold"> {detail.homeStay.province}</span> -
                                <span className="font-semibold"> {detail.homeStay.district}</span>
                                <p className="inline-block"></p>
                            </h4>
                        </div>

                    </div>

                    {/* Image Gallery Section */}
                    <div className="flex justify-between mt-4 relative" style={{ height: 400 }}>
                        <div style={{ width: "51.3%", maxWidth: "51.3%" }} >
                            <Image height={400} width={"100%"} className="rounded-xl object-cover" src={URL_SERVER + detail.homeStay.imagePreview[0]} />
                        </div>
                        <div style={{ width: "48%" }} className="grid grid-cols-2 gap-1 ">

                            {detail.homeStay.imagePreview.map((src, index) => (
                                index > 0 && index < 5 && <Image key={index} width={"100%"} height={198} className="rounded-xl object-cover" src={URL_SERVER + src} />
                            ))}
                        </div>
                        <Button className="absolute inline bottom-2 right-1 bg-white p-1 text-blue-900" type="link" onClick={showModal}>
                            Xem tất cả ảnh
                        </Button>
                    </div>

                    <div className=" mt-10 py-5 pl-2 flex">
                        <div className="w-7/12">
                            <div className="grid grid-cols-2 gap-5  pb-8 border-b border-gray-200">
                                <div className="text-xl text-gray-700"><i className="fa-solid fa-house-user mr-4"></i>Homestay</div>
                                <div className="text-xl text-gray-700"><i className="fa-solid fa-bed mr-4"></i>{detail.detailHomeStay.numberOfBedrooms} Phòng ngủ</div>
                                <div className="text-xl text-gray-700"><i className="fa-solid fa-person-booth mr-4"></i>{detail.detailHomeStay.numberOfLivingRooms} Phòng khách</div>
                                <div className="text-xl text-gray-700"><i className="fa-solid fa-utensils mr-5"></i>{detail.detailHomeStay.numberOfKitchens} phòng bếp</div>
                                <div className="text-xl text-gray-700"><i className="fa-solid fa-bath mr-4"></i>{detail.detailHomeStay.numberOfBathrooms} phòng tắm</div>
                                <div className="text-xl text-gray-700"><i className="fa-solid fa-elevator mr-4"></i>Sức chứa {detail.homeStay.minPerson} khách (tối đa {detail.homeStay.maxPerson})</div>
                            </div>
                            {/*  */}

                            {/* New Section */}
                            <div className="mt-8 grid grid-cols-2 pb-8 gap-8 border-b border-gray-200">
                                <div>
                                    <div className="flex items-center font-bold text-xl mb-2">
                                        <i className="fa-solid fa-utensils mr-4"></i>Quy định nấu ăn
                                    </div>
                                    <p className="text-gray-500">Homestay có đầy đủ tiện nghi để bạn có thể tự nấu nướng</p>
                                </div>
                                <div>
                                    <div className="flex items-center font-bold text-xl mb-2">
                                        <i className="fa-solid fa-dollar-sign mr-4"></i>Quy trình thanh toán
                                    </div>
                                    <p className="text-gray-500">Thanh toán 100% tiền phòng, thanh toán phần còn lại và các phụ thu phát sinh khác khi checkout</p>
                                </div>
                                <div>
                                    <div className="flex items-center font-bold text-xl mb-2">
                                        <i className="fa-solid fa-clock mr-4"></i>Check-in/Check-out
                                    </div>
                                    <p className="text-gray-500">Check-in sau 14:00 và check-out trước 12:00 ngày hôm sau</p>
                                </div>
                                <div>
                                    <div className="flex items-center font-bold text-xl mb-2">
                                        <i className="fa-solid fa-house mr-4"></i>Cách thức nhận phòng
                                    </div>
                                    <p className="text-gray-500">Liên hệ quản gia trước 30 phút để làm thủ tục nhận phòng</p>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                        <div style={{ marginLeft: "10%" }} className="w-[30%] h-full border-2 border-gray-200  rounded-2xl shadow-lg p-4 pb-9 px-9 ">
                            <h2 className="font-bold mb-2 text-center ">
                                <span className=" text-center mb-3 block">  <span className="text-xl inline" style={{ color: "orangered" }}>{formatPrice(detail.homeStay.pricePerNight)} /đêm</span></span>
                            </h2>

                            <div className="rounded-2xl  border-2 border-gray-100 p-2" >
                                <Row className="border-b-1 border-gray-500" gutter={[16, 16]} >
                                    <Col className="p-2 border-r-2 border-gray-300" span={12} >
                                        <p className="font-bold mb-1">Ngày đến</p>
                                        <DatePicker placeholder="Chọn ngày" disabledDate={disabledDate} format={"DD/MM/YYYY"} value={booking.dateIn} onChange={(date) => setBooking({ ...booking, dateIn: date })} />
                                    </Col>
                                    <Col className="p-2" span={12}>
                                        <p className="font-bold mb-1">Ngày về</p>
                                        <DatePicker placeholder="Chọn ngày" disabledDate={disabledDate} format={"DD/MM/YYYY"} value={booking.dateOut}
                                            onChange={(date) => {
                                                if (date > booking.dateIn) {

                                                    setBooking({ ...booking, dateOut: date })
                                                }
                                                else {
                                                    notification.error({
                                                        message: 'Lỗi',
                                                        showProgress: true,
                                                        description: 'Quy định khi thuê HomeStay tối thiểu phải là 1 đêm vui lòng chọn lại ngày về',
                                                        placement: "topRight", // vị trí của thông báo (có thể thay đổi)
                                                        duration: 4, // thời gian hiển thị (giây)
                                                    });
                                                }
                                            }
                                            } />
                                    </Col>
                                </Row>
                                <Row >
                                    <Col className="p-2" span={24}>
                                        <p className="font-bold mb-1">Số người</p>
                                        <InputNumber min={detail.homeStay.minPerson} max={detail.homeStay.maxPerson} style={{ width: "100%" }} value={booking.numberofGuest} placeholder="Chọn số người" onChange={(vl) => {
                                            (vl >= detail.homeStay.minPerson && vl <= detail.homeStay.maxPerson) ? setBooking({ ...booking, numberofGuest: vl }) :
                                                notification.error({
                                                    message: 'Lỗi',
                                                    showProgress: true,
                                                    description: 'Bạn đang chọn số người thuê không hợp lệ',
                                                    placement: "topRight", // vị trí của thông báo (có thể thay đổi)
                                                    duration: 4, // thời gian hiển thị (giây)
                                                });
                                        }
                                        }
                                        />
                                    </Col>
                                </Row>
                                {/* <Row >
                                    <Col className="p-2" span={24}>
                                        <p className="font-bold mb-1">Tổng số đêm thuê</p>
                                        <InputNumber min={0} style={{ width: "100%" }} value={(booking.dateOut.diff(booking.dateIn, 'day') || 0)} />
                                    </Col>
                                </Row> */}
                            </div>

                            <p className="text-center mt-5">

                                <span>Các ngày được bôi xám là đã có người đặt</span>
                            </p>


                            <br />
                            <Button
                                icon={<ShoppingCartOutlined />}
                                type="primary"
                                style={{ backgroundColor: '#1593FF', height: 60 }}
                                className="text-xl mb-2 w-full font-medium rounded-2xl"
                                size="small"
                                onClick={() => {
                                    setShowCreateBooking(true)
                                }}
                            >
                                Đặt Ngay
                            </Button>
                            <br />

                            <Button
                                icon={<HeartOutlined />}
                                onClick={addFavorites}
                                type="default" danger
                                style={{ height: 60 }}
                                className="text-xl w-full font-medium rounded-2xl"
                                size="small"
                            >
                                Yêu Thích
                            </Button>
                        </div>
                    </div>
                    <div className="mt-5 ">
                        <h1 className="text-3xl font-bold mb-5">Chi tiết chỗ ở</h1>
                        <div className="text-lg w-[100%] text-justify leading-relaxed border-b border-gray-200 pb-4" >
                            {detail.detailHomeStay.note ? detail.detailHomeStay.note : "Chưa cập nhật"}
                        </div>
                    </div>
                    <div className="">
                        <div className="mt-5 w-[100%] border-b border-gray-300 pb-10 ">
                            <h1 className="text-2xl font-bold mb-6">Tiện nghi HomeStay</h1>
                            <div className="grid grid-cols-3 gap-7 mt-4">
                                {
                                    detail.amenities.map((a, index) =>
                                        <span key={index} className="text-lg font-medium"> <i className={a.icon + " mr-3 text-lg"}></i>{a.name}</span>)
                                }
                            </div>
                        </div>
                        <div className="mt-5 w-[100%]  pb-10 ">
                            <h1 className="text-2xl font-bold mb-6">Tiện ích miễn phí</h1>
                            <TextArea autoSize readOnly value={detail.detailHomeStay.utilities || "Chưa cập nhật"} className="text-lg leading-4 pb-2 font-medium box-border  text-gray-600 mt-4 overflow-hidden">
                            </TextArea>
                        </div>
                        <div className="mt-5 w-[100%] border-b border-gray-300 pb-10 ">
                            <h1 className="text-2xl font-bold mb-6">Nội quy về HomeStay ⚡</h1>
                            <div className=" text-lg mt-4 text-justify leading-relaxed ">

                                <TextArea autoSize readOnly value={detail.detailHomeStay.rules || "Chưa cập nhật"} className="text-lg leading-4 pb-2 font-medium box-border  text-gray-600 mt-4 overflow-hidden">
                                </TextArea>
                            </div>
                        </div>
                        <div className="mt-5 w-[68%] border-b border-gray-300 pb-10 ">
                            <h1 className="text-2xl font-bold mb-6">Giá phòng 💰</h1>
                            <div className=" text-lg mt-4 text-justify leading-relaxed ">

                                <div className="text-lg font-semibold w-full flex justify-between bg-gray-100 p-4">
                                    <span className="text-xl text-gray-600  font-bold">Giá đêm thứ nhất</span>
                                    <span className="text-xl text-gray-800">{formatPrice(detail.homeStay.pricePerNight)}</span>
                                </div>
                                <div className="text-lg font-semibold flex justify-between mt-2 bg-gray-50 p-4 p-4">
                                    <span className="text-xl text-gray-600 font-bold">Giá từ đêm tiếp theo</span>
                                    <span className="text-xl text-gray-800">{formatPrice(detail.homeStay.discountSecondNight)}</span>
                                </div>

                            </div>
                        </div>
                    </div>




                    <Modal
                        title="Tất cả ảnh"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        width={1000}
                        footer={null}
                    >
                        <Image.PreviewGroup>
                            {detail.homeStay.imagePreview.map((src, index) => (
                                <Image width={"100%"} className="object-cover" height={"45vh"} key={index} src={URL_SERVER + src} />
                            ))}
                        </Image.PreviewGroup>
                    </Modal>

                    {showCreateBooking && <CreateDetailBooking data={detail} bookingValue={booking} onClose={setShowCreateBooking} visible={showCreateBooking} disabledDates={disabledDate} />}


                    {/* Voucher */}

                    {promotions.length > 0 && <div className="mt-5 w-[68%] border-b border-gray-300 pb-10 ">
                        <h1 className="text-2xl font-bold mb-6">Mã giảm giá dành cho bạn </h1>
                        <div className="flex gap-4">
                            {

                                promotions.map(s => <VoucherCard voucher={s} />)
                            }
                        </div>
                    </div>}

                    {/* HomeStay Reviews */}

                    {<div className="mt-5 w-[100%] border-b border-gray-300 pb-10">
                        <h1 className="text-2xl font-bold mb-6">Đánh giá về HomeStay</h1>
                        <div className="flex flex-wrap gap-2">
                            {reviews.length === 0 ? (
                                <Empty description="Chưa có đánh giá nào" />
                            ) : (
                                reviews.map((s, i) => (
                                    <ReviewItem key={i} review={s} />
                                ))
                            )}
                        </div>
                    </div>}
                </div>
            </div > : <div></div>
            }
        </div>

    );
};
export default memo(DetailHomeStay)
