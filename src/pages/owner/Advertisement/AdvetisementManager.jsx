import { memo, useEffect, useState } from "react";
import { Table, Tag, Button, Tooltip, notification, message, Select, DatePicker, Input, Space, Row, Col } from "antd";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import advertisementService from "../../../services/advertisementService";
import { DeleteFilled, EditOutlined, EyeFilled, EyeInvisibleOutlined, FilterOutlined, MoneyCollectFilled, SearchOutlined } from "@ant-design/icons";
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
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchAdvertisements();
    }, [status, owner.idOwner, search]);

    const fetchAdvertisements = async () => {
        setLoading(true);
        try {
            const data = await advertisementService.getAdvertisementManager(status, owner.idOwner, search);
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
            })
            
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
            title: 'Hành động',
            key: 'action',
            fixed: 'left',
            width: "auto",
            render: (_, record) => (
                <Space size="small">
                    {record.statusAd === 0 && 
                        <Tooltip title="Chỉnh sửa">
                            <Button 
                                size="small"
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                            />
                        </Tooltip>
                    }
                    
                    {record.statusAd < 2 && 
                        <Tooltip title="Xóa quảng cáo">
                            <Button 
                                size="small"
                                type="default"
                                danger
                                icon={<DeleteFilled />}
                                onClick={() => handleDelete(record)}
                            />
                        </Tooltip>
                    }
                    
                    {record.statusAd === 1 &&
                        <Tooltip title="Thanh toán">
                            <Button 
                                size="small"
                                type="primary"
                                icon={<MoneyCollectFilled />}
                                onClick={() => paymentAds(record)}
                            />
                        </Tooltip>
                    }
                    
                    {record.statusAd === 3 &&
                        <Tooltip title="Ẩn quảng cáo">
                            <Button 
                                size="small" 
                                onClick={() => handleHideAdver(record, fetchAdvertisements)} 
                                type="primary" 
                                danger 
                                icon={<EyeInvisibleOutlined />} 
                            />
                        </Tooltip>
                    }
                    
                    <Tooltip title="Xem chi tiết">
                        <Button 
                            size="small"
                            type="primary"
                            icon={<EyeFilled />}
                            onClick={() => showModal(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
        {
            title: 'Mã',
            dataIndex: 'adID',
            key: 'adID',
            width: 60,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'adTitle',
            key: 'adTitle',
            ellipsis: true,
            render: (text) => <b>{text}</b>,
        },
      
        {
            title: "Vị trí",
            dataIndex: "placement",
            key: "placement",
            width: 120,
            responsive: ['md'],
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
            width: 120,
            responsive: ['md'],
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            width: 120,
            responsive: ['md'],
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Lượt click',
            dataIndex: 'totalClick',
            key: 'totalClick',
            width: 80,
            responsive: ['sm'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusAd',
            key: 'statusAd',
            width: 120,
            render: (status) => {
                const inforStatus = statusAdvertisement.find(s => s.index === status)
                return <Tag color={inforStatus.tag}>{inforStatus.des}</Tag>;
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdDate",
            key: "createdDate",
            width: 120,
            responsive: ['lg'],
            render: (dateCreate) => {
                return convertDate(dateCreate)
            },
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
        <div className="w-full">
            <h3 className="text-xl font-bold mb-5 flex flex-wrap justify-between items-center gap-2">
                <span className="text-gray-800">Quản lý quảng cáo</span>
                <Space>
                    <Button
                        icon={<FilterOutlined />}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Bộ lọc
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => navigate('/owner/advertisement/write')}
                    >
                        Tạo quảng cáo mới
                    </Button>
                </Space>
            </h3>

            {showFilters && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={8}>
                            <LabelField label="Tiêu đề quảng cáo">
                                <Input
                                    value={searchParam.title} 
                                    allowClear 
                                    onChange={(e) => setSearchParam({
                                        ...searchParam, 
                                        title: e.target.value
                                    })} 
                                />
                            </LabelField>
                        </Col>
                        
                        <Col xs={24} sm={12} lg={8}>
                            <LabelField label="Ngày bắt đầu">
                                <DatePicker
                                    type="date"
                                    format="DD/MM/YYYY"
                                    className="w-full"
                                    value={searchParam.dateStart ? dayjs(searchParam.dateStart) : null}
                                    onChange={(date) => {
                                        setSearchParam({ 
                                            ...searchParam, 
                                            dateStart: date ? date.format('YYYY-MM-DD') : null 
                                        });
                                    }}
                                />
                            </LabelField>
                        </Col>
                        
                        <Col xs={24} sm={12} lg={8}>
                            <LabelField label="Ngày kết thúc">
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    className="w-full"
                                    value={searchParam.dateEnd ? dayjs(searchParam.dateEnd) : null}
                                    onChange={(date) => setSearchParam({ 
                                        ...searchParam, 
                                        dateEnd: date ? date.format('YYYY-MM-DD') : null 
                                    })}
                                />
                            </LabelField>
                        </Col>
                        
                        <Col xs={24} sm={12} lg={8}>
                            <LabelField label="Vị trí hiển thị">
                                <Select
                                    value={searchParam.placement}
                                    onChange={(value) => setSearchParam({ ...searchParam, placement: value })}
                                    className="w-full"
                                    allowClear
                                >
                                    <Option value={1}>Banner trang chủ</Option>
                                    <Option value={2}>Sidebar trang chủ</Option>
                                    <Option value={3}>Homestay nổi bật</Option>
                                </Select>
                            </LabelField>
                        </Col>
                        
                        <Col xs={24} sm={12} lg={8}>
                            <LabelField label="Trạng Thái">
                                <Select
                                    value={status}
                                    onChange={(value) => setStatus(value)}
                                    className="w-full"
                                >
                                    {statusAdvertisement.map((item) => (
                                        <Option key={item.index} value={item.index}>
                                            {item.des}
                                        </Option>
                                    ))}
                                </Select>
                            </LabelField>
                        </Col>
                        
                        <Col xs={24} sm={12} lg={8}>
                            <Button 
                                type="primary" 
                                onClick={() => setSearch(searchParam)}
                                icon={<SearchOutlined />}
                                className="mt-6"
                                block
                            >
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                </div>
            )}

            <div className="overflow-x-auto">
                <Table
                    loading={loading}
                    bordered
                    className="w-full"
                    columns={columns}
                    dataSource={currentAdvertisements}
                    rowKey="adID"
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: advertisements.length,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 20, 50, 100, 200],
                        onChange: (page, pageSize) => {
                            setCurrentPage(page);
                            setPageSize(pageSize);
                        },
                        responsive: true,
                    }}
                />
            </div>
            
            <ModalViewAdvertisement 
                handleModalClose={handleModalClose} 
                selectedAd={selectedAd} 
                isModalVisible={isModalVisible} 
            />
        </div>
    );
};

export default memo(AdvertisementManager);
