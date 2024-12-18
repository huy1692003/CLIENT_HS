import { memo, useEffect, useState } from "react";
import { Table, Tag, Tooltip, notification, message, Form, Input, InputNumber, Select, Button, Image } from "antd";
import { CheckCircleOutlined, ClearOutlined, CloseCircleFilled, DeleteFilled, EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import homestayService from "../../../services/homestayService";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../../utils/formatPrice";
import { Option } from "antd/es/mentions";
import PaginateShared from "../../../components/shared/PaginateShared";
import { ViewHomeStayModal } from "../../../components/shared/ModalViewHomeStay";
import { URL_SERVER } from "../../../constant/global";

const initSearch = {
    location: "", // Địa điểm
    priceRange: "", // Khoảng giá (ví dụ: "100000-500000")
    name: "", // Tên HomeStay
    userName: "",
    fullName: "",
    email: "",
    phone: "",
    // Số lượng khách
};

const HomeStayCensor = ({ status }) => {
    const [homeStays, setHomeStays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState(initSearch)
    const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
    const [total, setTotal] = useState(0); // Tổng số mục
    const [form] = Form.useForm();
    const [viewStay, setViewStay] = useState({ show: false, idHomeStay: null })

    useEffect(() => {


        fetchHomeStays();
    }, [status, searchParams, paginate]);

    const fetchHomeStays = async () => {
        setLoading(true);
        try {
            const data = await homestayService.getHomeStayByAdmin(status, searchParams, paginate);
            console.log(data)
            setHomeStays(data.items);
            setTotal(data.totalCount)
        } catch (error) {
            console.error("Error fetching homestays:", error);
        } finally {
            setLoading(false);

        }
    };

    const handleSearch = (searchParams) => {
        setPaginate({ ...paginate, page: 1 })
        setSearchParams(searchParams)
    };

    const handleView = (record) => {
        // Xử lý hành động xem
        console.log('Xem chi tiết:', record);
        setViewStay({ show: true, idHomeStay: record.homeStay.homestayID })
    };

    const handleApproval = async (record, status) => {
        // 1 chấp nhận , 2 từ chối
        try {
            await homestayService.updateStatusApproval(record.homeStay.homestayID, status);

            // Hiển thị thông báo thành công
            notification.success({
                message: 'Thông báo',
                description: status === 1
                    ? 'Homestay đã được chấp nhận thành công!'
                    : 'Homestay đã bị từ chối!',
            });
            fetchHomeStays()

            // Có thể gọi lại hàm fetch lại dữ liệu nếu cần
            // fetchHomeStays();

        } catch (error) {
            // Hiển thị thông báo lỗi
            message.error('Có lỗi xảy ra khi cập nhật xét duyệt homestay.');
            console.error("Error updating homestay status:", error);
        }
    };


    const columns = [
        {
            title: 'Mã HStay',

            key: 'homestayID',
            render: (h) => <span>{"#" + h.homeStay.homestayID}</span>, // Hiển thị Homestay ID
        },
        {
            title: 'Ảnh preview',

            key: 'image',
            render: (h) => <Image width={140} height={100} className="rounded-xl object-cover" src={URL_SERVER + h.homeStay.imagePreview[0] || ""}></Image>, // Hiển thị Tên HomeStay
        },
        {
            title: 'Người sở hữu ',

            key: 'user',
            render: (h) => <span>{h.owner.fullName}</span>, // Hiển thị Tên HomeStay
        },
        {
            title: 'Phone',

            key: 'phone',
            render: (h) => <span>{h.owner.phoneNumber || "Chưa cập nhật"}</span>, // Hiển thị Tên HomeStay
        },
        {
            title: 'Email',

            key: 'email',
            render: (h) => <span>{h.owner.email || "Chưa cập nhật"}</span>, // Hiển thị Tên HomeStay
        },
        {
            title: 'Tên HomeStay',

            key: 'homestayName',
            render: (h) => <span>{h.homeStay.homestayName}</span>, // Hiển thị Tên HomeStay
        },

        {
            title: 'Thành phố/Tỉnh',
            key: 'province',
            render: (h) => <span>{h.homeStay.province}</span>, // Hiển thị Địa chỉ chi tiết
        },
        {
            title: 'Phường/Huyện',
            key: 'addressDetail',
            render: (h) => <span>{h.homeStay.district}</span>, // Hiển thị Địa chỉ chi tiết
        },
        {
            title: 'Địa chỉ CT',
            key: 'addressDetail',
            render: (h) => <span>{h.homeStay.district}</span>, // Hiển thị Địa chỉ chi tiết
        },
        {
            title: 'Giá/đêm',

            key: 'pricePerNight',
            render: (h) => <span>{formatPrice(h.homeStay.pricePerNight)}</span>, // Hiển thị Giá mỗi đêm
        },
        {
            title: 'Trạng thái',

            key: 'approvalStatus',
            render: (h) => {
                const status = h.homeStay.approvalStatus;
                let color;
                switch (status) {
                    case 0:
                        color = 'red';
                        break;
                    case 1:
                        color = 'green';
                        break;
                    case 2:
                        color = 'volcano';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color}>{status === 0 ? 'Chờ phê duyệt' : status === 1 ? 'Đang hiển thị' : 'Bị từ chối'}</Tag>;
            },
        },

        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="text-center flex" >
                    <Tooltip title="Xem chi tiết">
                        <Button
                            size="middle"

                            shape="circle"
                            icon={<EyeOutlined />} // Biểu tượng Xem chi tiết
                            className="mr-1"
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    {status === 0 && <Tooltip Tooltip title="Duyệt ngay">
                        <Button
                            size="middle"
                            type="primary"

                            shape="circle"
                            icon={<CheckCircleOutlined />} // Biểu tượng Xác nhận
                            className="ml-1"
                            onClick={() => handleApproval(record, 1)}
                        />
                    </Tooltip>
                    }
                    {
                        status < 2 &&

                        <Tooltip Tooltip title="Gỡ bỏ HomeStay" >
                            <Button
                                size="middle"
                                danger
                                shape="circle"
                                icon={<CloseCircleFilled />} // Biểu tượng Từ chối
                                className="ml-1"
                                onClick={() => handleApproval(record, 2)}
                            />
                        </Tooltip >
                    }
                </div >
            ),
        },
    ];




    return (
        <>
            <h3 className="text-xl font-bold mb-5 flex justify-between items-center">
                <span className="text-gray-800">Kiểm duyệt HomeStay</span>



                <span className="">
                    {status === 0 && (
                        <span className="text-lg bg-red-100 text-red-600 px-3 py-1 rounded-md shadow-sm">
                            Đang chờ phê duyệt
                        </span>
                    )}
                    {status === 1 && (
                        <span className="text-lg bg-green-100 text-green-600 px-3 py-1 rounded-md shadow-sm">
                            Đang hiện hành
                        </span>
                    )}
                    {status === 2 && (
                        <span className="text-lg bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md shadow-sm">
                            Bị từ chối
                        </span>
                    )}
                </span>
            </h3>

            <div >
                <Form form={form} className="grid grid-cols-4 gap-2 gap-y-0" layout="vertical" onFinish={handleSearch}>
                    {/* Địa điểm */}
                    <Form.Item className="mb-2" name="Location" label="Địa điểm HomeStay">
                        <Input allowClear placeholder="Nhập địa điểm muốn tìm" />
                    </Form.Item>
                    <Form.Item className="mb-2" name="Name" label="Tên HomeStay">
                        <Input allowClear placeholder="Nhập tên cần tìm" />
                    </Form.Item>

                    {/* Giá */}
                    <Form.Item className="mb-2" name="PriceRange" label="Khoảng giá" >
                        <Select placeholder="Chọn khoảng giá" allowClear>
                            <Select.Option value="100000-500000">Từ 100k đến 500k</Select.Option>
                            <Select.Option value="500000-1000000">Từ 500k đến 1tr</Select.Option>
                            <Select.Option value="1000000-3000000">Từ 1tr đến 3tr</Select.Option>
                            <Select.Option value="3000000-5000000">Từ 3tr đến 5tr</Select.Option>
                            <Select.Option value="5000000-10000000000000000000000000">Trên 5tr</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item className="mb-2" name="userName" label="Tên đăng nhập đối tác">
                        <Input allowClear placeholder="Nhập tên đăng nhập" />
                    </Form.Item>

                    <Form.Item className="mb-2" name="fullName" label="Họ và tên đối tác">
                        <Input allowClear placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item className="mb-2" name="email" label="Email đối tác">
                        <Input allowClear placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item className="mb-2" name="phone" label="Số điện thoại đối tác">
                        <Input allowClear placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    {/* Số người */}
                    <Form.Item className="mb-2" name="NumberofGuest" label="Sức chứa">
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    {/* Nút tìm kiếm */}
                    <div className="col-span-4  mb-2 mt-4" >
                        <div className="w-full flex gap-3 justify-between">
                            <span className="text-2xl font-bold">Danh sách</span>
                            <span className="flex gap-2">
                                <Form.Item className="mb-2" >
                                    <Button type="primary" htmlType="submit" block icon={<SearchOutlined />}>
                                        Tìm kiếm
                                    </Button>
                                </Form.Item>
                                <Form.Item className="mb-2" >
                                    <Button type="primary" className="bg-blue-900" onClick={() => {
                                        setSearchParams(initSearch)
                                        form.resetFields()
                                    }} block icon={<ClearOutlined />}>
                                        Xóa tìm kiếm
                                    </Button>
                                </Form.Item>
                            </span>

                        </div>
                    </div>
                </Form>
            </div>


            <Table
                loading={loading}
                bordered
                className="w-full"
                style={{overflowX:"scroll"}}
                columns={columns}
                dataSource={homeStays}
                pagination={false}

            />
            <PaginateShared align="end" page={paginate.page} pageSize={paginate.pageSize} setPaginate={setPaginate} totalRecord={total} />
            <ViewHomeStayModal
                visible={viewStay.show}
                setVisible={setViewStay}
                idHomeStay={viewStay.idHomeStay}
            />
        </>
    );
};
export default memo(HomeStayCensor)