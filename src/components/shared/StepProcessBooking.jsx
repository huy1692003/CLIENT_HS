import { memo, useState, useEffect } from "react"
import { convertDateTime } from "../../utils/convertDate"
import { CheckCircleOutlined, CheckOutlined, DownSquareFilled, HomeOutlined, Loading3QuartersOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Steps, Tag, Modal, Form, InputNumber, Select, Input, Table, Space, Row, Col } from "antd"
import roomService from "../../services/roomService"
import serviceHomestayService from "../../services/serviceHomestayService"
import { formatPrice } from "../../utils/formatPrice"

const StepProcessBookingOwner = ({ selectedBooking, confirmCheckIn, confirmCheckOut }) => {
    const [roomData, setRoomData] = useState(null)
    const [serviceData, setServiceData] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [extraCharges, setExtraCharges] = useState([])
    const [selectedServices, setSelectedServices] = useState([])
    const [otherCharges, setOtherCharges] = useState([])
    
    useEffect(() => {
        roomService.getById(selectedBooking?.roomID).then(res => setRoomData(res))
        serviceHomestayService.getAllServices(selectedBooking.ownerID).then(res => setServiceData(res))
    }, [selectedBooking])

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleSubmit = (values) => {
        // Process and submit the extra charges
        setIsModalVisible(false)
        
        // Prepare the JSON data structure for extra costs
        const jsonDetailExtraCost = {
            extraPersonCost: {
                extraAdult: extraCharges.filter(item => item.type === 'adult').reduce((total, item) => {
                    return {
                        count: (total.count || 0) + item.count,
                        fee: roomData?.extraFeePerAdult || 0,
                        total: ((total.count || 0) + item.count) * (roomData?.extraFeePerAdult || 0)
                    };
                }, {}),
                extraChild: extraCharges.filter(item => item.type === 'child').reduce((total, item) => {
                    return {
                        count: (total.count || 0) + item.count,
                        fee: roomData?.extraFeePerChild || 0,
                        total: ((total.count || 0) + item.count) * (roomData?.extraFeePerChild || 0)
                    };
                }, {}),
                extraBaby: extraCharges.filter(item => item.type === 'baby').reduce((total, item) => {
                    return {
                        count: (total.count || 0) + item.count,
                        fee: roomData?.extraFeePerBaby || 0,
                        total: ((total.count || 0) + item.count) * (roomData?.extraFeePerBaby || 0)
                    };
                }, {})
            },
            serviceCost: selectedServices.map(service => {
                const serviceItem = serviceData.find(s => s.serviceID === service.serviceId);
                return {
                    serviceId: service.serviceId,
                    serviceName: serviceItem?.serviceName || '',
                    quantity: service.quantity,
                    price: serviceItem?.price || 0,
                    total: (serviceItem?.price || 0) * service.quantity
                };
            }),
            otherCost: otherCharges.map(charge => ({
                name: charge.name,
                amount: charge.amount
            })),
            totalExtraCost: calculateTotal()
        };
        
        
        confirmCheckOut(selectedBooking?.bookingID, jsonDetailExtraCost);
    }

    const addExtraPerson = () => {
        setExtraCharges([...extraCharges, { key: Date.now(), type: 'adult', count: 1 }])
    }

    const removeExtraPerson = (key) => {
        setExtraCharges(extraCharges.filter(item => item.key !== key))
    }

    const updateExtraPerson = (key, field, value) => {
        setExtraCharges(extraCharges.map(item => 
            item.key === key ? { ...item, [field]: value } : item
        ))
    }

    const addService = () => {
        setSelectedServices([...selectedServices, { key: Date.now(), serviceId: null, quantity: 1 }])
    }

    const removeService = (key) => {
        setSelectedServices(selectedServices.filter(item => item.key !== key))
    }

    const updateService = (key, field, value) => {
        setSelectedServices(selectedServices.map(item => 
            item.key === key ? { ...item, [field]: value } : item
        ))
    }

    const addOtherCharge = () => {
        setOtherCharges([...otherCharges, { key: Date.now(), name: '', amount: 0 }])
    }

    const removeOtherCharge = (key) => {
        setOtherCharges(otherCharges.filter(item => item.key !== key))
    }

    const updateOtherCharge = (key, field, value) => {
        setOtherCharges(otherCharges.map(item => 
            item.key === key ? { ...item, [field]: value } : item
        ))
    }

    const calculateTotal = () => {
        let total = 0;
        
        // Calculate extra person charges
        extraCharges.forEach(charge => {
            if (charge.type === 'adult') {
                total += (roomData?.extraFeePerAdult || 0) * charge.count;
            } else if (charge.type === 'child') {
                total += (roomData?.extraFeePerChild || 0) * charge.count;
            } else if (charge.type === 'baby') {
                total += (roomData?.extraFeePerBaby || 0) * charge.count;
            }
        });
        
        // Calculate service charges
        selectedServices.forEach(service => {
            const serviceItem = serviceData.find(s => s.serviceID === service.serviceId);
            if (serviceItem) {
                total += serviceItem.price * service.quantity;
            }
        });
        
        // Add other charges
        otherCharges.forEach(charge => {
            total += charge.amount;
        });
        
        return total;
    };

    return (
        <>
            <Steps
                direction="vertical"
                size="small"
                className="mt-10"
                current={selectedBooking?.status - 1}
                items={[
                    {
                        title: 'Tiếp nhận đơn đặt phòng',
                        description: "Đã tiếp nhận ngày : " + convertDateTime(selectedBooking?.bookingProcess.timeConfirm),
                        icon: <DownSquareFilled />,
                    },
                    {
                        title: 'Thanh toán tiền phòng',
                        description: selectedBooking?.status <= 2 ? <>Chưa thanh toán</> : <>{"Đã thanh toán ngày : " + convertDateTime(selectedBooking?.bookingProcess.paymentTime)}</>,
                        icon: <CheckCircleOutlined />,
                    },
                    {
                        title: 'Chờ nhận phòng',
                        icon: <Loading3QuartersOutlined />,
                    },
                    {
                        title: 'Check-in',
                        description: selectedBooking?.bookingProcess.checkInTime && <>Đã nhận phòng vào lúc : {convertDateTime(selectedBooking?.bookingProcess.checkInTime)}</>,
                        subTitle: selectedBooking?.status === 4 ? <Button onClick={() => confirmCheckIn(selectedBooking?.bookingID)}>Xác nhận khách đã nhận phòng</Button> : "",
                        icon: <HomeOutlined />,
                    },
                    {
                        title: 'Check-out',
                        description: selectedBooking?.bookingProcess.checkOutTime && <>Đã trả phòng vào lúc : {convertDateTime(selectedBooking?.bookingProcess.checkOutTime)}</>,
                        subTitle: selectedBooking?.status === 5 ? (
                            <Button onClick={showModal}>
                                Xử lý trả phòng
                            </Button>
                        ) : "",
                        icon: <CheckOutlined />,
                    },
                    {
                        title: 'Hoàn thành',
                        description: 'Quy trình thuê phòng đã hoàn tất',
                        icon: <CheckCircleOutlined />,
                    },
                ]}
            />

            <Modal
                title={<Tag className="text-lg" color="blue">Chi phí phát sinh</Tag>}
                open={isModalVisible}
                onCancel={handleCancel}
                width={800}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Xác nhận và hoàn thành
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <div className="mb-4">
                        <h3 className="text-base font-medium mb-2">1. Phụ thu người ở vượt quá quy định</h3>
                        <Table
                            dataSource={extraCharges}
                            pagination={false}
                            className="mb-2"
                            columns={[
                                {
                                    title: 'Loại',
                                    dataIndex: 'type',
                                    key: 'type',
                                    render: (_, record) => (
                                        <Select
                                            value={record.type}
                                            onChange={(value) => updateExtraPerson(record.key, 'type', value)}
                                            style={{ width: '100%' }}
                                        >
                                            <Select.Option value="adult">Người lớn ({formatPrice(roomData?.extraFeePerAdult || 0)}/người)</Select.Option>
                                            <Select.Option value="child">Trẻ em ({formatPrice(roomData?.extraFeePerChild || 0)}/người)</Select.Option>
                                            <Select.Option value="baby">Em bé ({formatPrice(roomData?.extraFeePerBaby || 0)}/người)</Select.Option>
                                        </Select>
                                    ),
                                },
                                {
                                    title: 'Số lượng',
                                    dataIndex: 'count',
                                    key: 'count',
                                    render: (_, record) => (
                                        <InputNumber
                                            min={1}
                                            value={record.count}
                                            onChange={(value) => updateExtraPerson(record.key, 'count', value)}
                                        />
                                    ),
                                },
                                {
                                    title: 'Thành tiền',
                                    key: 'amount',
                                    render: (_, record) => {
                                        let fee = 0;
                                        if (record.type === 'adult') fee = roomData?.extraFeePerAdult || 0;
                                        else if (record.type === 'child') fee = roomData?.extraFeePerChild || 0;
                                        else if (record.type === 'baby') fee = roomData?.extraFeePerBaby || 0;
                                        return formatPrice(fee * record.count);
                                    },
                                },
                                {
                                    title: '',
                                    key: 'action',
                                    render: (_, record) => (
                                        <Button type="text" danger onClick={() => removeExtraPerson(record.key)}>
                                            Xóa
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                        <Button type="dashed" onClick={addExtraPerson} block icon={<PlusOutlined />}>
                            Thêm người
                        </Button>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-base font-medium mb-2">2. Dịch vụ sử dụng</h3>
                        <Table
                            dataSource={selectedServices}
                            pagination={false}
                            className="mb-2"
                            columns={[
                                {
                                    title: 'Dịch vụ',
                                    dataIndex: 'serviceId',
                                    key: 'serviceId',
                                    render: (_, record) => (
                                        <Select
                                            value={record.serviceId}
                                            onChange={(value) => updateService(record.key, 'serviceId', value)}
                                            style={{ width: '100%' }}
                                            placeholder="Chọn dịch vụ"
                                        >
                                            {serviceData.map(service => (
                                                <Select.Option key={service.serviceID} value={service.serviceID}>
                                                    {service.serviceName} ({formatPrice(service.price)}/{service.unit})
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    ),
                                },
                                {
                                    title: 'Số lượng',
                                    dataIndex: 'quantity',
                                    key: 'quantity',
                                    render: (_, record) => (
                                        <InputNumber
                                            min={1}
                                            value={record.quantity}
                                            onChange={(value) => updateService(record.key, 'quantity', value)}
                                        />
                                    ),
                                },
                                {
                                    title: 'Thành tiền',
                                    key: 'amount',
                                    render: (_, record) => {
                                        const service = serviceData.find(s => s.serviceID === record.serviceId);
                                        return service ? formatPrice(service.price * record.quantity) : '0 VND';
                                    },
                                },
                                {
                                    title: '',
                                    key: 'action',
                                    render: (_, record) => (
                                        <Button type="text" danger onClick={() => removeService(record.key)}>
                                            Xóa
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                        <Button type="dashed" onClick={addService} block icon={<PlusOutlined />}>
                            Thêm dịch vụ
                        </Button>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-base font-medium mb-2">3. Chi phí phát sinh khác</h3>
                        <Table
                            dataSource={otherCharges}
                            pagination={false}
                            className="mb-2"
                            columns={[
                                {
                                    title: 'Tên chi phí',
                                    dataIndex: 'name',
                                    key: 'name',
                                    render: (_, record) => (
                                        <Input
                                            value={record.name}
                                            onChange={(e) => updateOtherCharge(record.key, 'name', e.target.value)}
                                            placeholder="Nhập tên chi phí"
                                        />
                                    ),
                                },
                                {
                                    title: 'Số tiền',
                                    dataIndex: 'amount',
                                    key: 'amount',
                                    render: (_, record) => (
                                        <InputNumber
                                            min={0}
                                            value={record.amount}
                                            onChange={(value) => updateOtherCharge(record.key, 'amount', value)}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            style={{ width: '100%' }}
                                        />
                                    ),
                                },
                                {
                                    title: '',
                                    key: 'action',
                                    render: (_, record) => (
                                        <Button type="text" danger onClick={() => removeOtherCharge(record.key)}>
                                            Xóa
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                        <Button type="dashed" onClick={addOtherCharge} block icon={<PlusOutlined />}>
                            Thêm chi phí khác
                        </Button>
                    </div>

                    <Row className="mt-6">
                        <Col span={12} offset={12}>
                            <div className="text-right">
                                <div className="text-base font-medium">Tổng chi phí phát sinh: {formatPrice(calculateTotal())}</div>
                                <div className="text-sm text-gray-500">Khách hàng sẽ thanh toán thêm khoản này khi trả phòng</div>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default memo(StepProcessBookingOwner)