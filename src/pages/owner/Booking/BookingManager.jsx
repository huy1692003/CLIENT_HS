import { Table, Tooltip, Space, Tag, message, Button, notification, Modal, Input, Descriptions, Select, DatePicker } from "antd";
import { memo, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoadingOwner, userState } from "../../../recoil/atom";
import bookingService from "../../../services/bookingService";
import { CheckCircleFilled, CloseSquareFilled, EyeFilled, FilePdfOutlined, ProfileTwoTone } from '@ant-design/icons';
import { convertDate, convertDateTime } from "../../../utils/convertDate";
import StepProcessBooking from "../../../components/shared/StepProcessBooking";
import { Option } from "antd/es/mentions";
import LabelField from "../../../components/shared/LabelField";
import dayjs from "dayjs";
import PaginateShared from "../../../components/shared/PaginateShared";
import useSignalR from "../../../hooks/useSignaIR";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../../utils/formatPrice";
import { URL_SERVER } from "../../../constant/global";
const initSearch = {
    name: '',
    email: '',
    phone: '',
    startDate: null,
    endDate: null
}
export const statusBooking = [
    { index: 10, des: "Tất cả đơn", color: "text-gray-800", backgroundColor: "bg-gray-100" },
    { index: 1, des: "Đang chờ xác nhận", color: "text-white", backgroundColor: "bg-orange-500" },
    { index: 2, des: "Đang chờ thanh toán", color: "text-black", backgroundColor: "bg-yellow-300" },
    { index: 3, des: "Đang chờ nhận phòng", color: "text-white", backgroundColor: "bg-sky-500" },
    { index: 4, des: "Đang chờ CheckIn", color: "text-white", backgroundColor: "bg-blue-500" },
    { index: 5, des: "Đang chờ CheckOut", color: "text-white", backgroundColor: "bg-purple-500" },
    { index: 6, des: "Đã hoàn thành", color: "text-white", backgroundColor: "bg-green-500" },
    { index: -1, des: "Đã bị hủy", color: "text-white", backgroundColor: "bg-red-500" },
];


const getStatus = (index) => {
    return statusBooking.find(item => item.index === index)
}


