import { memo, useEffect, useState } from "react";
import { Table, Tag, Tooltip, notification, message, Form, Input, InputNumber, Select, Button, Image } from "antd";
import { ClearOutlined, DeleteFilled, EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import homestayService from "../../../services/homestayService";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../../utils/formatPrice";
import { Option } from "antd/es/mentions";
import PaginateShared from "../../../components/shared/PaginateShared";
import { URL_SERVER } from "../../../constant/global";

const initSearch = {
    location: "", // Địa điểm
    priceRange: "", // Khoảng giá (ví dụ: "100000-500000")
    name: "", // Tên HomeStay
    numberOfBedrooms: null, // Số phòng ngủ
    numberOfLivingRooms: null, // Số phòng khách
    numberOfBathrooms: null, // Số phòng tắm
    numberOfKitchens: null, // Số phòng bếp
    numberofGuest: null, // Số lượng khách
};

const HomeStayManager = ({ status }) => {
    const owner = useRecoilValue(userState);
    const [homeStays, setHomeStays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState(initSearch)
    const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
    const [total, setTotal] = useState(0); // Tổng số mục
    const navigate = useNavigate()
    const [form] = Form.useForm();
    useEffect(() => {

        const fetchHomeStays = async () => {
            setLoading(true);
            try {
                const data = await homestayService.getHomeStayByOwner(status, owner.idOwner, searchParams, paginate);
                console.log(data)
                setHomeStays(data.items);
                setTotal(data.totalCount)
            } catch (error) {
                console.error("Error fetching homestays:", error);
            } finally {
                setLoading(false);

            }
        };

        fetchHomeStays();
    }, [status, owner.id, searchParams, paginate]);


    const handleSearch = (searchParams) => {
        setPaginate({ ...paginate, page: 1 })
        setSearchParams(searchParams)
    };

    const columns = [
        {
            title: 'Mã',

            key: 'homestayID',
            render: (h) => <span>{h.homeStay.homestayID}</span>, // Hiển thị Homestay ID
        },
        {
            title: 'Ảnh preview',

            key: 'image',
            render: (h) => <Image width={140} height={100} className="rounded-xl object-cover" src={URL_SERVER + h.homeStay.imagePreview[0] || ""}></Image>, // Hiển thị Tên HomeStay
        },
        {
            title: 'Tên',

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
            title: 'Số phòng ngủ',

            key: 'numberOfBedrooms',
            render: (h) => <span>{h.detailHomeStay.numberOfBedrooms}</span>, // Hiển thị Số phòng ngủ
        },
        {
            title: 'Số phòng khách',

            key: 'numberOfLivingRooms',
            render: (h) => <span>{h.detailHomeStay.numberOfLivingRooms}</span>, // Hiển thị Số phòng khách
        },
        {
            title: 'Số phòng tắm',

            key: 'numberOfBathrooms',
            render: (h) => <span>{h.detailHomeStay.numberOfBathrooms}</span>, // Hiển thị Số phòng tắm
        },
        {
            title: 'Số bếp',

            key: 'numberOfKitchens',
            render: (h) => <span>{h.detailHomeStay.numberOfKitchens}</span>, // Hiển thị Số bếp
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="text-center" style={{ width: 120 }}>

                    <Tooltip title="Chỉnh sửa">
                        <Button
                            size="middle"
                            type="default"
                            shape="circle"
                            icon={<EditOutlined />} // Biểu tượng Chỉnh sửa
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>

                    <Tooltip title="Xóa HomeStay">
                        <Button
                            size="middle"
                            type="default"
                            shape="circle"
                            className="ml-1"
                            danger
                            icon={<DeleteFilled />} // Biểu tượng Chỉnh sửa
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];





    const handleEdit = (record) => {
        // Xử lý hành động chỉnh sửa
        navigate(`/owner/homestay?idHomeStay=${record.homeStay.homestayID}`)
    };
    const handleDelete = async (record) => {
        // Xử lý hành động chỉnh sửa
        try {
            let res = await homestayService.deleteHomeStay(record.homeStay.homestayID)
            res && notification.success({ message: "Thông báo", description: res })
        } catch (error) {
            message.error("Có lỗi xảy ra khi xóa HomeStay")
        }
    };


    return (
        <>
            <h3 className="text-xl font-bold mb-5 flex justify-between items-center">
                <span className="text-gray-800">Quản lý HomeStay</span>



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
                    <Form.Item className="mb-2" name="Location" label="Địa điểm">
                        <Input placeholder="Nhập địa điểm muốn tìm" />
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

                    {/* Tên */}
                    <Form.Item className="mb-2" name="Name" label="Tên HomeStay">
                        <Input placeholder="Nhập tên HomeStay" />
                    </Form.Item>

                    {/* Số phòng ngủ */}
                    <Form.Item className="mb-2" name="NumberOfBedrooms" label="Số phòng ngủ">
                        <InputNumber min={0} placeholder="Nhập số phòng ngủ" style={{ width: "100%" }} />
                    </Form.Item>

                    {/* Số phòng khách */}
                    <Form.Item className="mb-2" name="NumberOfLivingRooms" label="Số phòng khách">
                        <InputNumber min={0} placeholder="Nhập số phòng khách" style={{ width: "100%" }} />
                    </Form.Item>

                    {/* Số phòng tắm */}
                    <Form.Item className="mb-2" name="NumberOfBathrooms" label="Số phòng tắm">
                        <InputNumber min={0} placeholder="Nhập số phòng tắm" style={{ width: "100%" }} />
                    </Form.Item>

                    {/* Số bếp */}
                    <Form.Item className="mb-2" name="NumberOfKitchens" label="Số bếp">
                        <InputNumber min={0} placeholder="Nhập số bếp" style={{ width: "100%" }} />
                    </Form.Item>

                    {/* Số người */}
                    <Form.Item className="mb-2" name="NumberofGuest" label="Số người tối đa">
                        <InputNumber min={0} placeholder="Nhập số người tối đa" style={{ width: "100%" }} />
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
                columns={columns}
                dataSource={homeStays}
                pagination={false}

            />
            <PaginateShared align="end" page={paginate.page} pageSize={paginate.pageSize} setPaginate={setPaginate} totalRecord={total} />

        </>
    );
};
export default memo(HomeStayManager)