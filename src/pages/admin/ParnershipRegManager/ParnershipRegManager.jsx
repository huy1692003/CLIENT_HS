import React, { memo, useEffect, useState } from 'react';
import { Table, Spin, Alert, message, Tooltip, Button, Tag, notification, Popconfirm, Input } from 'antd';
import partnerShipService from '../../../services/partnerShipService';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import DetailPartnerShip from './DetailPartnerShip';
import TextArea from 'antd/es/input/TextArea';

const PartnershipRegManager = () => {
    const [dataSource, setDataSource] = useState([]);
    const [originalDataSource, setOriginalDataSource] = useState([]); // Lưu dữ liệu gốc
    const [loading, setLoading] = useState(true);
    const [statusPart, setStatusPart] = useState(0);
    const [showDetail, setShowDetail] = useState(false);
    const [idDetail, setIdDetail] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [searchText, setSearchText] = useState(''); // Lưu trạng thái tìm kiếm

    useEffect(() => {
        fetchData();
    }, [statusPart]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res = await partnerShipService.getByStatus(statusPart);
            setOriginalDataSource(res); // Lưu dữ liệu gốc
            setDataSource(res); // Cập nhật dataSource để hiển thị
        } catch (err) {
            message.error("Có lỗi rồi hãy thử lại sau");
        } finally {
            setLoading(false);
        }
    };

    const onConfirm = async (id) => {
        try {
            await partnerShipService.confirmPartByID(id);
            notification.success({ message: "Xét duyệt thành công", description: "Bạn vừa xét duyệt đơn đăng kí hợp tác có ID= " + id });
            fetchData();
        } catch (error) {
            message.error("Có lỗi rồi hãy thử lại sau");
        }
    };

    const onReject = async (id, rejectReason) => {
        if (rejectReason) {
            try {
                await partnerShipService.cancelPartByID(id, rejectReason);
                notification.warning({ message: "Thông báo", description: "Bạn vừa từ chối đơn đăng kí hợp tác có ID= " + id });
                fetchData();
            } catch (error) {
                message.error("Có lỗi rồi hãy thử lại sau");
            }
        } else {
            message.error("Hãy điền lý do từ chối");
        }
    };

    const Confirm = ({ record }) => {
        return (
            <Tooltip title="Duyệt">
                <Popconfirm
                    title="Bạn có chắc chắn muốn duyệt đơn này?"
                    onConfirm={() => onConfirm(record.id)}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        style={{ marginRight: 8 }}
                    />
                </Popconfirm>
            </Tooltip>
        );
    };




    const columns = [
        {
            title: 'Tên Công Ty',
            dataIndex: 'companyName',
            key: 'companyName',
        },
        {
            title: 'Tên Người Đại Diện',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số HomeStay Sở Hữu',
            dataIndex: 'totalHomeStay',
            key: 'totalHomeStay',
            render: (text) => <span>{text}</span>
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <span>
                    {text === 0 && <Tag color="blue">Chưa duyệt</Tag>}
                    {text === 1 && <Tag color="green">Đã duyệt</Tag>}
                    {text === 2 && <Tag color="red">Đã từ chối</Tag>}
                </span>
            ),
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text, record) => (
                <span className='block text-center' style={{ width: 130 }}>
                    {statusPart === 0 && <>
                        <Confirm record={record} />
                        <Tooltip title="Từ Chối">
                            <Popconfirm
                                placement="topLeft"
                                title={
                                    <div style={{ width: 400 }}>
                                        <div className='text-lg'>Bạn có chắc chắn muốn từ chối không?</div>
                                        <TextArea
                                            rows={7}
                                            placeholder="Nhập lý do từ chối"
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)} // Cập nhật lý do từ chối
                                            style={{ marginTop: 8 }} // Khoảng cách giữa tiêu đề và input
                                        />
                                    </div>
                                }
                                onConfirm={() => {
                                    onReject(record.id, rejectReason); // Gọi hàm từ chối với lý do
                                    setRejectReason(''); // Reset lý do sau khi từ chối
                                }}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <Button
                                    type='primary'
                                    danger
                                    icon={<CloseCircleOutlined />}
                                    style={{ marginRight: 8 }}
                                />
                            </Popconfirm>
                        </Tooltip>
                    </>}
                    <Tooltip title="Xem Chi Tiết">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setIdDetail(record.id);
                                setShowDetail(true);
                            }}
                        />
                    </Tooltip>
                </span>
            ),
        },
    ];

    return (
        <>
            <h3 className="text-2xl font-bold mb-5 flex justify-between">
                <span>Đơn đăng kí hợp tác</span>
                <span className='flex gap-2'>
                    <div className='flex gap-2'>
                        <Button
                            style={statusPart === 0 && { border: "2px solid black" }}
                            className='bg-blue-500 text-white text-lg'
                            onClick={() => { setStatusPart(0) }}
                        >
                            Chưa duyệt
                        </Button>
                        <Button
                            style={statusPart === 1 && { border: "2px solid black" }}
                            className='bg-green-500 text-white text-lg'
                            onClick={() => { setStatusPart(1) }}
                        >
                            Đã duyệt
                        </Button>
                        <Button
                            style={statusPart === 2 && { border: "2px solid black" }}
                            className='bg-red-500 text-white text-lg'
                            onClick={() => { setStatusPart(2) }}
                        >
                            Đã từ chối
                        </Button>
                    </div>
                </span>
            </h3>

            {/* Ô tìm kiếm */}
            <Input
                placeholder="Tìm kiếm theo tên công ty, người đại diện, số điện thoại, email..."
                onChange={e => {
                    const value = e.target.value.toLowerCase(); // Chuyển đổi về chữ thường
                    setSearchText(value);

                    // Tìm kiếm trong dữ liệu gốc
                    const filteredData = originalDataSource.filter(item =>
                        item.companyName.toLowerCase().includes(value) ||
                        item.fullName.toLowerCase().includes(value) ||
                        item.phoneNumber.includes(value) ||
                        item.email.toLowerCase().includes(value)
                    );

                    setDataSource(filteredData); // Cập nhật dữ liệu hiển thị
                }}
                style={{ marginBottom: 16 }}
            />

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                </div>
            ) : (
                <Table dataSource={dataSource} pagination={5} bordered columns={columns} />
            )}
            {idDetail && <DetailPartnerShip stateModal={{ showDetail, setShowDetail }} idPartner={idDetail} />}
        </>
    );
};
export default memo(PartnershipRegManager)
