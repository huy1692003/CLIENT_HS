import { memo, useEffect, useState } from "react";
import { Table, Tag, Button, Tooltip, notification, message, Select, DatePicker, Input } from "antd";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import advertisementService from "../../../services/advertisementService";
import { DeleteFilled, EditOutlined, EyeFilled, EyeInvisibleOutlined, EyeOutlined, MoneyCollectFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ModalViewAdvertisement from "../../../components/shared/ModalViewAdvertisement";
import LabelField from "../../../components/shared/LabelField";
import dayjs from "dayjs";
import { statusAdvertisement } from "../../../constant/statusConstant";
import { Option } from "antd/es/mentions";
import moment from "moment";
import paymentMomoSerivce from "../../../services/paymentMomoService";
import { handleHideAdver } from "../../../utils/hideAdvertisement";
import { convertDate } from "../../../utils/convertDate";

export const initSearchAds = {
    title: "",
    placement: null,
    dateStart: null,
    dateEnd: null

}
const AdvertisementManager = () => {
    const owner = useRecoilValue(userState);
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);
    const [status, setStatus] = useState(10)
    const navigate = useNavigate();
    const [search, setSearch] = useState(initSearchAds)
    const [searchParam, setSearchParam] = useState(initSearchAds)
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(5); // Số mục trên mỗi trang

    useEffect(() => {

        fetchAdvertisements();
    }, [status, owner.idOwner, search]);
    const fetchAdvertisements = async () => {
        setLoading(true);
        try {
            const data = await advertisementService.getAdvertisementManager(status, owner.idOwner, search);
            // Filter ads based on status and ownerID

            setAdvertisements(data);
        } catch (error) {
            console.error("Error fetching advertisements:", error);
            message.error("Có lỗi xảy ra khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const currentAdvertisements = advertisements.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedAd(null);
    };
    const showModal = (ad) => {
        setSelectedAd(ad);
        setIsModalVisible(true);
    };

    const paymentAds = async (ads) => {
        try {
            let timenow = moment().format('YYYYMMDDHHmmss')
            let res = await paymentMomoSerivce.create({
                "orderInfor": timenow + "-" + ads.adID + "-tqc",
                "fullName": owner.fullname,
                "descrtiption": "Thanh toán tiền quảng cáo HomeStay cho mã quảng cáo #: " + ads.adID,
                "amount": ads.cost,
            }
            )
            console.log(res)
            if (res && res.payUrl) {

                window.open(res.payUrl, "_blank")
            }
            else {
                notification.error({ message: "Đơn thanh toán hiện tại của bạn đã tồn tại trên hệ thống!" })
            }
        } catch (error) {
            notification.error({ message: "Có lỗi khi thanh toán" })
        }
    }

    const columns = [
        {
            title: 'Mã',
            dataIndex: 'adID',
            key: 'adID',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'adTitle',
            key: 'adTitle',
            render: (text) => <b>{text}</b>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'adDescription',
            key: 'adDescription',
            ellipsis: true,
        },
        {
            title: "Vị trí hiển thị",
            dataIndex: "placement",
            key: "placement",
            render: (pl) => {
                const placementMapping = {
                    1: "Banner trang chủ",
                    2: "Sidebar trang chủ",
                    3: "Homestay nổi bật"
                };

                return <span>{placementMapping[pl] || "Không xác định"}</span>;
            },
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Lượt click',
            dataIndex: 'totalClick',
            key: 'totalClick',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusAd',
            key: 'statusAd',
            render: (status) => {
                const inforStatus = statusAdvertisement.find(s => s.index === status)
                return <Tag color={inforStatus.tag}>{inforStatus.des}</Tag>;
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (dateCreate) => {
                return convertDate(dateCreate)
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-1 justify-center" >

                    {record.statusAd === 0 && <>


                        <Tooltip title="Chỉnh sửa">
                            <Button style={{ minWidth: 30 }}
                                size="middle"
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                            />
                        </Tooltip>



                    </>}
                    {record.statusAd < 2 && <>


                        <Tooltip title="Xóa quảng cáo">
                            <Button style={{ minWidth: 30 }}
                                size="middle"
                                type="default"
                                danger
                                icon={<DeleteFilled />}
                                onClick={() => handleDelete(record)}
                            />
                        </Tooltip>


                    </>}



                    {
                        record.statusAd === 1 &&
                        <Tooltip title="Thanh toán ">
                            <Button style={{ minWidth: 30 }}
                                size="middle"
                                type="primary"

                                icon={<MoneyCollectFilled />}
                                onClick={() => paymentAds(record)}
                            />
                        </Tooltip>
                    }

                    {record.statusAd === 3 &&
                        <Tooltip title="Ẩn quảng cáo ">
                            <Button style={{ minWidth: 30 }} size="middle" onClick={() => handleHideAdver(record, fetchAdvertisements)} type="primary" danger icon={<EyeInvisibleOutlined />} />
                        </Tooltip>
                    }


                    <Tooltip title="Xem chi tiết">
                        <Button style={{ minWidth: 30 }}
                            size="middle"
                            type="primary"

                            icon={<EyeFilled />}
                            onClick={() => showModal(record)}
                        />
                    </Tooltip>


                </div>

            ),
        },
    ];

    const handleEdit = (record) => {
        navigate(`/owner/advertisement/write?adId=${record.adID}`);
    };

    const handleDelete = async (record) => {
        try {
            await advertisementService.deleteAdvertisement(record.adID);
            notification.success({
                message: "Thành công",
                description: "Xóa quảng cáo thành công"
            });
            // Refresh data
            const newData = advertisements.filter(ad => ad.adID !== record.adID);
            setAdvertisements(newData);
        } catch (error) {
            message.error("Có lỗi xảy ra khi xóa quảng cáo");
        }
    };

    return (
        <>
            <h3 className="text-xl font-bold mb-5 flex justify-between items-center">
                <span className="flex items-center space-x-3">
                    <span className="text-gray-800">Quản lý quảng cáo</span>
                </span>
                <Button
                    type="primary"
                    onClick={() => navigate('/owner/advertisement/write')}
                >
                    Tạo quảng cáo mới
                </Button>
            </h3>

            <div className="my-3 flex flex-wrap gap-4">
                <LabelField label="Tiêu đề quảng cáo"><Input
                    className="min-w-[300px]"
                    value={searchParam.title} allowClear onChange={(e) => setSearchParam({
                        ...searchParam, title: e.target.
                            value
                    })} ></Input></LabelField>

                <LabelField label="Ngày bắt đầu">
                    <DatePicker
                        type="date"
                        format="DD/MM/YYYY"
                        className="min-w-[300px]"
                        value={searchParam.dateStart ? dayjs(searchParam.dateStart) : null} // Chuyển giá trị thành dayjs nếu cần
                        onChange={(date, dateString) => {
                            setSearchParam({ ...searchParam, dateStart: date ? date.format('YYYY-MM-DD') : null }); // Lưu trữ dưới dạng chuỗi ngày nếu cần
                        }}

                    />
                </LabelField>

                <LabelField label="Ngày kết thúc">
                    <DatePicker
                        format="DD/MM/YYYY"
                        className="min-w-[300px]"
                        value={searchParam.dateEnd ? dayjs(searchParam.dateEnd) : null} // Chuyển đổi endDate thành dayjs nếu có giá trị
                        onChange={(date) => setSearchParam({ ...searchParam, dateEnd: date ? date.format('YYYY-MM-DD') : null })} // Chuyển date thành chuỗi ngày nếu cần

                    />
                </LabelField>

                <LabelField label={"Vị trí hiển thị"}>
                    <Select

                        value={searchParam.placement}
                        onChange={(value) => setSearchParam({ ...searchParam, placement: value })}
                        style={{ width: 300 }}
                    >

                        <Option key={1} value={1}>Banner trang chủ</Option>
                        <Option key={1} value={2}>Sidebar trang chủ</Option>
                        <Option key={1} value={3}>Homestay nổi bật </Option>

                    </Select>
                </LabelField>

                <LabelField label={"Trạng Thái"}>  <Select
                    value={status}
                    onChange={(value) => setStatus(value)}
                    style={{ width: 300 }}
                >
                    {statusAdvertisement.map((item) => (
                        <Option key={item.index} value={item.index}>
                            {item.des}
                        </Option>
                    ))}</Select></LabelField>
                <LabelField label={<br />}>

                    <Button type="primary" onClick={() => setSearch(searchParam)}                >
                        Tìm kiếm ngay
                    </Button>
                </LabelField>
            </div>

            <Table
                loading={loading}
                bordered
                columns={columns}
                dataSource={currentAdvertisements} // Chỉ hiển thị dữ liệu của trang hiện tại
                rowKey="adID"
                
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: advertisements.length, // Tổng số quảng cáo
                    showSizeChanger: true,
                    pageSizeOptions:[5,10,20,50,100,200],
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                }}
            />
            <ModalViewAdvertisement handleModalClose={handleModalClose} selectedAd={selectedAd} isModalVisible={isModalVisible} />

        </>
    );
};

export default memo(AdvertisementManager);
