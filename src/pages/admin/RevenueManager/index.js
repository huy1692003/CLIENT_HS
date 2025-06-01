import { memo, useEffect, useLayoutEffect, useState } from "react";
import { Button, Form, Input, Table, notification, DatePicker, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import PaginateShared from "../../../components/shared/PaginateShared";
import { formatPrice } from "../../../utils/formatPrice";
import revenueService from "../../../services/revenueService";
import { convertDate, convertTimezoneToVN } from "../../../utils/convertDate";
import { FileExcelOutlined } from "@ant-design/icons";
import { settingFormat } from "../../../recoil/selector";
import { useRecoilValue } from "recoil";

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
            if (data.timeFrame === "1week") {
                // Tính toán 1 tuần trước
                startDate = new Date(today.setDate(today.getDate() - 7));
                endDate = new Date();
            } else if (data.timeFrame === "30days") {
                // Tính toán 30 ngày trước
                startDate = new Date(today.setDate(today.getDate() - 30));
                endDate = new Date();
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
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Tài khoản",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
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
    ];

    return (
        <>
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

            <Table

                className="min-h-[50vh]"
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
        </>
    );
};

export default memo(RevenueManager);
