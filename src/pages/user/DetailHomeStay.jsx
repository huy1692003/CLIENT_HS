import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SearchHomeStay from "../../components/user/SearchHomeStay";
import { memo, useEffect, useRef, useState } from "react";
import { Button, Col, Image, Space, Table, Modal, Tag, DatePicker, InputNumber, Row, message, notification, Spin, Breadcrumb, Empty, Affix, Card, Divider, Avatar, Carousel, Rate } from "antd";
import { HeartFilled, HeartOutlined, MessageOutlined, ShoppingCartOutlined, UserOutlined, SmileOutlined, HomeOutlined, InfoCircleOutlined, EyeOutlined, FireTwoTone, StarFilled } from "@ant-design/icons";
import { formatPrice } from './../../utils/formatPrice';
import homestayService from "../../services/homestayService";
import CreateDetailBooking from "../../components/user/CreateDetailBooking";
import { URL_SERVER } from "../../constant/global";
import favoritesService from "../../services/favoritesService";
import { useRecoilValue } from "recoil";
import { initParamseach, userState } from "../../recoil/atom";
import promotionService from "../../services/promotionService";
import VoucherCard from "../../components/shared/VoucherCard";
import reviewRatingService from "../../services/reviewRatingService";
import ReviewItem from "../../components/user/ReviewItem";
import ChatAppCard from "../../components/shared/ChatAppCard";
import chatSupportService from "../../services/chatSupportService";
import { convertTimezoneToVN } from "../../utils/convertDate";
import CarouselButton from "../../components/shared/CarouselButton";
import serviceHomestayService from "../../services/serviceHomestayService";
import CardHomeStay from "../../components/user/CardHomeStay";



