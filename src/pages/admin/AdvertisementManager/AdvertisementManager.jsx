import { CheckCircleFilled, CloseCircleFilled, CloseSquareFilled, EyeInvisibleOutlined, EyeOutlined, EyeTwoTone, SettingOutlined } from "@ant-design/icons";
import { Button, Table, Tag, Tooltip, Modal, Descriptions, Divider, Image, notification, Input, Popconfirm, DatePicker, Select } from "antd";
import { memo, useEffect, useState } from "react";
import advertisementService from "../../../services/advertisementService";
import { formatPrice } from "../../../utils/formatPrice";
import { URL_SERVER } from "../../../constant/global";
import ModalViewAdvertisement from "../../../components/shared/ModalViewAdvertisement";
import { initSearchAds } from "../../owner/Advertisement/AdvetisementManager";
import LabelField from "../../../components/shared/LabelField";
import { Option } from "antd/es/mentions";
import dayjs from "dayjs";
import { statusAdvertisement } from "../../../constant/statusConstant";
import { handleHideAdver } from "../../../utils/hideAdvertisement";
import { convertDate } from "../../../utils/convertDate";

const AdvertisementManager = () => {
    const [advertisements, setAdvertisements] = useState([]);
    const [status, setStatus] = useState(10);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);
    const [rejectReason, setRejectReason] = useState("");  // state to store rejection reason
    const [search, setSearch] = useState(initSearchAds)
    const [searchParam, setSearchParam] = useState(initSearchAds)
    useEffect(() => {
        getAllAdvertisements();
    }, [status, search]);

    const getAllAdvertisements = async () => {
        setLoading(true);
        const data = await advertisementService.getAdvertisementManager(status, "", search);
        setAdvertisements(data);
        setLoading(false);
    };

    const showModal = (ad) => {
        setSelectedAd(ad);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedAd(null);
    };

    const confirmReject = async (record) => {
        try {
            if (rejectReason.trim() === "") {
                notification.error({
                    message: "Lý do từ chối không được bỏ trống!",
                });
                return;
            }
            await advertisementService.updateStatusAdver(record.adID, 3, rejectReason);
            notification.success({
                message: "Thông báo ",
                description: "Bạn vừa từ chối quảng cáo #" + record.adID,
            });
            getAllAdvertisements();
            setRejectReason(""); // Clear the reason after rejecting
        } catch (error) {
            notification.error({ message: "Thất bại", description: "Có lỗi rồi " });
        }
    };

    const handleConfirmAdver = async (record) => {
        try {
            await advertisementService.updateStatusAdver(record.adID, 1);
            notification.success({
                message: "Thông báo ",
                description: "Bạn vừa xét duyệt thành công quảng cáo #"+record.adID,
            });
            getAllAdvertisements();
        } catch (error) {
            notification.error({ message: "Thất bại", description: "Có lỗi rồi " });
        }
    };
    

    const columns = [
        {
            title: "Mã",
            dataIndex: "adID",
            key: "adID",
        },
        {
            title: "Tiêu đề",
            dataIndex: "adTitle",
            key: "adTitle",
            render: (text) => <b>{text}</b>,
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            render: (date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            render: (date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Lượt click",
            dataIndex: "totalClick",
            key: "totalClick",
        },
        {
            title: "Tổng chi phí",
            dataIndex: "cost",
            key: "cost",
            render: (cost) => <b>{formatPrice(cost)}</b>,
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
            title: "Trạng thái",
            dataIndex: "statusAd",
            key: "statusAd",
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
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <div className="flex justify-center gap-2">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            size="middle"
                            type="primary"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => showModal(record)}
                        />
                    </Tooltip>
                    {record.statusAd === 0 &&
                        <Tooltip title="Duyệt quảng cáo">
                            <Button size="middle" onClick={() => handleConfirmAdver(record)} type="primary" shape="circle" icon={<CheckCircleFilled />} />
                        </Tooltip>}

                    {/* Popconfirm for Reject action */}
                    {record.statusAd === 3 &&
                        <Tooltip title="Ẩn quảng cáo ">
                            <Button size="middle" onClick={() => handleHideAdver(record,getAllAdvertisements)} type="primary" danger  icon={<EyeInvisibleOutlined />} />
                        </Tooltip>
                    }
                    {record.statusAd  < 2 &&
                        <Tooltip title="Từ chối quảng cáo">
                            <Popconfirm

                                placement="topLeft"
                                title={
                                    <div style={{ width: 300 }}>
                                        <Input.TextArea
                                            rows={5}
                                            placeholder="Nhập lý do từ chối"
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)} // Update state on input change
                                        />
                                    </div>
                                }
                                onConfirm={() => confirmReject(record)}
                                okText="Cập nhật"
                                cancelText="Hủy"
                            >
                                <Button size="middle" type="primary" danger icon={<CloseSquareFilled />} />
                            </Popconfirm>
                        </Tooltip>}

                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Quản lý quảng cáo</h3>
            </div>
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
                        placeholder="-- Tất cả --"
                        allowClear
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

            <div className="text-xl font-bold my-4">Danh sách </div>
            <Table showSorterTooltip bordered className="mt-4" pagination={{ pageSize: 10 }} loading={loading} columns={columns} dataSource={advertisements} rowKey="adID" />

            <ModalViewAdvertisement handleModalClose={handleModalClose} selectedAd={selectedAd} isModalVisible={isModalVisible} />
        </>
    );
};

export default memo(AdvertisementManager);
