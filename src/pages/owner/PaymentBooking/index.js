import { memo, useEffect, useLayoutEffect, useState } from "react"
import { Button, Form, Input, Select, Tag, DatePicker, Table, notification, InputNumber } from "antd";
import { render } from "@testing-library/react";
import { convertDateTime, convertTimezoneToVN } from "../../../utils/convertDate";
import { useForm } from "antd/es/form/Form";
import paymentService from "../../../services/paymentService";
import { formatPrice } from "../../../utils/formatPrice";
import PaginateShared from "../../../components/shared/PaginateShared";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
const { RangePicker } = DatePicker;
const initSearch = {
    bookingID: null,
    userName: "",
    email: "",
    advertisementID: null,
    contentPayment: "",
    paymentMethod: "",
    dateStart: null,
    dateEnd: null,
};
const PaymentBooking = ({ type =1}) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
    const [totalRecord, setTotalRecord] = useState(0);
    const [searchParams, setSearchParams] = useState(initSearch);
    const [form] = useForm()
    const user = useRecoilValue(userState)

    useLayoutEffect(() => {
        const getData = async () => {
            setLoading(true)
            try {
                let res = await paymentService.getPaymentByOwner(paginate, searchParams,user.idOwner, type)
                if (res) {
                    setTotalRecord(res.totalCount)
                    setPayments(res.items)
                }
                setLoading(false)

            }
            catch {
                notification.error({ message: "Có lỗi xảy ra khi lấy dữ liệu" })
                setLoading(false)
            }
        }
        getData()
    }, [searchParams, paginate, type])

    const handleSearch = async (data) => {
        setPaginate({ ...paginate, page: 1 })
        setSearchParams(
            {
                ...data,
                dateStart: data.DateStart ? convertTimezoneToVN(data.DateStart) : null,
                dateEnd: data.DateEnd ? convertTimezoneToVN(data.DateEnd) : null,
            })
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "paymentID",
            key: "paymentID",
        },
        ...[type === 1 ?
            {
                title: "ID Booking",
                key: "bookingID",
                dataIndex: "bookingID",
            }
            :
            {
                title: "ID Advertisement",
                key: "advertisementID",
                dataIndex: "advertisementID",
            },]
        ,
        {
            title: "Loại thanh toán",
            key: "bookingID",
            render: (row) => {
                console.log(row);
                return <Tag color={row.bookingID ? "orange" : "orange-inverse"}>{row.bookingID ? "Tiền phòng" : "Tiền quảng cáo"}</Tag>;
            }
        },
        {
            title: "Tên khách hàng",
            dataIndex: "fullName",
            key: "fullName",
            render: (text) => text ? text : "Chưa rõ", // Kiểm tra nếu null thì hiển thị "Chưa rõ"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text) => text ? text : "Chưa rõ", // Kiểm tra nếu null thì hiển thị "Chưa rõ"
        },
        {
            title: "Phương thức thanh toán",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            render: (text) => text ? text : "Chưa rõ", // Kiểm tra nếu null thì hiển thị "Chưa rõ"
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            render: (text) => text ? `${formatPrice(text)}` : "Chưa rõ", // Kiểm tra nếu null thì hiển thị "Chưa rõ"
        },
        {
            title: "Trạng thái thanh toán",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            render: (text) => text === null ? "Chưa rõ" : <Tag color={text === 1 ? "blue" : "error"}>{text === 1 ? "Thành công" : "Thất bại"}</Tag>, // Kiểm tra nếu null thì hiển thị "Chưa rõ"
        },
        {
            title: "Ngày thanh toán",
            dataIndex: "paymentDate",
            key: "paymentDate",
            render: (text) => text ? convertDateTime(text) : "Chưa rõ", // Kiểm tra nếu null thì hiển thị "Chưa rõ"
        },
        {
            title: "Ghi chú",
            dataIndex: "notePayment",
            key: "notePayment",
            render: (text) => text ? text : "Chưa rõ", // Kiểm tra nếu null thì hiển thị "Chưa rõ"
        },
    ];



    return (
        <>
            <div className="flex justify-between mb-4">
                <h3 className="text-2xl font-bold mb-2">Quản lý thanh toán </h3>
                <Tag className="text-lg py-0 flex justify-center text-center items-center rounded-xl" color={type === 1 ? "blue" : "green-inverse"}>{type === 1 ? "Thanh toán tiền phòng" : "Thanh toán tiền quảng cáo"}</Tag>
            </div>

            <Form
                className="grid grid-cols-4 gap-2 gap-y-3"
                form={form}
                layout="vertical"
                onFinish={handleSearch}

            >
                <Form.Item className="mb-0" label={type === 1 ? "BookingID (Mã đặt phòng)" : 'ID ADS (Mã quảng cáo)'} name={type === 1 ? "BookingID" : 'advertisementID'}>
                    <InputNumber className="w-full" placeholder="Nhập mã cần tìm " allowClear />
                </Form.Item>

                <Form.Item className="mb-0 col-span-2" label="Tên người dùng" name="UserName">
                    <Input placeholder="Nhập tên khách hàng" allowClear />
                </Form.Item>

                <Form.Item className="mb-0" label="Email" name="Email">
                    <Input placeholder="Nhập email khách hàng" allowClear />
                </Form.Item>
                

                <Form.Item className="mb-0" label="Nội dung thanh toán" name="contentPayment">
                    <Input placeholder="Nhập nội dung thanh toán" allowClear />
                </Form.Item>

                <Form.Item className="mb-0" label="Phương thức thanh toán" name="PaymentMethod">
                    <Select placeholder="Chọn phương thức thanh toán" allowClear>
                        <Select.Option value="Momo">Thanh toán qua Momo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Ngày bắt đầu" name="DateStart" className=" mb-0">
                    <DatePicker format="DD-MM-YYYY" className="w-full" />
                </Form.Item>
                <Form.Item label="Ngày kết thúc" name="DateEnd" className=" mb-0">
                    <DatePicker format="DD-MM-YYYY" className="w-full" />
                </Form.Item>
            </Form>

            <div className="flex justify-between mt-7 mb-4">
                <span className="text-2xl font-bold">Danh sách</span>

                <div className="flex gap-2 justify-center">
                    <Button type="primary" onClick={form.submit} htmlType="submit" style={{ marginRight: "10px" }}>
                        Tìm kiếm
                    </Button>
                    <Button onClick={() => {
                        setSearchParams(initSearch)
                        form.resetFields()
                    }}>Làm mới</Button>

                </div>
            </div>

            <Table
                bordered dataSource={payments} loading={loading} columns={columns}
                className="w-full"
                style={{ overflowX: "scroll" }}
                pagination={false} />
            <PaginateShared align="end" page={paginate.page} pageSize={paginate.pageSize} setPaginate={setPaginate} totalRecord={totalRecord} />


        </>
    )
}

export default memo(PaymentBooking)