const DetailHomeStay = () => {
    const [param] = useSearchParams();
    const id = param.get('id');
    const [detail, setDetail] = useState();
    const [showCreateBooking, setShowCreateBooking] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [services, setServices] = useState([]);
    const [ortherHomestays, setOrtherHomestays] = useState([]);
    const [booking, setBooking] = useState({
        numberofGuest: null,
        dateIn: null,
        dateOut: null
    });
    const cus = useRecoilValue(userState);
    const navigate = useNavigate();
    const ref = useRef(null);
    const [showChat, setShowChat] = useState(false);
    const [conversation, setConversation] = useState(null);
    const carouselRef = useRef(null);
    const [showButtons, setShowButtons] = useState(false);




    useEffect(() => {
        if (detail) {
            getServices();
            getOrtherHomestays();
            getPromotion(detail);
            getReviews();
        }

    }, [detail]);

    const getOrtherHomestays = async () => {
        let resLocation = await homestayService.searchHomeStay(1, 1000000, { ...initParamseach, location: detail.homeStay.province });
        setOrtherHomestays(resLocation?.items);
    };

    const getServices = async () => {
        let res = await serviceHomestayService.getAllServices(detail.homeStay.ownerID);
        setServices(res);
    };


    const getPromotion = async (detail) => {
        let res = await promotionService.getAllByOwnwer(detail.homeStay.ownerID);
        const date = new Date();
        const validPromotions = res.filter(voucher => {
            const startDate = new Date(voucher.startDate);
            const endDate = new Date(voucher.endDate);
            return date >= startDate && date <= endDate;
        });
        setPromotions(validPromotions);
    };

    const getReviews = async () => {
        try {
            let res = await reviewRatingService.getReviewByHomeStay(id);
            console.log(res)
            res && setReviews(res);
        } catch (error) {
            setReviews([]);
        }
    };



    const addFavorites = async () => {
        if (!cus) {
            notification.error({
                showProgress: true,
                message: "Yêu cầu đăng nhập!",
                description: "Bạn cần đăng nhập để sử dụng chức năng này",
                btn: <Button onClick={() => navigate('/login-user')}>Đăng nhập ngay</Button>,
                duration: 4
            });
        } else {
            try {
                await favoritesService.addFavorites(detail.homeStay.homestayID, cus.idCus);
                notification.success({ message: 'Thông báo', description: "Thêm thành công HomeStay vào danh sách yêu thích của bạn" });
            } catch (error) {
                notification.error({ message: "Thông báo", description: "Bạn đã thêm HomeStay này vào danh sách yêu thích rồi" });
            }
        }
    };

    const getDataDetail = async () => {
        try {
            let result = await homestayService.viewDetailHomeStay(id);
            result && setDetail(result);
        } catch (error) {
            message.error("Có lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDataDetail();
        window.scrollTo(0, 0)
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

    const handleOpenConversation = async (idUserOwner, userNameOwner) => {
        if (!cus) {
            notification.warning({
                message: "Bạn cần đăng nhập để sử dụng dịch vụ này!",
                duration: 3,
                showProgress: true,
                btn: <Button onClick={() => { navigate("/login-user") }}>Đăng nhập</Button>
            });
            return;
        }
        try {
            const payload = {
                user1: cus.idUser,
                user2: idUserOwner,
                createdAt: convertTimezoneToVN(new Date()),
                lastMessageAt: convertTimezoneToVN(new Date()),
                userName1: cus.username,
                userName2: userNameOwner,
            };
            let res = await chatSupportService.openTabChat(payload);
            if (res) {
                setConversation(res);
                setShowChat(true);
            }
        } catch (error) {
            console.error(error);
            notification.error({ message: "Có lỗi rồi hãy quay lại vào lúc khác nhé!" });
        }
    };

    const handleBookRoom = (room) => {
        setSelectedRoom(room);
        setShowCreateBooking(true);
    };

    const renderRoomAmenities = (room) => {
        const amenities = [];
        if (room.hasBalcony) amenities.push({ icon: "fa-solid fa-door-open", text: "Ban công" });
        if (room.hasTv) amenities.push({ icon: "fa-solid fa-tv", text: "TV" });
        if (room.hasAirConditioner) amenities.push({ icon: "fa-solid fa-wind", text: "Điều hòa" });
        if (room.hasRefrigerator) amenities.push({ icon: "fa-solid fa-snowflake", text: "Tủ lạnh" });
        if (room.hasWifi) amenities.push({ icon: "fa-solid fa-wifi", text: "Wifi" });
        if (room.hasHotWater) amenities.push({ icon: "fa-solid fa-fire", text: "Nước nóng" });

        return amenities;
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
            <div>
                {detail ? (
                    <div ref={ref}>
                        <div className="rounded-xl">
                            <SearchHomeStay />
                        </div>

                        <div className="px-4 md:px-8 lg:px-16">
                            <div className="px-2 md:px-4 py-2 text-base mb-3 md:mb-5">
                                <Breadcrumb
                                    className="text-sm md:text-base"
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

                            <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
                                <div>
                                    <h1 className="name-homestay text-2xl md:text-3xl font-bold mb-2">{detail.homeStay.homestayName} ⚡</h1>
                                    <h4 className="name-homestay text-sm md:text-base font-normal mt-1">
                                        <i className="fa-solid fa-location-dot mr-1" style={{ fontSize: 16, color: "#11497C" }}></i>
                                        <span className="font-semibold">{detail.homeStay.addressDetail}</span> -
                                        <span className="font-semibold"> {detail.homeStay.province}</span> -
                                        <span className="font-semibold mr-2"> {detail.homeStay.district}</span>
                                        <i className="fa-solid fa-arrow-up-right-from-square mr-1" style={{ fontSize: 16, color: "#11497C" }}></i>
                                        <a className="text-blue-500 text-sm" href={detail.homeStay.linkGoogleMap} target="_blank" rel="noopener noreferrer"> Xem trên bản đồ</a>
                                    </h4>
                                </div>
                                <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
                                    <Button
                                        icon={<MessageOutlined />}
                                        type="primary"
                                        onClick={() => handleOpenConversation(detail.idUserOwner, detail.userNameOwner)}
                                        className="bg-green-600 hover:bg-green-700 text-xs md:text-sm"
                                    >
                                        Trao đổi với chủ nhà
                                    </Button>
                                    <Button
                                        icon={<HeartFilled />}
                                        onClick={addFavorites}
                                        type="default"
                                        danger
                                        className="text-xs md:text-sm"
                                    >
                                        Yêu thích
                                    </Button>
                                </div>
                            </div>

                            {/* Image Gallery Section */}
                            <div>

                                <div className="flex flex-col md:flex-row justify-between mt-4 relative" style={{ height: 'auto', minHeight: '250px', maxHeight: '400px' }}>
                                    <div className="w-full md:w-[51.3%] md:max-w-[51.3%] mb-1 md:mb-0">
                                        <Image
                                            height={250}
                                            width={"100%"}
                                            className="rounded-xl object-cover"
                                            src={URL_SERVER + detail.homeStay.imageHomestay?.split(',')[0]}
                                        />
                                    </div>
                                    <div className="w-full md:w-[48%] grid grid-cols-2 gap-1">
                                        {detail.homeStay.imageHomestay?.split(',').map((src, index) => (
                                            index > 0 && index < 5 && (
                                                <Image
                                                    key={index}
                                                    width={"100%"}
                                                    height={124}
                                                    className="rounded-xl object-cover"
                                                    src={URL_SERVER + src}
                                                />
                                            )
                                        ))}
                                    </div>
                                    <Button className="absolute inline bottom-2 right-1 bg-white p-1 pl-3 text-blue-900 text-xs md:text-sm" onClick={showModal}>
                                        Xem tất cả ảnh
                                    </Button>
                                </div>
                            </div>

                            {/* HomeStay Info Section */}
                            <div className="mt-[32%] lg:mt-4 py-3 pl-0 md:pl-2">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                                    {/* Left Column - HomeStay Info */}
                                    <div className="lg:col-span-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 pb-6 md:pb-8 border-b border-gray-200">
                                            <div className="text-base md:text-xl text-gray-700">
                                                <i className="fa-solid fa-house-user mr-2 md:mr-4 text-blue-500"></i>Homestay
                                            </div>
                                            <div className="text-base md:text-xl text-gray-700">
                                                <i className="fa-solid fa-clock mr-2 md:mr-4 text-orange-700"></i>
                                                Check-in: {detail.homeStay.timeCheckIn} | Check-out: {detail.homeStay.timeCheckOut}
                                            </div>
                                            <div className="text-base md:text-xl text-gray-700">
                                                <i className="fa-solid fa-star mr-2 md:mr-4 text-yellow-500"></i>
                                                Đánh giá: {detail.homeStay.averageRating}/5 ({detail.homeStay.reviewCount} đánh giá)
                                            </div>
                                            <div className="text-base md:text-xl text-gray-700">
                                                <i className="fa-solid fa-eye mr-2 md:mr-4 text-green-500"></i>
                                                Đã xem: {detail.homeStay.viewCount} lần
                                            </div>
                                        </div>

                                        {/* HomeStay Features */}
                                        <div className="mt-6 md:mt-8 pb-6 md:pb-8 border-b border-gray-200">
                                            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-blue-500">Đặc điểm nổi bật</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                {detail.detailHomeStay.hasSwimmingPool && (
                                                    <div className="flex items-center text-base md:text-lg text-gray-700">
                                                        <i className="fa-solid fa-swimming-pool mr-2 md:mr-3"></i>Hồ bơi
                                                    </div>
                                                )}
                                                {detail.detailHomeStay.hasBilliardTable && (
                                                    <div className="flex items-center text-base md:text-lg text-gray-700">
                                                        <i className="fa-solid fa-table-tennis-paddle-ball mr-2 md:mr-3"></i>Bàn bi-a
                                                    </div>
                                                )}
                                                {detail.detailHomeStay.manyActivities && (
                                                    <div className="flex items-center text-base md:text-lg text-gray-700">
                                                        <i className="fa-solid fa-gamepad mr-2 md:mr-3"></i>Nhiều hoạt động
                                                    </div>
                                                )}
                                                {detail.detailHomeStay.spaciousGarden && (
                                                    <div className="flex items-center text-base md:text-lg text-gray-700">
                                                        <i className="fa-solid fa-seedling mr-2 md:mr-3"></i>Vườn rộng rãi
                                                    </div>
                                                )}
                                                {detail.detailHomeStay.lakeView && (
                                                    <div className="flex items-center text-base md:text-lg text-gray-700">
                                                        <i className="fa-solid fa-water mr-2 md:mr-3"></i>View hồ
                                                    </div>
                                                )}
                                                {detail.detailHomeStay.mountainView && (
                                                    <div className="flex items-center text-base md:text-lg text-gray-700">
                                                        <i className="fa-solid fa-mountain mr-2 md:mr-3"></i>View núi
                                                    </div>
                                                )}
                                                {detail.detailHomeStay.seaView && (
                                                    <div className="flex items-center text-base md:text-lg text-gray-700">
                                                        <i className="fa-solid fa-ship mr-2 md:mr-3"></i>View biển
                                                    </div>
                                                )}
                                                {detail.detailHomeStay.riceFieldView && (
                                                    <div className="flex items-center text-base md:text-lg text-gray-700">
                                                        <i className="fa-solid fa-wheat-awn mr-2 md:mr-3"></i>View ruộng lúa
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mt-6 md:mt-8 pb-6 md:pb-8 border-b border-gray-200">
                                            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4"><i className="fa-solid fa-note-sticky mr-2 text-blue-500"></i>Mô tả</h2>
                                            <div
                                                className="text-base md:text-lg text-justify leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: detail.detailHomeStay.noteHomestay || "Chưa cập nhật" }}
                                            />
                                        </div>

                                        {/* Amenities */}
                                        <div className="mt-6 md:mt-8 pb-6 md:pb-8 border-b border-gray-200">
                                            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4"><i className="fa-solid fa-bed mr-2 text-blue-500"></i>Tiện nghi HomeStay</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                                {detail.amenities.map((a, index) => (
                                                    <span key={index} className="text-base md:text-lg font-medium">
                                                        <i className={a.icon + " mr-2 md:mr-3 text-base md:text-lg"}></i>{a.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>



                                    </div>

                                    {/* Right Column - Contact Info */}
                                    <div className="lg:col-span-1">
                                        <Card className="shadow-xl sticky top-24 rounded-2xl overflow-hidden border-0">
                                            <div className="bg-gradient-to-r from-blue-50 to-green-50 -mx-6 -mt-6 p-6 mb-6 border-b border-gray-100">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Avatar size={48} icon={<UserOutlined />} className="bg-blue-500" />
                                                    <div className="text-left">
                                                        <h3 className="text-xl font-bold text-gray-800">{detail.userNameOwner}</h3>
                                                        <p className="text-sm text-gray-500">Chủ HomeStay</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <Button
                                                    icon={<MessageOutlined />}
                                                    type="primary"
                                                    onClick={() => handleOpenConversation(detail.idUserOwner, detail.userNameOwner)}
                                                    className="w-full h-10 sm:h-12 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-0 shadow-md hover:shadow-lg transition-all duration-300"
                                                    size="large"
                                                >
                                                    <span className="font-medium text-sm sm:text-base">Trao đổi với chủ nhà</span>
                                                </Button>

                                                <Button
                                                    icon={<HeartFilled />}
                                                    onClick={addFavorites}
                                                    className="w-full h-10 sm:h-12 rounded-xl bg-white border border-red-300 hover:bg-red-50 text-red-500 hover:text-red-600 hover:border-red-400 shadow-sm hover:shadow-md transition-all duration-300"
                                                    size="large"
                                                >
                                                    <span className="font-medium text-sm sm:text-base">Thêm vào yêu thích</span>
                                                </Button>

                                                <div className="flex items-center justify-center mt-2 text-gray-500 text-xs sm:text-sm">
                                                    <i className="fa-solid fa-shield-halved mr-2"></i>
                                                    <span>Liên hệ an toàn qua Huystay</span>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                {/* Rooms Section */}
                                <div className="mt-8 md:mt-10">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"><i className="fa-solid fa-bed mr-2 text-blue-500"></i>Danh sách phòng</h2>
                                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                                        {detail.rooms.map((room) => (
                                            <Card
                                                key={room.roomId}
                                                className="shadow-sm hover:shadow-md transition-shadow duration-300"
                                                title={<h2 className="text-base md:text-lg font-semibold text-gray-800">{"Phòng: " + room.roomName}</h2>}
                                                extra={
                                                    <Button
                                                        type="primary"
                                                        icon={<ShoppingCartOutlined />}
                                                        className="bg-blue-500 hover-blue-white text-xs md:text-sm"
                                                        onClick={() => handleBookRoom(room)}
                                                    >
                                                        Đặt phòng này
                                                    </Button>
                                                }
                                            >
                                                <div className="flex flex-col lg:flex-row gap-4">
                                                    <div className="w-full lg:w-1/3">
                                                        <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 w-full overflow-hidden rounded-xl">
                                                            <div className="carousel-container"
                                                                onMouseEnter={() => setShowButtons(true)}
                                                                onMouseLeave={() => setShowButtons(false)}
                                                            >
                                                                {showButtons && (
                                                                    <>
                                                                        <CarouselButton direction="prev" onClick={() => carouselRef.current.prev()} />
                                                                        <CarouselButton direction="next" onClick={() => carouselRef.current.next()} />
                                                                    </>
                                                                )}
                                                                <Carousel ref={carouselRef} dots>
                                                                    {room.roomImage?.split(',').map((image, index) => (
                                                                        <div key={index} style={{ borderRadius: 10, width: '100%', height: '100%' }}>
                                                                            <Image
                                                                                src={URL_SERVER + image}
                                                                                alt={`${room.roomName} - ảnh ${index + 1}`}
                                                                                className="object-cover rounded-xl"
                                                                                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                                                                preview={true}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </Carousel>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-full lg:w-2/3">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 text-xs sm:text-sm md:text-base">
                                                            <div className="flex items-center gap-1 md:gap-2">
                                                                <i className="fas fa-home text-blue-500"></i>
                                                                <p><span className="font-medium">Loại phòng:</span> {room.roomType}</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 md:gap-2">
                                                                <i className="fas fa-money-bill-wave text-yellow-500"></i>
                                                                <p><span className="font-medium">Giá/đêm:</span> {formatPrice(room.pricePerNight)}</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 md:gap-2">
                                                                <i className="fas fa-money-bill-wave text-yellow-500"></i>
                                                                <p><span className="font-medium">Giá từ đêm thứ 2:</span> {formatPrice(room.priceFromSecondNight)}</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 md:gap-2">
                                                                <i className="fas fa-ruler-combined text-green-500"></i>
                                                                <p><span className="font-medium">Diện tích:</span> {room.roomSize} m²</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 md:gap-2">
                                                                <i className="fas fa-bed text-purple-500"></i>
                                                                <p><span className="font-medium">Số giường:</span> {room.bedCount}</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 md:gap-2">
                                                                <i className="fas fa-bath text-cyan-500"></i>
                                                                <p><span className="font-medium">Phòng tắm:</span> {room.bathroomCount}</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 md:gap-2">
                                                                <i className="fas fa-user text-indigo-500"></i>
                                                                <p><span className="font-medium">Người lớn:</span> {room.maxAdults}</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 md:gap-2">
                                                                <i className="fas fa-child text-pink-500"></i>
                                                                <p><span className="font-medium">Trẻ em:</span> {room.maxChildren}</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 md:gap-2">
                                                                <i className="fas fa-baby text-orange-500"></i>
                                                                <p><span className="font-medium">Em bé:</span> {room.maxBaby}</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 md:gap-2">
                                                                <i className="fas fa-tag text-red-500"></i>
                                                                <p>
                                                                    <span className="font-medium">Phụ thu:</span>
                                                                    <Tag color="orange" className="ml-1 text-xs">Người lớn: {formatPrice(room.extraFeePerAdult)}</Tag>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 md:mt-4">
                                                            <p className="font-medium text-gray-700 mb-1 md:mb-2 text-sm md:text-base">Tiện nghi phòng:</p>
                                                            <div className="flex flex-wrap gap-1 md:gap-2">
                                                                {room.hasBalcony && <span className="bg-blue-50 text-blue-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-door-open mr-1"></i>Ban công</span>}
                                                                {room.hasTv && <span className="bg-green-50 text-green-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-tv mr-1"></i>TV</span>}
                                                                {room.hasAirConditioner && <span className="bg-purple-50 text-purple-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-wind mr-1"></i>Điều hòa</span>}
                                                                {room.hasRefrigerator && <span className="bg-cyan-50 text-cyan-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-snowflake mr-1"></i>Tủ lạnh</span>}
                                                                {room.hasWifi && <span className="bg-yellow-50 text-yellow-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-wifi mr-1"></i>Wifi</span>}
                                                                {room.hasHotWater && <span className="bg-red-50 text-red-700 px-2 md:px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-hot-tub mr-1"></i>Nước nóng</span>}
                                                            </div>
                                                        </div>

                                                        {room.description && (
                                                            <div className="mt-3 md:mt-4">
                                                                <p className="font-medium text-gray-700 mb-1 text-sm md:text-base">Mô tả:</p>
                                                                <p className="text-gray-600 text-xs sm:text-sm">{room.description}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                {/* Modal for all images */}
                                <Modal
                                    title="Tất cả ảnh"
                                    visible={isModalVisible}
                                    onOk={handleOk}
                                    onCancel={handleCancel}
                                    width={1000}
                                    footer={null}
                                >
                                    <Image.PreviewGroup>
                                        {detail.homeStay.imageHomestay?.split(',').map((src, index) => (
                                            <Image
                                                width={"100%"}
                                                className="object-cover"
                                                height={"45vh"}
                                                key={index}
                                                src={URL_SERVER + src}
                                            />
                                        ))}
                                    </Image.PreviewGroup>
                                </Modal>

                                {/* Booking Modal */}
                                {showCreateBooking && selectedRoom && (
                                    <CreateDetailBooking
                                        data={detail}
                                        room={selectedRoom}
                                        bookingValue={booking}
                                        onClose={setShowCreateBooking}
                                        visible={showCreateBooking}
                                    />
                                )}
                                {services.length > 0 && (
                                    <div className="mt-6 md:mt-8 pb-6 md:pb-8 w-full md:w-3/4 border-b border-gray-200">
                                        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4"><i className="fa-solid fa-handshake mr-2 text-blue-500"></i>Dịch vụ của chủ nhà</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                            {services.map((s, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] flex-shrink-0">
                                                        <Image
                                                            preview={false}
                                                            src={URL_SERVER + s.imagePreview}
                                                            alt={s.serviceName}
                                                            width={"100%"}
                                                            height={"100%"}
                                                            className="rounded-xl object-cover w-full h-full"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <b className="font-bold text-sm md:text-base">{s.serviceName}</b>
                                                        <p className="text-gray-500 text-xs md:text-sm">{formatPrice(s.price)}/{s.unit}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Vouchers */}
                                {promotions.length > 0 && (
                                    <div className="mt-6 md:mt-8 pb-6 md:pb-8 border-b border-gray-200">
                                        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4"><i className="fa-solid fa-tag mr-2 text-blue-500"></i>Mã giảm giá của Homestay dành cho bạn <FireTwoTone twoToneColor="#ff0000" /></h2>
                                        <div className="flex flex-wrap gap-3 md:gap-4">
                                            {promotions.map((s, index) => (
                                                <VoucherCard key={index} voucher={s} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Rules */}

                                <div className="mt-6 md:mt-8 pb-6 md:pb-8 border-b border-gray-200">
                                    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4"><i className="fa-solid fa-house-user mr-2 text-blue-500"></i>Nội quy HomeStay</h2>
                                    <div
                                        className="text-base md:text-base leading-relaxed bg-orange-50 p-4 rounded-xl"
                                        dangerouslySetInnerHTML={{ __html: detail.detailHomeStay.stayRules || "Chưa cập nhật" }}
                                    />
                                </div>

                                {/* Policies */}
                                <div className="mt-6 md:mt-8 pb-6 md:pb-8 border-b border-gray-200">
                                    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4"><i className="fa-solid fa-file-alt mr-2 text-blue-500"></i>Chính sách</h2>
                                    <div
                                        className="text-base md:text-base leading-relaxed bg-blue-50 p-4 rounded-xl"
                                        dangerouslySetInnerHTML={{ __html: detail.detailHomeStay.policies || "Chưa cập nhật" }}
                                    />
                                </div>

                                {/* Reviews */}
                                <div className="mt-6 md:mt-8 pb-6 md:pb-8">
                                    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4"><i className="fa-solid fa-comment mr-2 text-blue-500"></i>Nhận xét của khách hàng</h2>
                                    <div className="">
                                        <span className="text-3xl font-bold">{detail.homeStay.averageRating.toFixed(1)}</span>
                                        <span className="text-lg"> /5</span>
                                        <Rate disabled defaultValue={detail.homeStay.averageRating} className="text-yellow-500 ml-2" />
                                        <span className="text-sm text-gray-500 ml-2">({reviews.length} đánh giá)</span>
                                    </div>


                                    <div className="">

                                        {reviews.map((s, i) => (
                                            <ReviewItem key={i} review={s} />
                                        ))}

                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                                            <i className="fa-solid fa-house-user mr-2 text-blue-500"></i>Chỗ ở tương tự cùng địa điểm
                                        </h2>

                                        <div className="overflow-x-auto scrollbar-hide">
                                            <div className="flex gap-4">
                                                {ortherHomestays.map((s, i) => (
                                                    <>
                                                        <div key={i} className="flex-shrink-0 w-[300px]">
                                                            <CardHomeStay data={s} />
                                                        </div>
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Không tìm thấy HomeStay</div>
                )}
            </div>
            {conversation && showChat && (
                <ChatAppCard convertion={conversation} stateOpen={{ open: showChat, setOpen: setShowChat }} />
            )}
        </>
    );
};

export default memo(DetailHomeStay);