import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SearchHomeStay from "../../components/user/SearchHomeStay";
import { memo, useEffect, useState } from "react";
import { Button, Col, Image, Space, Table, Modal, Tag, DatePicker, InputNumber, Row, message, notification, Spin, Breadcrumb } from "antd";
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


export const getDisabledDates = (bookedDates) => {
    const disabledDates = [];

    bookedDates.forEach(({ checkInDate, checkOutDate }) => {
        const start = moment(checkInDate);
        const end = moment(checkOutDate);

        // Duyệt qua từng ngày trong khoảng và thêm vào mảng disabledDates
        for (let date = start; date.isBefore(end); date.add(1, 'days')) {
            disabledDates.push(date.clone());
        }
        // Thêm ngày checkOutDate vào disabledDates
        disabledDates.push(end.clone());
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
    const [booking, setBooking] = useState({
        numberofGuest: null,
        dateIn: null,
        dateOut: null
    });
    const cus = useRecoilValue(userState)
    const navigate = useNavigate()
    // Hàm tạo các ngày đã đặt phòng rồi


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

    useEffect(() => {
        const getDataDetail = async () => {
            try {
                let result = await homestayService.viewDetailHomeStay(id);
                result && setDetail(result);
                // Lay ve cac ngay ma booking da dc dat
                let resDateBooking = await bookingService.getBookingDateExisted(id);
                console.log(resDateBooking)
                resDateBooking && setBookedDate(resDateBooking)
            } catch (error) {
                message.error("Có lỗi khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        id && getDataDetail();
    }, [id]);





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
        <>

            {detail ? <div>
                <div style={{ backgroundColor: "#F5F5F5", padding: 20 }}>
                    <SearchHomeStay />
                </div>

                <div className="p-5">
                    <div className="px-4 py-2 bg-gray-100 mb-5">
                        <Breadcrumb
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
                            <h1 className="name-homestay text-2xl font-bold">{detail.homeStay.homestayName}</h1>
                            <h4 className="name-homestay text-sm font-normal mt-1">
                                <i className="fa-solid fa-location-dot mr-1" style={{ fontSize: 18, color: "#11497C" }}></i>
                                <span>{detail.homeStay.addressDetail}</span>
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
                            <div className="grid grid-cols-2 gap-5  pb-8 border-b-2 border-gray-300">
                                <div className="text-xl"><i className="fa-solid fa-house-user mr-4"></i>Homestay</div>
                                <div className="text-xl"><i className="fa-solid fa-bed mr-4"></i>{detail.detailHomeStay.numberOfBedrooms} Phòng ngủ</div>
                                <div className="text-xl"><i className="fa-solid fa-person-booth mr-4"></i>{detail.detailHomeStay.numberOfLivingRooms} Phòng khách</div>
                                <div className="text-xl"><i className="fa-solid fa-utensils mr-5"></i>{detail.detailHomeStay.numberOfKitchens} phòng bếp</div>
                                <div className="text-xl"><i className="fa-solid fa-bath mr-4"></i>{detail.detailHomeStay.numberOfBathrooms} phòng tắm</div>
                                <div className="text-xl"><i className="fa-solid fa-elevator mr-4"></i>Sức chứa {detail.homeStay.minPerson} khách (tối đa {detail.homeStay.maxPerson})</div>
                            </div>
                            {/*  */}

                            {/* New Section */}
                            <div className="mt-8 grid grid-cols-2 pb-8 gap-8 border-b-2 border-gray-300">
                                <div>
                                    <div className="flex items-center font-medium text-xl mb-2">
                                        <i className="fa-solid fa-utensils mr-4"></i>Quy định nấu ăn
                                    </div>
                                    <p className="text-gray-600">Homestay có đầy đủ tiện nghi để bạn có thể tự nấu nướng</p>
                                </div>
                                <div>
                                    <div className="flex items-center font-medium text-xl mb-2">
                                        <i className="fa-solid fa-dollar-sign mr-4"></i>Quy trình thanh toán
                                    </div>
                                    <p className="text-gray-600">Thanh toán 100% tiền phòng, thanh toán phần còn lại và các phụ thu phát sinh khác khi checkout</p>
                                </div>
                                <div>
                                    <div className="flex items-center font-medium text-xl mb-2">
                                        <i className="fa-solid fa-clock mr-4"></i>Check-in/Check-out
                                    </div>
                                    <p className="text-gray-600">Check-in sau 14:00 và check-out trước 12:00 ngày hôm sau</p>
                                </div>
                                <div>
                                    <div className="flex items-center font-medium text-xl mb-2">
                                        <i className="fa-solid fa-house mr-4"></i>Cách thức nhận phòng
                                    </div>
                                    <p className="text-gray-600">Liên hệ quản gia trước 30 phút để làm thủ tục nhận phòng</p>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                        <div style={{ marginLeft: "10%", boxShadow: "1px 1px 2px 1px gray" }} className="w-5/12 h-full  rounded-xl shadow-xl p-4 pb-9 px-9">
                            <h2 className="font-bold mb-2 text-center ">
                                <span className=" text-center mb-3 block">Giá chỉ từ  <span className="text-base inline" style={{ color: "orangered" }}>{formatPrice(detail.homeStay.pricePerNight)} /đêm</span></span>
                            </h2>

                            <div className="rounded-2xl  border-2 border-gray-300 p-2" >
                                <Row className="border-b-2 border-gray-300" gutter={[16, 16]} >
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
                                <span className="text-red-500 ml-1">Chú ý : </span>
                                <span>Các ngày được bôi xám là đã có người đặt</span>
                            </p>


                            <br />
                            <Button
                                icon={<ShoppingCartOutlined />}
                                type="primary"
                                style={{ backgroundColor: '#1593FF', height: 40 }}
                                className="mb-2 w-full font-medium rounded-2xl"
                                size="small"
                                onClick={() => {
                                    setShowCreateBooking(true)
                                }}
                            >
                                Đặt Phòng
                            </Button>
                            <br />

                            <Button
                                icon={<HeartOutlined />}
                                onClick={addFavorites}
                                type="primary" danger
                                style={{ height: 40 }}
                                className=" w-full font-medium rounded-2xl"
                                size="small"
                            >
                                Thêm vào DS Yêu Thích
                            </Button>
                        </div>
                    </div>
                    <div className="">
                        <div className="mt-5 w-7/12 border-b-2 border-gray-300 pb-10 ">
                            <h1 className="text-2xl font-bold mb-5">Tiện nghi HomeStay bao gồm</h1>
                            <div className="grid grid-cols-2 gap-7">
                                {
                                    detail.amenities.map((a, index) =>
                                        <span key={index} className="text-xl"> <i className="fa-solid fa-check text-orange-400 mr-3"></i>{a.name}</span>)
                                }
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 ">
                        <h1 className="text-2xl font-bold mb-5">Thông tin thêm</h1>
                        <div>
                            {detail.detailHomeStay.note ? detail.detailHomeStay.note : "Chưa cập nhật"}
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

                    {/* HomeStay Reviews */}
                    <div className="mt-5">
                        <HomeStayReviews />
                    </div>
                </div>
            </div > : <div></div>
            }
        </>

    );
};
export default memo(DetailHomeStay)
