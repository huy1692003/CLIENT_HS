import { memo, useEffect, useState } from "react";
import { Table, Tag, Button, Tooltip, notification, message } from "antd";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import homestayService from "../../../services/homestayService";
import { DeleteFilled, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { data } from "autoprefixer";
import { formatPrice } from "../../../utils/formatPrice";

const HomeStayManager = ({ status }) => {
    const owner = useRecoilValue(userState);
    const [homeStays, setHomeStays] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchHomeStays = async () => {
            setLoading(true);
            try {
                const data = await homestayService.getByOwnerID(status, owner.idOwner, { page: 1, pageSize: 10 });
                console.log(data)
                setHomeStays(data.items);
            } catch (error) {
                console.error("Error fetching homestays:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeStays();
    }, [status, owner.id]);



    const columns = [
        {
            title: 'Mã',

            key: 'homestayID',
            render: (h) => <span>{h.homeStay.homestayID}</span>, // Hiển thị Homestay ID
        },
        {
            title: 'Tên',

            key: 'homestayName',
            render: (h) => <b>{h.homeStay.homestayName}</b>, // Hiển thị Tên HomeStay
        },
        {
            title: 'Địa chỉ',

            key: 'addressDetail',
            render: (h) => <span>{h.homeStay.addressDetail}</span>, // Hiển thị Địa chỉ chi tiết
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
                <span className="flex items-center space-x-3">
                    <span className="text-gray-800">Danh sách HomeStay</span>
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

            <Table
                loading={loading}
                bordered
                columns={columns}
                dataSource={homeStays}
            />
        </>
    );
};
export default memo(HomeStayManager)