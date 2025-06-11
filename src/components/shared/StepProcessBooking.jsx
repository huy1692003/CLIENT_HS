import { memo, useState, useEffect } from "react"
import { convertDateTime } from "../../utils/convertDate"
import { CheckCircleOutlined, CheckOutlined, DownSquareFilled, HomeOutlined, Loading3QuartersOutlined, PlusOutlined, InfoCircleOutlined } from "@ant-design/icons"
import { Button, Steps, Tag, Modal, Form, InputNumber, Select, Input, Table, Row, Col, Alert, Card, Divider } from "antd"
import serviceHomestayService from "../../services/serviceHomestayService"
import { formatPrice } from "../../utils/formatPrice"

const StepProcessBookingOwner = ({ selectedBooking, confirmCheckIn, confirmCheckOut }) => {
    const [serviceData, setServiceData] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()
    // Mảng phòng với thông tin người phát sinh
    const [roomExtraCharges, setRoomExtraCharges] = useState([])
    const [selectedServices, setSelectedServices] = useState([])
    const [otherCharges, setOtherCharges] = useState([])
    
    useEffect(() => {
        if (selectedBooking?.ownerID) {
            serviceHomestayService.getAllServices(selectedBooking.ownerID).then(res => setServiceData(res))
        }
    }, [selectedBooking])
    console.log(serviceData)
    const showModal = () => {
        // Khởi tạo dữ liệu phòng với thông tin người phát sinh
        const roomCharges = selectedBooking?.detailBooking?.map(room => {
            const extraAdults = Math.max(0, room.numberAdults - room.maxAdults)
            const extraChildren = Math.max(0, room.numberChildren - room.maxChildren)
            const extraBabies = Math.max(0, room.numberBaby - room.maxBaby)
            
            return {
                roomId: room.roomId,
                roomName: room.roomName,
                // Thông tin giới hạn
                limits: {
                    maxAdults: room.maxAdults,
                    maxChildren: room.maxChildren,
                    maxBaby: room.maxBaby
                },
                // Thông tin thực tế
                actual: {
                    numberAdults: room.numberAdults,
                    numberChildren: room.numberChildren,
                    numberBaby: room.numberBaby
                },
                // Thông tin phí
                fees: {
                    extraFeePerAdult: room.extraFeePerAdult,
                    extraFeePerChild: room.extraFeePerChild,
                    extraFeePerBaby: room.extraFeePerBaby
                },
                // Người thừa (có thể điều chỉnh)
                extraPeople: {
                    adults: {
                        count: extraAdults,
                        fee: room.extraFeePerAdult,
                        total: extraAdults * room.extraFeePerAdult
                    },
                    children: {
                        count: extraChildren,
                        fee: room.extraFeePerChild,
                        total: extraChildren * room.extraFeePerChild
                    },
                    babies: {
                        count: extraBabies,
                        fee: room.extraFeePerBaby,
                        total: extraBabies * room.extraFeePerBaby
                    }
                }
            }
        }) || []
        
        setRoomExtraCharges(roomCharges)
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        setRoomExtraCharges([])
        setSelectedServices([])
        setOtherCharges([])
    }

    const handleSubmit = () => {
      
        const jsonDetailExtraCost = {
            
            serviceCost: selectedServices.map(service => {
                const serviceItem = serviceData.find(s => s.serviceID === service.serviceId)
                return {
                    serviceId: service.serviceId,
                    serviceName: serviceItem?.serviceName || '',
                    quantity: service.quantity,
                    price: serviceItem?.price || 0,
                    total: (serviceItem?.price || 0) * service.quantity
                }
            }),
            otherCost: otherCharges.map(charge => ({
                name: charge.name,
                amount: charge.amount
            })),
            // Thêm thông tin chi tiết theo phòng
            roomDetailCharges: roomExtraCharges,
            totalExtraCost: calculateTotal()
        }
        
        confirmCheckOut(selectedBooking?.bookingID, jsonDetailExtraCost)
        setIsModalVisible(false)
    }

    // Cập nhật số lượng người thừa cho phòng
    const updateRoomExtraPeople = (roomId, type, count) => {
        setRoomExtraCharges(prev => prev.map(room => {
            if (room.roomId === roomId) {
                const updatedRoom = { ...room }
                updatedRoom.extraPeople[type] = {
                    ...updatedRoom.extraPeople[type],
                    count: Math.max(0, count),
                    total: Math.max(0, count) * updatedRoom.extraPeople[type].fee
                }
                return updatedRoom
            }
            return room
        }))
    }

    const addService = () => {
        setSelectedServices([...selectedServices, { key: Date.now(), serviceId: null, quantity: 1 }])
    }

    const updateService = (key, field, value) => {
        setSelectedServices(selectedServices.map(item => 
            item.key === key ? { ...item, [field]: value } : item
        ))
    }

    const addOtherCharge = () => {
        setOtherCharges([...otherCharges, { key: Date.now(), name: '', amount: 0 }])
    }

    const updateOtherCharge = (key, field, value) => {
        setOtherCharges(otherCharges.map(item => 
            item.key === key ? { ...item, [field]: value } : item
        ))
    }

    const calculateTotal = () => {
        const extraTotal = roomExtraCharges.reduce((sum, room) => 
            sum + room.extraPeople.adults.total + room.extraPeople.children.total + room.extraPeople.babies.total, 0)
        
        const serviceTotal = selectedServices.reduce((sum, service) => {
            const serviceItem = serviceData.find(s => s.serviceID === service.serviceId)
            return sum + ((serviceItem?.price || 0) * service.quantity)
        }, 0)
        
        const otherTotal = otherCharges.reduce((sum, charge) => sum + charge.amount, 0)
        
        return extraTotal + serviceTotal + otherTotal
    }

    // Kiểm tra có người vượt quá không
    const hasExcessPeople = selectedBooking?.detailBooking?.some(room => 
        room.numberAdults > room.maxAdults || 
        room.numberChildren > room.maxChildren || 
        room.numberBaby > room.maxBaby
    )

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
                title="Chi phí phát sinh khi trả phòng"
                open={isModalVisible}
                onCancel={handleCancel}
                width={"95vw"}
                footer={[
                    <Button key="back" onClick={handleCancel}>Hủy</Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        Xác nhận và hoàn thành ({formatPrice(calculateTotal())})
                    </Button>,
                ]}
            >
                {hasExcessPeople && (
                    <Alert
                        message="Phát hiện số người vượt quá quy định"
                        description="Hệ thống đã tính toán sẵn các khoản phụ thu theo từng phòng. Bạn có thể điều chỉnh số lượng nếu cần."
                        type="info"
                        icon={<InfoCircleOutlined />}
                        className="mb-4"
                        showIcon
                    />
                )}

                <div className="space-y-6">
                    {/* Phụ thu người theo phòng */}
                    <div>
                        <h3 className="text-base font-medium mb-3">1. Phụ thu người vượt quá quy định</h3>
                        
                        {roomExtraCharges.map((room, index) => {
                            const hasExtraInRoom = room.extraPeople.adults.count > 0 || 
                                                 room.extraPeople.children.count > 0 || 
                                                 room.extraPeople.babies.count > 0
                            
                            return (
                                <Card 
                                    key={room.roomId} 
                                    size="small" 
                                    className="mb-3"
                                    title={
                                        <div className="flex justify-between items-center">
                                            <span>{room.roomName}</span>
                                            {hasExtraInRoom && (
                                                <Tag color="orange">Có phụ thu</Tag>
                                            )}
                                        </div>
                                    }
                                >
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <div className="text-sm text-gray-600 mb-2">Thông tin phòng:</div>
                                            <div className="text-xs space-y-1">
                                                <div>• Người lớn: {room.actual.numberAdults}/{room.limits.maxAdults}</div>
                                                <div>• Trẻ em: {room.actual.numberChildren}/{room.limits.maxChildren}</div>
                                                <div>• Em bé: {room.actual.numberBaby}/{room.limits.maxBaby}</div>
                                            </div>
                                        </Col>
                                        
                                        <Col span={16}>
                                            <div className="text-sm text-gray-600 mb-2">Phụ thu (có thể điều chỉnh):</div>
                                            <Row gutter={8}>
                                                {/* Người lớn thừa */}
                                                <Col span={8}>
                                                    <div className="border p-2 rounded text-center">
                                                        <div className="text-xs text-gray-500">Người lớn thừa</div>
                                                        <InputNumber
                                                            size="small"
                                                            min={0}
                                                            value={room.extraPeople.adults.count}
                                                            onChange={(value) => updateRoomExtraPeople(room.roomId, 'adults', value)}
                                                            className="w-full"
                                                        />
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {formatPrice(room.extraPeople.adults.fee)}/người
                                                        </div>
                                                        <div className="font-medium text-red-600">
                                                            {formatPrice(room.extraPeople.adults.total)}
                                                        </div>
                                                    </div>
                                                </Col>
                                                
                                                {/* Trẻ em thừa */}
                                                <Col span={8}>
                                                    <div className="border p-2 rounded text-center">
                                                        <div className="text-xs text-gray-500">Trẻ em thừa</div>
                                                        <InputNumber
                                                            size="small"
                                                            min={0}
                                                            value={room.extraPeople.children.count}
                                                            onChange={(value) => updateRoomExtraPeople(room.roomId, 'children', value)}
                                                            className="w-full"
                                                        />
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {formatPrice(room.extraPeople.children.fee)}/người
                                                        </div>
                                                        <div className="font-medium text-red-600">
                                                            {formatPrice(room.extraPeople.children.total)}
                                                        </div>
                                                    </div>
                                                </Col>
                                                
                                                {/* Em bé thừa */}
                                                <Col span={8}>
                                                    <div className="border p-2 rounded text-center">
                                                        <div className="text-xs text-gray-500">Em bé thừa</div>
                                                        <InputNumber
                                                            size="small"
                                                            min={0}
                                                            value={room.extraPeople.babies.count}
                                                            onChange={(value) => updateRoomExtraPeople(room.roomId, 'babies', value)}
                                                            className="w-full"
                                                        />
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {formatPrice(room.extraPeople.babies.fee)}/người
                                                        </div>
                                                        <div className="font-medium text-red-600">
                                                            {formatPrice(room.extraPeople.babies.total)}
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            
                                            <div className="text-right mt-2">
                                                <span className="text-sm text-gray-600">Tổng phụ thu phòng: </span>
                                                <span className="font-medium text-red-600">
                                                    {formatPrice(
                                                        room.extraPeople.adults.total + 
                                                        room.extraPeople.children.total + 
                                                        room.extraPeople.babies.total
                                                    )}
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            )
                        })}
                    </div>

                    <Divider />

                    {/* Dịch vụ */}
                    <div>
                        <h3 className="text-base font-medium mb-3">2. Dịch vụ sử dụng</h3>
                        <Table
                            dataSource={selectedServices}
                            pagination={false}
                            size="small"
                            columns={[
                                {
                                    title: 'Dịch vụ',
                                    render: (_, record) => (
                                        <Select
                                            value={record.serviceId}
                                            onChange={(value) => updateService(record.key, 'serviceId', value)}
                                            placeholder="Chọn dịch vụ"
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            style={{ width: "90%" }}
                                        >
                                            {serviceData.map(service => (
                                                <Select.Option key={service.serviceID} value={service.serviceID}>
                                                    {service.serviceName + " ("+"Đơn vị tính: " + service.unit + ")"}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    ),
                                },
                                
                                {
                                    title: 'SL',
                                    render: (_, record) => (
                                        <InputNumber
                                            min={1}
                                            value={record.quantity}
                                            onChange={(value) => updateService(record.key, 'quantity', value)}
                                        />
                                    ),
                                },
                                {
                                    title: 'Đơn giá',
                                    render: (_, record) => {
                                        const service = serviceData.find(s => s.serviceID === record.serviceId)
                                        return service ? formatPrice(service.price) : '-'
                                    },
                                },
                                {
                                    title: 'Thành tiền',
                                    render: (_, record) => {
                                        const service = serviceData.find(s => s.serviceID === record.serviceId)
                                        return service ? formatPrice(service.price * record.quantity) : '-'
                                    },
                                },
                                {
                                    title: '',
                                    render: (_, record) => (
                                        <Button 
                                            type="text" 
                                            danger 
                                            size="small"
                                            onClick={() => setSelectedServices(selectedServices.filter(item => item.key !== record.key))}
                                        >
                                            Xóa
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                        <Button type="dashed" onClick={addService} block icon={<PlusOutlined />} className="mt-2">
                            Thêm dịch vụ
                        </Button>
                    </div>

                    {/* Chi phí khác */}
                    <div>
                        <h3 className="text-base font-medium mb-3">3. Chi phí khác</h3>
                        <Table
                            dataSource={otherCharges}
                            pagination={false}
                            size="small"
                            columns={[
                                {
                                    title: 'Tên chi phí',
                                    render: (_, record) => (
                                        <Input
                                            value={record.name}
                                            onChange={(e) => updateOtherCharge(record.key, 'name', e.target.value)}
                                            placeholder="Nhập tên chi phí"
                                            style={{ width: "90%" }}
                                        />
                                    ),
                                },
                                {
                                    title: 'Số tiền',
                                    render: (_, record) => (
                                        <InputNumber
                                            min={0}
                                            value={record.amount}
                                            onChange={(value) => updateOtherCharge(record.key, 'amount', value)}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            style={{ width: "90%" }}
                                        />
                                    ),
                                },
                                {
                                    title: '',
                                    render: (_, record) => (
                                        <Button 
                                            type="text" 
                                            danger 
                                            size="small"
                                            onClick={() => setOtherCharges(otherCharges.filter(item => item.key !== record.key))}
                                        >
                                            Xóa
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                        <Button type="dashed" onClick={addOtherCharge} block icon={<PlusOutlined />} className="mt-2">
                            Thêm chi phí khác
                        </Button>
                    </div>

                    {/* Tổng kết */}
                    <div className="bg-gray-50 p-4 rounded">
                        <Row justify="space-between" align="middle">
                            <Col>
                                <span className="text-gray-600">Tổng chi phí phát sinh:</span>
                            </Col>
                            <Col>
                                <span className="text-xl font-semibold text-red-600">
                                    {formatPrice(calculateTotal())}
                                </span>
                            </Col>
                        </Row>
                        <div className="text-sm text-gray-500 mt-1">
                            Khách hàng phải thanh toán khi trả phòng
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default memo(StepProcessBookingOwner)