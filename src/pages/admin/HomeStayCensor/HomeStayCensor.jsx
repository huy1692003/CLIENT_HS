import { memo, useEffect, useState } from "react";
import { Table, Tooltip, Button, notification, message } from "antd";
import { useNavigate } from "react-router-dom";
import homestayService from "../../../services/homestayService";
import { DeleteFilled, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, CloseCircleFilled } from "@ant-design/icons";
import { ViewHomeStayModal } from "../../../components/shared/ModalViewHomeStay";

const HomeStayCensor = ({ status }) => {
    const [homeStays, setHomeStays] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [viewStay, setViewStay] = useState({ show: false, idHomeStay: null })

    const fetchHomeStays = async () => {
        setLoading(true);
        try {
            const data = await homestayService.getAll_ByStatus(status, { page: 1, pageSize: 10 });
            setHomeStays(data.items);
        } catch (error) {
            console.error("Error fetching homestays:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchHomeStays();
    }, [status]);

    const columns = [
        {
            title: 'Mã',
            key: 'homestayID',
            render: (h) => <span>{h.homeStay.homestayID}</span>, // Hiển thị Homestay ID
        },
        {
            title: 'Tên Homestay',
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
            render: (h) => <span>{h.homeStay.pricePerNight} VNĐ</span>, // Hiển thị Giá mỗi đêm
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
                <div className="text-center" style={{ width: 180 }}>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            size="middle"

                            shape="circle"
                            icon={<EyeOutlined />} // Biểu tượng Xem chi tiết
                            className="mr-1"
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Duyệt ngay">
                        <Button
                            size="middle"
                            type="primary"

                            shape="circle"
                            icon={<CheckCircleOutlined />} // Biểu tượng Xác nhận
                            className="ml-1"
                            onClick={() => handleApproval(record, 1)}
                        />
                    </Tooltip>
                    <Tooltip title="Từ chối">
                        <Button
                            size="middle"
                            danger
                            shape="circle"
                            icon={<CloseCircleFilled />} // Biểu tượng Từ chối
                            className="ml-1"
                            onClick={() => handleApproval(record, 2)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

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



    return (
        <>
            <h3 className="text-xl font-bold mb-5 flex justify-between items-center">
                <span className="flex items-center space-x-3">
                    <span className="text-gray-800">Danh sách HomeStay</span>
                    {status === 0 && (
                        <span className="text-lg bg-blue-300 text-blue-700 px-3 py-1 rounded-md shadow-sm">
                            Chưa phê duyệt
                        </span>
                    )}
                    {status === 1 && (
                        <span className="text-lg bg-green-100 text-green-600 px-3 py-1 rounded-md shadow-sm">
                            Đang hiện hành
                        </span>
                    )}
                    {status === 2 && (
                        <span className="text-lg bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md shadow-sm">
                            Đã từ chối
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

            <ViewHomeStayModal
                visible={viewStay.show}
                setVisible={setViewStay}
                idHomeStay={viewStay.idHomeStay}
            />
        </>
    );
};
export default memo(HomeStayCensor)
