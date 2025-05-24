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
    idHomeStay: "",
    location: "", // Địa điểm
    priceRange: "", // Khoảng giá (ví dụ: "100000-500000")
    roomCount: undefined, // Số phòng
    averageRating: "", // Đánh giá trung bình
    userName: "",
    fullName: "",
    email: "",
    phone: "",
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
        // 1 chấp nhận , -1 từ chối
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
            title: 'Mã',
            key: 'homestayID',
            render: (h) => <span>{h.homeStay.homestayID}</span>,
        },
        {
            title: 'Ảnh preview',
            key: 'image',
            render: (h) => (
                <Image
                    width={140}
                    height={100}
                    className="rounded-xl object-cover"
                    src={URL_SERVER + h.homeStay.imageHomestay?.split(',')[0] || ""}
                />
            ),
        },
        {
            title: 'Người sở hữu',
            key: 'user',
            render: (h) => <span>{h.owner.fullName}</span>,
        },
        {
            title: 'Phone',
            key: 'phone',
            render: (h) => <span>{h.owner.phoneNumber || "Chưa cập nhật"}</span>,
        },
        {
            title: 'Email',
            key: 'email',
            render: (h) => <span>{h.owner.email || "Chưa cập nhật"}</span>,
        },
        {
            title: 'Tên',
            key: 'homestayName',
            render: (h) => <span>{h.homeStay.homestayName}</span>,
        },
        {
            title: 'Thành phố/Tỉnh',
            key: 'province',
            render: (h) => <span>{h.homeStay.province}</span>,
        },
        {
            title: 'Phường/Huyện',
            key: 'district',
            render: (h) => <span>{h.homeStay.district}</span>,
        },
        {
            title: 'Địa chỉ CT',
            key: 'addressDetail',
            render: (h) => <span>{h.homeStay.addressDetail}</span>,
        },
        {
            title: 'Giá/đêm',
            key: 'pricePerNight',
            render: (h) => {
                // Lấy giá từ phòng đầu tiên (nếu có)
                const price = h.rooms && h.rooms.length > 0 ? h.rooms[0].pricePerNight : 0;
                return <span>Từ {formatPrice(price)}</span>;
            },
        },
        {
            title: 'Trạng thái',
            key: 'statusHomestay',
            render: (h) => {
                const status = h.homeStay.statusHomestay;
                let color;
                let text;
                switch (status) {
                    case 0:
                        color = 'red';
                        text = 'Chờ phê duyệt';
                        break;
                    case 1:
                        color = 'green';
                        text = 'Đang hiển thị';
                        break;
                    case 2:
                        color = 'gold';
                        text = 'Đang bảo trì';
                        break;
                    case -1:
                        color = 'volcano';
                        text = 'Bị từ chối';
                        break;
                    default:
                        color = 'default';
                        text = 'Không xác định';
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Số phòng',
            key: 'roomCount',
            render: (h) => <span>{h.rooms ? h.rooms.length : 0}</span>,
        },
        {
            title: 'Đánh giá',
            key: 'averageRating',
            render: (h) => {
                return (
                    <span>
                        {h.homeStay.reviewCount === 0 ? "Chưa có" :
                            <span>
                                {h.homeStay.averageRating}/5 <i className="fas fa-star text-yellow-500 ml-1"></i> ({h.homeStay.reviewCount})
                            </span>}
                    </span>
                )
            },
        },
        {
            title: 'Lượt xem',
            key: 'viewCount',
            render: (h) => <span>{h.homeStay.viewCount} <i className="fas fa-eye text-blue-500 ml-1"></i></span>,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="text-center" style={{ width: 120 }}>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            size="middle"
                            type="default"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    {status === 0 && 
                        <Tooltip title="Duyệt ngay">
                            <Button
                                size="middle"
                                type="primary"
                                shape="circle"
                                className="ml-1"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleApproval(record, 1)}
                            />
                        </Tooltip>
                    }
                    {status >=0 &&
                        <Tooltip title="Gỡ bỏ HomeStay">
                            <Button
                                size="middle"
                                type="default"
                                shape="circle"
                                className="ml-1"
                                danger
                                icon={<CloseCircleFilled />}
                                onClick={() => handleApproval(record, -1)}
                            />
                        </Tooltip>
                    }
                </div>
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

            <div>
                <Form form={form} className="grid grid-cols-5 gap-2 gap-y-0" layout="vertical" onFinish={handleSearch}>
                    {/* Mã HomeStay */}
                    <Form.Item className="mb-2 col-span-1" name="idHomeStay" label="Mã HomeStay">
                        <Input placeholder="Nhập mã HomeStay" />
                    </Form.Item>
                    
                    {/* Địa điểm */}
                    <Form.Item className="mb-2" name="location" label="Địa điểm">
                        <Input placeholder="Nhập địa điểm muốn tìm" />
                    </Form.Item>

                    {/* Giá */}
                    <Form.Item className="mb-2" name="priceRange" label="Khoảng giá">
                        <Select placeholder="Chọn khoảng giá" allowClear>
                            <Select.Option value="100000-500000">Từ 100k đến 500k</Select.Option>
                            <Select.Option value="500000-1000000">Từ 500k đến 1tr</Select.Option>
                            <Select.Option value="1000000-3000000">Từ 1tr đến 3tr</Select.Option>
                            <Select.Option value="3000000-5000000">Từ 3tr đến 5tr</Select.Option>
                            <Select.Option value="5000000-10000000000000000000000000">Trên 5tr</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* Số phòng */}
                    <Form.Item className="mb-2" name="roomCount" label="Số phòng tối thiểu">
                        <InputNumber min={0} placeholder="Nhập số phòng" style={{ width: "100%" }} />
                    </Form.Item>

                    {/* Đánh giá trung bình */}
                    <Form.Item className="mb-2" name="averageRating" label="Đánh giá trung bình">
                        <Select placeholder="Chọn đánh giá" allowClear>
                            <Select.Option value="1-2">1 đến 2 sao</Select.Option>
                            <Select.Option value="2-3">2 đến 3 sao</Select.Option>
                            <Select.Option value="3-4">3 đến 4 sao</Select.Option>
                            <Select.Option value="4-5">4 đến 5 sao</Select.Option>
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

                    {/* Nút tìm kiếm */}
                    <div className="col-span-5 mb-2 mt-4">
                        <div className="w-full flex gap-3 justify-between">
                            <span className="text-2xl font-bold">Danh sách</span>
                            <span className="flex gap-2">
                                <Form.Item className="mb-2">
                                    <Button type="primary" htmlType="submit" block icon={<SearchOutlined />}>
                                        Tìm kiếm
                                    </Button>
                                </Form.Item>
                                <Form.Item className="mb-2">
                                    <Button
                                        type="primary"
                                        className="bg-blue-900"
                                        onClick={() => {
                                            setSearchParams(initSearch)
                                            form.resetFields()
                                            handleSearch(initSearch)
                                        }}
                                        block
                                        icon={<ClearOutlined />}
                                    >
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
                columns={columns}
                dataSource={homeStays}
                pagination={false}
                className="w-full overflow-x-scroll"
                rowKey={(record) => record.homeStay.homestayID}
            />

            <PaginateShared
                align="end"
                page={paginate.page}
                pageSize={paginate.pageSize}
                setPaginate={setPaginate}
                totalRecord={total}
            />
            <ViewHomeStayModal
                visible={viewStay.show}
                setVisible={setViewStay}
                idHomeStay={viewStay.idHomeStay}
            />
        </>
    );
};
export default memo(HomeStayCensor)