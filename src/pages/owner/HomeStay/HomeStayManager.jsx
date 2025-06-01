import { memo, useEffect, useState } from "react";
import { Table, Tag, Tooltip, notification, message, Form, Input, InputNumber, Select, Button, Image, Modal } from "antd";
import { ClearOutlined, DeleteFilled, EditOutlined, EyeOutlined, SearchOutlined, SettingOutlined, TwitterSquareFilled } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import homestayService from "../../../services/homestayService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatPrice } from "../../../utils/formatPrice";
import { Option } from "antd/es/mentions";
import PaginateShared from "../../../components/shared/PaginateShared";
import { URL_SERVER } from "../../../constant/global";
import CreateDetailBooking from "../../../components/user/CreateDetailBooking";
import CardRoom from "../../../components/owner/CardRoom";

const initSearch = {
    idHomeStay: "",
    location: "", // Địa điểm
    priceRange: "", // Khoảng giá (ví dụ: "100000-500000")
    roomCount: undefined, // Số phòng
    averageRating: "", // Đánh giá trung bình


};

const HomeStayManager = ({ status }) => {
    const owner = useRecoilValue(userState);
    const [paramURL] = useSearchParams();
    const isCreateBooking = paramURL.get('isCreateBooking') || false;
    const [homeStays, setHomeStays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState(initSearch)
    const [paginate, setPaginate] = useState({ page: 1, pageSize: 10 });
    const [total, setTotal] = useState(0); // Tổng số mục
    const navigate = useNavigate()
    const [form] = Form.useForm();

    //Các state để tạo đơn đặt phòng tại quầy
    const [dataCreateBooking, setDataCreateBooking] = useState({ visible: false, setVisible: () => { }, homeStay: null, roomCurrent: null })
    const [showListRoom, setShowListRoom] = useState({ visible: false, rooms: [] })
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
    useEffect(() => {

        fetchHomeStays();
    }, [status, owner.id, searchParams, paginate]);

    const handleSearch = (searchParams) => {
        setPaginate({ ...paginate, page: 1 })
        setSearchParams(searchParams)
    };

    const columns = [
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <>
                    {
                        isCreateBooking ? (
                            <div className="text-center" style={{ width: 120 }}>
                                <Button type="primary" onClick={() => {
                                    setDataCreateBooking((prev) => ({ ...prev, homeStay: record }))
                                    setShowListRoom({ visible: true, rooms: record.rooms })
                                }}> Tạo đơn  </Button>
                            </div>
                        ) : (
                            <div className="text-center" style={{ width: 120 }}>


                                <Tooltip title="Chỉnh sửa">
                                    <Button
                                        size="middle"
                                        type="default"
                                        shape="circle"
                                        className="ml-1"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEdit(record)}
                                    />
                                </Tooltip>

                                {status === 1 && (
                                    <Tooltip title="Bảo trì">
                                        <Button
                                            size="middle"
                                            type="default"
                                            shape="circle"
                                            className="ml-1"
                                            icon={<SettingOutlined />}
                                            onClick={() => handleApproval(record, 2)}
                                        />
                                    </Tooltip>
                                )}

                                {status === 2 && (
                                    <Tooltip title="Bảo trì hoàn tất">
                                        <Button
                                            size="middle"
                                            type="default"
                                            shape="circle"
                                            className="ml-1"
                                            icon={<TwitterSquareFilled />}
                                            onClick={() => handleApproval(record, 1)}
                                        />
                                    </Tooltip>
                                )}

                                <Tooltip title="Xóa HomeStay">
                                    <Button
                                        size="middle"
                                        type="default"
                                        shape="circle"
                                        className="ml-1"
                                        danger
                                        icon={<DeleteFilled />}
                                        onClick={() => handleDelete(record)}
                                    />
                                </Tooltip>
                            </div>
                        )}
                </>
            ),
        },
        {
            title: 'ID Homestay',
            key: 'homestayID',
            render: (h) => <span>#{h.homeStay.homestayID}</span>,
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
                console.log(h)
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
    ];

    const handleApproval = async (record, status) => {
        try {
            await homestayService.updateStatusApproval(record.homeStay.homestayID, status);

            // Hiển thị thông báo thành công
            notification.success({
                message: 'Thông báo',
                description: 'Homestay đã được cập nhật trạng thái!'
            });

            fetchHomeStays()


        } catch (error) {
            // Hiển thị thông báo lỗi
            message.error('Có lỗi xảy ra khi cập nhật trạng thái homestay.');
            console.error("Error updating homestay status:", error);
        }
    };

    const handleEdit = (record) => {
        // Xử lý hành động chỉnh sửa
        navigate(`/owner/homestay?idHomeStay=${record.homeStay.homestayID}`)
    };

    const handleDelete = async (record) => {
        // Xử lý hành động xóa
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
                <span className="text-gray-800">{isCreateBooking ? "Tạo đơn đặt phòng tại quầy" : "Quản lý HomeStay"}</span>

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
                    {status === -1 && (
                        <span className="text-lg bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md shadow-sm">
                            Bị từ chối
                        </span>
                    )}
                    {status === 2 && (
                        <span className="text-lg bg-gold-100 text-gold-600 px-3 py-1 rounded-md shadow-sm">
                            Đang bảo trì
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

            {dataCreateBooking.visible && <CreateDetailBooking visible={dataCreateBooking.visible} onClose={setDataCreateBooking} data={dataCreateBooking.homeStay} room={dataCreateBooking.roomCurrent} isOwnerCreate={true} />}
            <PaginateShared
                align="end"
                page={paginate.page}
                pageSize={paginate.pageSize}
                setPaginate={setPaginate}
                totalRecord={total}
            />
            {showListRoom.visible && showListRoom.rooms.length > 0 && showListRoom.rooms.map((room, index) => (
                <Modal
                    title={<Tag color="green" className='text-xl font-bold mb-5 p-2' style={{ width: "97%" }}>Chọn phòng</Tag>}
                    visible={showListRoom.visible}
                    onCancel={() => setShowListRoom((prev) => ({ ...prev, visible: false }))}
                    footer={null}
                    width={1000}
                >
                    <div key={index} >
                        <CardRoom
                            room={room}
                            ButtonAction={<>
                                <Button type="primary" size="small" className="flex items-center"
                                    onClick={() => {
                                        const setHideCreateBooking = (state) => setShowListRoom((prev) => ({ ...prev, visible: state }))
                                        setDataCreateBooking((prev) => ({ ...prev, visible: true, setVisible: setHideCreateBooking, roomCurrent: room }))
                                    }}> Chọn</Button>
                            </>
                            }
                        />
                    </div>
                </Modal>
            ))}
        </>
    );
};

export default memo(HomeStayManager);