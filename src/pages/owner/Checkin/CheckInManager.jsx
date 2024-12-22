import { Table, Tooltip, Space, Tag, message, Button, notification, Modal, Input, Descriptions, Spin, Steps, Select, InputNumber, DatePicker } from "antd";
import { memo, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isLoadingOwner, userState } from "../../../recoil/atom";
import bookingService from "../../../services/bookingService";
import { CheckCircleFilled, CheckCircleOutlined, CheckOutlined, CloseOutlined, CloseSquareFilled, EyeFilled, FilterFilled, HomeOutlined, Loading3QuartersOutlined, ProfileTwoTone, SearchOutlined } from '@ant-design/icons';
import { convertDate, convertDateTime, convertTimezoneToVN } from "../../../utils/convertDate";
import { use } from "react";
import StepProcessBooking from "../../../components/shared/StepProcessBooking";
import Search from "antd/es/transfer/search";
import { Option } from "antd/es/mentions";
import LabelField from "../../../components/shared/LabelField";
import moment from 'moment-timezone';
import dayjs from "dayjs";
import PaginateShared from "../../../components/shared/PaginateShared";
const initSearch = {
    name: '',
    email: '',
    phone: '',
    startDate: new Date(),
    endDate: null
}
export const statusBooking = [
    { index: 10, des: "Tất cả đơn", color: "black", backgroundColor: "" },
    { index: 1, des: "Đang chờ xác nhận", color: "text-white", backgroundColor: "bg-orange-400" },
    { index: 2, des: "Đang chờ thanh toán", color: "text-black", backgroundColor: "bg-yellow-400" },
    { index: 3, des: "Đang chờ nhận phòng", color: "text-white", backgroundColor: "bg-sky-400" },
    { index: 4, des: "Đang chờ CheckIn", color: "text-white", backgroundColor: "bg-blue-400" },
    { index: 5, des: "Đang chờ CheckOut", color: "text-white", backgroundColor: "bg-purple-400" },
    { index: 6, des: "Đã hoàn thành", color: "text-white", backgroundColor: "bg-green-400" },
    { index: -1, des: "Đã bị hủy", color: "text-white", backgroundColor: "bg-red-500" },
];


const getStatus = (index) => {
    return statusBooking.find(item => item.index === index)
}


const CheckinManager = () => {
    const [bookings, setBookings] = useState([]);
    const [status, setStatus] = useState(4);
    const [search, setSearch] = useState(initSearch);
    const [searchLocal, setSearchLocal] = useState(initSearch);
    const [loadingTable, setLoadingTable] = useState(true)
    const [totalRecord, setTotalRecord] = useState(0);
    const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
    const [inforStatus, setInforStatus] = useState(getStatus(10));
    const [owner, _] = useRecoilState(userState);
    const [showHandleBooking, setShowHandleBooking] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null); // Booking được chọn để xem chi tiết
    const [isModalVisible, setIsModalVisible] = useState(false);  // Trạng thái hiển thị Modal
    const setLoading = useSetRecoilState(isLoadingOwner); // Loading chung cho toàn bộ component

    useEffect(() => {
        getData();
        setInforStatus(getStatus(status))
    }, [status, owner, search ,paginate]);




    console.log(search)

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
            let data = await bookingService.getBookingByOwner(owner.idOwner, status,paginate.page,paginate.pageSize, search);

            data && setBookings(data.items);
            data && setTotalRecord(data.totalRecords);

        } catch (error) {
            message.error("Có lỗi khi lấy dữ liệu từ máy chủ, hãy thử lại sau!");
        } finally {
            setLoadingTable(false)
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
    async function confirmCheckOut(bookingID) {
        try {
            await bookingService.confirmCheckOut(bookingID);
            getData();
            notification.success({
                message: "Thành Công",
                description: `Xác nhận checkout đơn đặt phòng #${bookingID} thành công!`,
            });
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: `Có lỗi khi xác nhận  checkout đơn đặt phòng #${bookingID}. Hãy thử lại sau!`,
            });
        }
    }


    const columns = [
        {
            title: "Mã Đặt Phòng",
            dataIndex: "bookingID",
            key: "bookingID",

        },
        {
            title: "Mã HomeStay",
            dataIndex: "homeStayID",
            key: "homeStayID",
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
            title: "Tổng Giá Tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => `${price.toLocaleString()} VNĐ`,
        },
        {
            title: "Trạng Thái",
            key: "status",
            render: (record) => {
                const status = statusBooking.find(item => item.index === record.status); // Tìm trạng thái theo index
                if (status) {
                    return (
                        <Tag
                            className={`text-xs font-medium ${status.color} ${status.backgroundColor} px-3 py-1 rounded-xl`}
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
            render: (record) => (
                <span className="flex gap-2 w-[100]">

                    {status > 2 && status < 6 && <ButtonWaiting record={record} />}
                    <ButtonViewDetail record={record} />
                </span>
            ),
        },
    ];

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

                <span className="text-xl font-bold text-gray-800">Khách hàng CheckIn </span>


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
            <div className="text-center">

                <Button className="m-auto" type="primary" onClick={() => {
                    setPaginate({...paginate,page:1})
                    setSearch(searchLocal)
                }}>Lọc kết quả</Button>
            </div>


            <div className="my-2 text-lg font-bold">Danh sách Khách Hàng chờ CheckIn</div>
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
                width={900}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Đóng
                    </Button>,
                ]}
            >
                {selectedBooking && (
                    <div className="flex justify-between ">
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Mã Đặt Phòng">
                                {selectedBooking.bookingID}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã HomeStay">
                                {selectedBooking.homeStayID}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tên Khách">
                                {selectedBooking.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {selectedBooking.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số Điện Thoại">
                                {selectedBooking.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng số người sử dụng">
                                {selectedBooking.numberOfGuests + " người"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày Đến">
                                {new Date(selectedBooking.checkInDate).toLocaleDateString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày Về">
                                {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng Giá Tiền">
                                {`${selectedBooking.totalPrice.toLocaleString()} VND`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng Thái">
                                {getStatus(selectedBooking.status)?.des || "Không xác định"}
                            </Descriptions.Item>
                        </Descriptions>
                        {selectedBooking.isSuccess === 1 &&
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
export default memo(CheckinManager)
