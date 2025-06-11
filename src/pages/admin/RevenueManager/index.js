import { memo, useEffect, useLayoutEffect, useState } from "react";
import { Button, Form, Input, Table, notification, DatePicker, Select, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import PaginateShared from "../../../components/shared/PaginateShared";
import { formatPrice } from "../../../utils/formatPrice";
import revenueService from "../../../services/revenueService";
import { convertDate, convertTimezoneToVN } from "../../../utils/convertDate";
import { FileExcelOutlined } from "@ant-design/icons";
import { settingFormat } from "../../../recoil/selector";
import { useRecoilValue } from "recoil";
import { render } from "@testing-library/react";
import BookingListTable from "./BookingListTable";
const { RangePicker } = DatePicker;
const { Option } = Select;

const initSearch = {
    start: null,
    end: null,
    phoneOwner: "",
    username: "",
};

const RevenueManager = () => {
    const [revenues, setRevenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingExcel, setLoadingExcel] = useState(false);
    const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
    const [totalRecord, setTotalRecord] = useState(0);
    const [searchParams, setSearchParams] = useState(initSearch);
    const [form] = useForm();
    const [isTimeFrameSelected, setIsTimeFrameSelected] = useState(false); // Trạng thái để kiểm soát vô hiệu hóa RangePicker
    const setting = useRecoilValue(settingFormat)
    const floorFee = setting["floorFee"]?.value || 10; // Lấy phí sàn từ setting, mặc định là 10 nếu không có giá trị


    const [viewDetailListBK, setViewDetailListBK] = useState({ show: false, data: [] })

    useLayoutEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const res = await revenueService.getRevenue(paginate, searchParams);
                if (res) {
                    setTotalRecord(res.totalCount);
                    setRevenues(res.items);
                }
            } catch (error) {
                notification.error({ message: "Có lỗi xảy ra khi lấy dữ liệu" });
            } finally {
                setLoading(false);
            }
        };

        if (searchParams.end && searchParams.start) {

            getData();
        }
    }, [searchParams, paginate]);


    const handleSearch = (data) => {
        setPaginate({ ...paginate, page: 1 });
        let startDate = data.range ? data.range[0] : null;
        let endDate = data.range ? data.range[1] : null;
        if (data.timeFrame) {
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)

            switch (data.timeFrame) {
                case "1week":
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 7);
                    endDate = new Date();
                    break;

                case "30days":
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 30);
                    endDate = new Date();
                    break;

                case "thisMonth":
                    startDate = new Date(currentYear, currentMonth, 1);
                    endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999); // ngày cuối cùng tháng này
                    break;

                case "lastMonth":
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const yearOfLastMonth = currentMonth === 0 ? currentYear - 1 : currentYear;
                    startDate = new Date(yearOfLastMonth, lastMonth, 1);
                    endDate = new Date(yearOfLastMonth, lastMonth + 1, 0, 23, 59, 59, 999); // ngày cuối tháng trước
                    break;

                case "thisYear":
                    startDate = new Date(currentYear, 0, 1);
                    endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);
                    break;
            }
        }

        setSearchParams({
            ...data,
            start: startDate ? convertTimezoneToVN(startDate) : null,
            end: endDate ? convertTimezoneToVN(endDate) : null,
        });
    };

    const handleExportExcel = async () => {

        setLoadingExcel(true)
        try {
            const res = await revenueService.exportExcel(searchParams);
            const url = window.URL.createObjectURL(new Blob([res]));
            const link = document.createElement('a');
            link.href = url;

            // Đặt tên file
            link.setAttribute('download', 'export.xlsx');
            document.body.appendChild(link);
            link.click();

            // Dọn dẹp tài nguyên
            link.parentNode.removeChild(link);

        } catch (error) {
            notification.error({ message: "Có lỗi xảy ra khi lấy dữ liệu" });
        } finally {
            setLoadingExcel(false);
        }
    }

    const handleTimeFrameChange = (value) => {
        setIsTimeFrameSelected(!!value); // Khi chọn khoảng thời gian, vô hiệu hóa RangePicker
        form.setFieldsValue({ range: [] }); // Xóa giá trị của range khi chọn khoảng thời gian
    };

    const columns = [
        {
            title: "Tên đối tác",
            dataIndex: "fullname",
            key: "fullName",
            render: (vl) => <span style={{ width: 100 }} className="block w-52">{vl}</span>
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            render: (vl) => <span className="inline-block min-w-10">{vl}</span>

        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (vl) => <span className="inline-block min-w-10">{vl}</span>

        },
        {
            title: "Tài khoản",
            dataIndex: "username",
            key: "username",
            render: (vl) => <span className="inline-block min-w-10">{vl}</span>

        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Tên ngân hàng",
            dataIndex: "nameBank",
            key: "nameBank",
        },
        {
            title: "Số tài khoản",
            dataIndex: "numberBank",
            key: "numberBank",
        },
        {
            title: "Số lượng Booking",
            dataIndex: "countBooking",
            key: "countBooking",
        },
        {
            title: "Thực lĩnh tiền phòng từ đối tác",
            dataIndex: "revenue",
            key: "revenue",
            render: (text) => (text ? formatPrice(text) : "Chưa rõ"),
        },
        {
            title: "Phải trả đối tác (- Phí sàn " + floorFee + "%)",
            dataIndex: "revenue",
            key: "revenue",
            render: (text) => (text ? formatPrice(text * (1 - floorFee / 100)) : "Chưa rõ"),
        },
        {
            title: "Doanh thu về công ty",
            dataIndex: "revenue",
            key: "revenue",
            render: (text) => (text ? formatPrice(text * (floorFee / 100)) : "Chưa rõ"),
        },
        {
            title: "Thao tác",
            render: (value) => <>
                <Button type="primary" onClick={() => setViewDetailListBK({ show: true, data: value.bookings })}>Xem chi tiết</Button>
            </>
        },
    ];
  
    console.log(revenues)
    return (
        <div className="max-w-full overflow-scroll">
            <div className="flex justify-between mb-4">
                <h3 className="text-2xl font-bold">Kết toán doanh thu</h3>
                {searchParams.start && searchParams.end && <Button loading={loadingExcel} onClick={handleExportExcel} className="text-white bg-green-700 rounded-2xl text-base py-2" icon={<FileExcelOutlined />}>Xuất Excel</Button>}
            </div>

            <Form
                className="grid grid-cols-4 gap-2 gap-y-3"
                form={form}
                layout="vertical"
                onFinish={handleSearch}
            >
                <Form.Item label="Ngày bắt đầu và kết thúc" name="range">
                    <RangePicker className="w-full" format="DD-MM-YYYY" disabled={isTimeFrameSelected} />
                </Form.Item>
                <Form.Item label="Khoảng thời gian" name="timeFrame">
                    <Select placeholder="Chọn khoảng thời gian" allowClear onChange={handleTimeFrameChange}>
                        <Option value="1week">1 tuần gần nhất</Option>
                        <Option value="30days">30 ngày gần nhất</Option>
                        <Option value="thisMonth">Tháng này</Option>
                        <Option value="lastMonth">Tháng trước</Option>
                        <Option value="thisYear">Năm nay</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Số điện thoại chủ sở hữu" name="phoneOwner">
                    <Input placeholder="Nhập số điện thoại" allowClear />
                </Form.Item>
                <Form.Item label="Tên tài khoản" name="username">
                    <Input placeholder="Nhập tên tài khoản" allowClear />
                </Form.Item>
            </Form>

            <div className="flex justify-between mt-4 mb-4">
                <span className="text-2xl font-bold">Danh sách  {searchParams.start && searchParams.end && <span className="font-normal text-lg">{" ( Từ ngày " + convertDate(searchParams.start) + " đến ngày " + convertDate(searchParams.end) + ")"}</span>}</span>
                <div className="flex gap-2">
                    <Button type="primary" onClick={form.submit} htmlType="submit">
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={() => {
                            setPaginate((prev) => ({ ...prev, page: 1 }))
                            setSearchParams(initSearch);
                            setRevenues([])
                            form.resetFields();
                        }}
                    >
                        Làm mới
                    </Button>
                </div>
            </div>
            <div className="w-full">

                <Table

                    className="min-h-[50vh] w-full overflow-x-scroll"
                    bordered

                    dataSource={revenues}
                    loading={loading}
                    columns={columns}
                    pagination={false}
                />
                {totalRecord > 0 && <PaginateShared
                    align="end"
                    page={paginate.page}
                    pageSize={paginate.pageSize}
                    setPaginate={setPaginate}
                    totalRecord={totalRecord}
                />}
            </div>
            {
                viewDetailListBK &&
                <Modal  okButtonProps={false} cancelButtonProps={false} width={1000}  open={viewDetailListBK.show} onCancel={() => setViewDetailListBK((prev) => ({ ...prev, show: false, data: [] }))}>
                    <BookingListTable bookings={viewDetailListBK.data??[]}/>
                </Modal>
            }
        </div>
    );
};

export default memo(RevenueManager);