const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [status, setStatus] = useState(1);
    const [search, setSearch] = useState(initSearch);
    const [searchLocal, setSearchLocal] = useState(initSearch);
    const [loadingTable, setLoadingTable] = useState(true)
    const [totalRecord, setTotalRecord] = useState(0);
    const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
    const [inforStatus, setInforStatus] = useState(getStatus(10));
    const [owner, _] = useRecoilState(userState);
    const [reason, setReason] = useState("");
    const [showHandleBooking, setShowHandleBooking] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null); // Booking được chọn để xem chi tiết
    const [isModalVisible, setIsModalVisible] = useState(false);  // Trạng thái hiển thị Modal
    const setLoading = useSetRecoilState(isLoadingOwner); // Loading chung cho toàn bộ component
    const navigate = useNavigate();

    useEffect(() => {
        getData();
        setInforStatus(getStatus(status))
    }, [status, owner, search, paginate]);





    useEffect(() => {
        if (selectedBooking) {
            setSelectedBooking(bookings.find((booking) => booking.bookingID === selectedBooking.bookingID));

        }
    }, [bookings, selectedBooking]);

    const handleViewDetail = (record) => {
        setSelectedBooking(record); // Lưu thông tin booking được chọn
        setIsModalVisible(true);    // Hiển thị modal
    };

    const handleModalClose = () => {
        setIsModalVisible(false);   // Ẩn modal
        setSelectedBooking(null);   // Xóa thông tin booking sau khi đóng modal
    };
    const getData = async () => {
        setLoadingTable(true)
        try {
            let data = await bookingService.getBookingByOwner(owner.idOwner, status, paginate.page, paginate.pageSize, search);
            data && setBookings(data.items);
            data && setTotalRecord(data.totalRecords);
        } catch (error) {
            message.error("Có lỗi khi lấy dữ liệu từ máy chủ, hãy thử lại sau!");
        } finally {
            setLoadingTable(false)
        }
    };


    useSignalR("ReseiverBookingNew", (idOwnerRes, notifi) => {
        if (idOwnerRes === owner.idOwner) {
            getData()
        }
    })
    const handleConfirm = async (record) => {

        // Logic xác nhận đơn đặt phòng
        setLoading(true);
        try {
            await bookingService.confirm(record.bookingID);
            notification.success({
                message: "Thành Công",
                description: `Xác nhận đơn đặt phòng #${record.bookingID} thành công!`,
            });
            getData()

        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: `Có lỗi khi xác nhận đơn đặt phòng #${record.bookingID}. Hãy thử lại sau!`,
            });
        } finally {
            setLoading(false);
        }
    };


    const handleBooking = (record) => {
        setSelectedBooking(record);
        setShowHandleBooking(true);
    }

    async function confirmCheckIn(bookingID) {
        try {
            await bookingService.confirmCheckIn(bookingID);
            getData();
            notification.success({
                message: "Thành Công",
                description: `Xác nhận checkin đơn đặt phòng #${bookingID} thành công!`,
            });
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: `Có lỗi khi xác nhận checkin đơn đặt phòng #${bookingID}. Hãy thử lại sau!`,
            });
        }
    }
    async function confirmCheckOut(bookingID, jsonDetailExtraCost) {
        try {
            await bookingService.confirmCheckOut(bookingID, jsonDetailExtraCost);
            getData();
            notification.success({
                message: "Thành Công",
                description: `Xác nhận checkout đơn đặt phòng #${bookingID} thành công!`,
            });
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Lỗi",
                description: `Có lỗi khi xác nhận  checkout đơn đặt phòng #${bookingID}. Hãy thử lại sau!`,
            });
        }
    }

    console.log(selectedBooking)

    const handleReject = (record) => {
        setReason("")
        Modal.confirm({
            width: 500,
            title: 'Xác Nhận Từ Chối',
            content: (
                <div >
                    <p>Vui lòng nhập lý do từ chối đơn đặt phòng <span className="font-bold">#{record.bookingID}</span>:</p>
                    <Input.TextArea className="w-full"
                        rows={4}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
            ),
            onOk: async () => {
                setLoading(true);
                let reasonCancel = reason ? reason : "Chúng tôi rất làm tiếc với quý khách, phòng này đang gặp sự cố, vui lòng chọn ngày khác!"
                try {

                    await bookingService.cancel(record.bookingID, reasonCancel); // Truyền lý do từ chối vào service
                    notification.success({
                        message: "Đã Từ Chối",
                        description: `Từ chối đơn đặt phòng #${record.bookingID} thành công!`,
                    });
                    getData();

                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: `Có lỗi khi từ chối đơn đặt phòng #${record.bookingID}. Hãy thử lại sau!`,
                    });
                } finally {
                    setLoading(false);
                }
            },
            onCancel() { },
        });
    }

    const columns = [
      
        {
            title: "Mã Đặt Phòng",
            dataIndex: "bookingID",
            key: "bookingID",
            render: (text) => <span className="w-[30px] underline">{"#" + text || "Trống"}</span>,

        },
        {
            title: "Mã Homestay",
            dataIndex: "homeStayID",
            key: "homeStayID",
            render: (text) => <span className="w-[30px]">{"#" + text || "Trống"}</span>,
        },
        {
            title: "Tên Khách",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số Điện Thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Ngày Đến",
            dataIndex: "checkInDate",
            key: "checkInDate",
            render: (date) => convertDate(date),
        },
        {
            title: "Ngày Đi",
            dataIndex: "checkOutDate",
            key: "checkOutDate",
            render: (date) => convertDate(date),
        },
        {
            title: "Tiền Phòng",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => `${price.toLocaleString()} VNĐ`,
        },
        {
            title: "Ngày Đặt",
            dataIndex: "bookingDate",
            key: "bookingDate",
            render: (date) => convertDateTime(date),
        },
        {
            title: "Trạng Thái",
            key: "status",
            render: (record) => {
                const status = statusBooking.find(item => item.index === record.status); // Tìm trạng thái theo index
                if (status) {
                    return (
                        <Tag
                            className={`text-xs w-full text-center font-medium ${status.color} ${status.backgroundColor} px-3 py-1 rounded-xl`}
                        >
                            {status.des}
                        </Tag>
                    );
                }
                return <Tag color="gray">Không xác định</Tag>;
            },
        },
        {
            title: "Hành Động",
            key: "action",
            fixed: 'right',
            render: (record) => (
                <span className="flex gap-2 justify-center w-[100]">
                    {status === 1 && <ButtonPending record={record} />}
                    {status === 2 && <Tooltip title="Hủy Đơn Đặt Phòng">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<CloseSquareFilled />}
                            onClick={() => handleReject(record)}
                            style={{ backgroundColor: 'red', borderColor: 'red' }}
                        />
                    </Tooltip>}
                    {status > 2 && status < 6 && <ButtonWaiting record={record} />}
                    <ButtonViewDetail record={record} />
                    {record.linkBill &&
                        <Tooltip title="Xem hóa đơn">
                            <a href={URL_SERVER+record.linkBill} target="_blank" rel="noopener noreferrer">
                                <Button
                                    className="bg-green-500 text-white"
                                    shape="circle"
                                    icon={<FilePdfOutlined />}
                                />
                            </a>
                        </Tooltip>
                    }
                </span>
            ),
        }
    ];
    const ButtonPending = ({ record }) => {
        return (
            <>
                <Tooltip title="Xác Nhận">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<CheckCircleFilled />}
                        onClick={() => handleConfirm(record)}
                        style={{ backgroundColor: 'green', borderColor: 'green' }}
                    />
                </Tooltip>
                <Tooltip title="Từ Chối">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<CloseSquareFilled />}
                        onClick={() => handleReject(record)}
                        style={{ backgroundColor: 'red', borderColor: 'red' }}
                    />
                </Tooltip>
            </>)
    }
    const ButtonWaiting = ({ record }) => {
        return (
            <>

                <Tooltip title="Xử lý">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<ProfileTwoTone />}
                        onClick={() => handleBooking(record)}
                        style={{ backgroundColor: 'green', borderColor: 'green' }}
                    />
                </Tooltip>
            </>)
    }




    const ButtonViewDetail = ({ record }) => {
        return (
            <>
                <Tooltip title="Xem Chi Tiết">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<EyeFilled />}
                        onClick={() => handleViewDetail(record)}
                    />
                </Tooltip>
            </>)
    }


    return (
        <div >

            <h3 className=" mb-5 flex justify-between items-center">

                <span className="text-xl font-bold text-gray-800">Quản lý đơn đặt phòng</span>


            </h3>
            <div className="mb-5 grid grid-cols-3 gap-2">
                <LabelField label="Tên khách hàng"><Input value={searchLocal.name} allowClear onChange={(e) => setSearchLocal({ ...searchLocal, name: e.target.value })}></Input></LabelField>
                <LabelField label="Số điện thoại"><Input value={searchLocal.phone} allowClear onChange={(e) => setSearchLocal({ ...searchLocal, phone: e.target.value })}
                    className=""  ></Input></LabelField>

                <LabelField label="Email"><Input value={searchLocal.email} onChange={(e) => setSearchLocal({ ...searchLocal, email: e.target.value })}  ></Input></LabelField>

                <LabelField label="Ngày nhận phòng">
                    <DatePicker
                        type="date"
                        format="DD/MM/YYYY"
                        value={searchLocal.startDate ? dayjs(searchLocal.startDate) : null} // Chuyển giá trị thành dayjs nếu cần
                        onChange={(date, dateString) => {
                            setSearchLocal({ ...searchLocal, startDate: date ? date.format('YYYY-MM-DD') : null }); // Lưu trữ dưới dạng chuỗi ngày nếu cần
                        }}
                        style={{ width: "100%" }}
                    />
                </LabelField>

                <LabelField label="Ngày trả phòng">
                    <DatePicker
                        format="DD/MM/YYYY"
                        value={searchLocal.endDate ? dayjs(searchLocal.endDate) : null} // Chuyển đổi endDate thành dayjs nếu có giá trị
                        onChange={(date) => setSearchLocal({ ...searchLocal, endDate: date ? date.format('YYYY-MM-DD') : null })} // Chuyển date thành chuỗi ngày nếu cần
                        style={{ width: "100%" }}
                    />
                </LabelField>

                <LabelField label={"Trạng Thái"}>  <Select
                    value={status}
                    onChange={(value) => setStatus(value)}
                    style={{ width: "100%" }}
                >
                    {statusBooking.map((item) => (
                        <Option key={item.index} value={item.index}>
                            {item.des}
                        </Option>
                    ))}</Select></LabelField>


            </div>

            <div className="flex justify-between">

                <Button className="" type="primary" onClick={() => {
                    setPaginate({ ...paginate, pageSize: 1 })
                    setSearch(searchLocal)
                }}>Lọc kết quả tìm kiếm</Button>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white" onClick={() => {
                    navigate(`/owner/homestay-list?isCreateBooking=true`)
                }}>Tạo mới đơn đặt phòng</Button>
            </div>



            <div className="my-2 text-lg font-bold">Danh sách Đơn Đặt Phòng</div>
            <Table
                loading={loadingTable}
                className="w-full"
                style={{ overflowX: "scroll" }}
                bordered
                columns={columns}
                dataSource={bookings}
                rowKey="bookingID"
                pagination={false}
            />
            <PaginateShared align="end" page={paginate.page} pageSize={paginate.pageSize} setPaginate={setPaginate} totalRecord={totalRecord} />

            <Modal
                title={`Chi Tiết Đơn Đặt Phòng #${selectedBooking?.bookingID}`}
                visible={isModalVisible}
                onCancel={handleModalClose}
                width={"90vw"}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Đóng
                    </Button>,
                ]}
            >
                {selectedBooking && (
                    <div className="flex gap-5 ">
                        <Descriptions className="w-[55vw]" bordered column={1}>
                            <Descriptions.Item label="Mã HomeStay">
                                <b className="">#{selectedBooking.homeStayID}</b>
                            </Descriptions.Item>
                            <Descriptions.Item label="Thông Tin Khách">
                                <p>Họ tên : {selectedBooking.name}</p>
                                <p>Email  : {selectedBooking.email}</p>
                                <p>Số ĐT  : {selectedBooking.phone}</p>
                            </Descriptions.Item>
                            <Descriptions.Item label={"Thông tin phòng"}>
                                <Table
                                    dataSource={selectedBooking.detailBooking}
                                    pagination={false}
                                    bordered
                                    size="small"
                                    rowKey="roomId"
                                    columns={[
                                        {
                                            title: 'Mã',
                                            dataIndex: 'roomId',
                                            key: 'roomId',
                                            align: 'center',
                                        },
                                        {
                                            title: 'Tên phòng',
                                            dataIndex: 'roomName',
                                            key: 'roomName',
                                        },
                                        {
                                            title: 'Loại',
                                            dataIndex: 'roomType',
                                            key: 'roomType',
                                        },
                                        {
                                            title: 'Người lớn',
                                            key: 'adults',
                                            align: 'center',
                                            render: (_, record) => (
                                                <span>{record.numberAdults}/{record.maxAdults}</span>
                                            ),
                                        },
                                        {
                                            title: 'Trẻ em',
                                            key: 'children',
                                            align: 'center',
                                            render: (_, record) => (
                                                <span>{record.numberChildren}/{record.maxChildren}</span>
                                            ),
                                        },
                                        {
                                            title: 'Em bé',
                                            key: 'baby',
                                            align: 'center',
                                            render: (_, record) => (
                                                <span>{record.numberBaby}/{record.maxBaby}</span>
                                            ),
                                        },
                                    ]}
                                />
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày Sử Dụng">
                                {new Date(selectedBooking.checkInDate).toLocaleDateString()} <span className="text-blue-700"> đến </span>
                                {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
                            </Descriptions.Item>

                            <Descriptions.Item label="Chi Phí">
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <span className="w-48 text-gray-600">Giá phòng gốc:</span>
                                        <span className="font-medium">
                                            {selectedBooking.originalPrice
                                                ? formatPrice(selectedBooking.originalPrice)
                                                : "Không có"}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="w-48 text-gray-600">Giảm giá:</span>
                                        <span className="font-medium text-red-500">
                                            {selectedBooking.discountPrice
                                                ? formatPrice(selectedBooking.discountPrice)
                                                : "Không có"}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="w-48 text-gray-600">Mã giảm giá:</span>
                                        <span className="font-medium">
                                            {selectedBooking.discountCode || "Không có"}
                                        </span>
                                    </div>

                                    <div className="flex items-center font-bold">
                                        <span className="w-48 text-gray-600">Tổng tiền phòng:</span>
                                        <span className="text-blue-600">
                                            {formatPrice(selectedBooking.totalPrice)}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="w-48 text-gray-600">Phụ phí phát sinh:</span>
                                        <span className={`font-medium ${selectedBooking.extraCost ? 'text-orange-500' : ''}`}>
                                            {selectedBooking.extraCost
                                                ? formatPrice(selectedBooking.extraCost)
                                                : "Được tính khi checkout"}
                                        </span>
                                    </div>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú">
                                {selectedBooking.description ?? "Không có"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng Thái">
                                <Tag color="orange">

                                    {getStatus(selectedBooking.status)?.des || "Không xác định"}
                                </Tag>
                            </Descriptions.Item>
                            {
                                selectedBooking.reasonCancel && (
                                    <Descriptions.Item label="Lý Do Hủy">
                                        {selectedBooking.reasonCancel}
                                    </Descriptions.Item>
                                )
                            }


                        </Descriptions>
                        {selectedBooking.isConfirm &&
                            <div className="mt-7">
                                <h3 className="text-xl font-bold mb-1">Thông tin chi tiết</h3>
                                <StepProcessBooking selectedBooking={selectedBooking} confirmCheckIn={confirmCheckIn} confirmCheckOut={confirmCheckOut} />
                            </div>}
                    </div>


                )}
            </Modal>



            {
                selectedBooking?.bookingProcess?.stepOrder > -1 &&
                <Modal
                    title={`Xử lý đơn đặt phòng #${selectedBooking?.bookingID}`}
                    visible={showHandleBooking}
                    onCancel={() => setShowHandleBooking(false)}
                    footer={[
                        <Button key="close" onClick={() => setShowHandleBooking(false)}>
                            Đóng
                        </Button>,
                    ]}
                >
                    <StepProcessBooking selectedBooking={selectedBooking} confirmCheckIn={confirmCheckIn} confirmCheckOut={confirmCheckOut} />
                </Modal>
            }



        </div>
    );
};
export default memo(BookingManager)
