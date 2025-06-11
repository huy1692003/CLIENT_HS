import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, notification, Row, Col, message, Radio, Image, Checkbox, Steps, Card, Table, InputNumber, Alert } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    IdcardOutlined,
    GiftOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    HomeOutlined,
    ArrowRightOutlined,
    ArrowLeftOutlined,
    CheckOutlined,
    TeamOutlined,
    BankOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import CardRoom from '../owner/CardRoom';
import { formatPrice } from '../../utils/formatPrice';
import promotionService from '../../services/promotionService';
import moment from 'moment';
import { convertTimezoneToVN } from '../../utils/convertDate';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atom';
import useSignalR from '../../hooks/useSignaIR';
import bookingService from '../../services/bookingService';
dayjs.extend(isSameOrBefore);
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Step } = Steps;

const disabledDate = (current) => {
    // Disable today and all dates before today
    return current && current.valueOf() < Date.now();
};

const CreateDetailBooking = ({ visible, setVisible, data, listroom, currentStep = 0, setCurrentStep, isOwnerCreate = false }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [voucher, setVoucher] = useState();
    const customer = useRecoilValue(userState)
    const [paramVoucher, setParamVoucher] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const [booking, setBooking] = useState({})
    const [useDays, setUseDays] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);

    const [bookingDetail, setBookingDetail] = useState([])
    const refBk = useRef()
    useEffect(() => {
        if (!paramVoucher) {
            setVoucher(null);
        }
    }, [paramVoucher]);



    useEffect(() => {
        if (visible) {
            const resetData = () => {
                setDateRange([]);
                setUseDays([]);
                setVoucher(null);
                setParamVoucher('');
                setBooking({})
                setSelectedRooms([]);
                setBookingDetail([]);
                setCurrentStep(0);
                form.resetFields();

            }
            resetData();
        }

    }, [visible]);

    const checkVoucher = async () => {

        try {
            if (!paramVoucher) {
                notification.error({ message: "Trường mã giảm giá không được để trống!" })
                return
            }
            let res = await promotionService.getByCode(paramVoucher,data.homeStay?.ownerID)
            res && setVoucher(res)
            notification.success({ message: 'Áp dụng thành công voucher' })
        } catch (error) {
            notification.error({ message: "Mã giảm giá không hợp lệ hãy thử lại mã khác !" })
        }
    }

    console.log(voucher)

    /**
     * Lọc danh sách phòng dựa trên ngày đã chọn
     * Trả về các phòng có sẵn trong khoảng thời gian người dùng đã chọn
     */
    const availableRoomsByDate = useMemo(() => {
        if (useDays.length === 0) return [];
        const currentYear = dayjs().year();
        // Lọc danh sách phòng
        return listroom.filter((room) => {
            // Tạo cấu trúc dữ liệu Map để lưu trữ ngày ẩn theo năm -> tháng -> ngày
            const hiddenByYear = new Map(); // year -> month -> day Set

            // Duyệt qua các ngày ẩn của phòng (nếu có)
            room.roomHiddenDates?.forEach(yearData => {
                // Bỏ qua các năm cũ
                if (yearData.year < currentYear) return; // ❌ Bỏ qua năm cũ

                // Tạo Map cho các tháng trong năm
                const monthMap = new Map();
                yearData.months.forEach(monthData => {
                    // Lưu trữ các ngày ẩn của mỗi tháng vào Set để tìm kiếm nhanh
                    monthMap.set(monthData.month, new Set(monthData.hiddenDays));
                });
                // Lưu trữ dữ liệu tháng vào Map năm
                hiddenByYear.set(yearData.year, monthMap);
            });

            // Kiểm tra từng ngày trong khoảng thời gian đã chọn
            for (const dayStr of useDays) {
                // Phân tách chuỗi ngày thành ngày, tháng, năm
                const [day, month, year] = dayStr.split('/').map(Number);
                // Kiểm tra xem ngày này có bị ẩn không
                const yearMap = hiddenByYear.get(year);
                if (yearMap) {
                    const daySet = yearMap.get(month);
                    if (daySet && daySet.has(day)) {
                        return false; // Phòng không khả dụng vì ngày này bị ẩn
                    }
                }
            }                // Phòng khả dụng cho tất cả các ngày đã chọn
            return true; // Không trùng ngày nào bị ẩn
        });
    }, [listroom, useDays]);



    const handleSubmit = async (dataForm) => {
        setLoading(true);
        let priceOrigin = bookingDetail.reduce((acc, curr) => acc + curr.totalPriceRoom, 0)
        let payload = {
            ...booking,
            homestayID: data.homeStay?.homestayID,
            ownerID: data.homeStay?.ownerID,
            customerID: !isOwnerCreate ? customer?.customerID || undefined : undefined,
            detailBooking: bookingDetail.map(s => ({
                ...s,
                dateStart: convertTimezoneToVN(dateRange[0]),
                dateEnd: convertTimezoneToVN(dateRange[1])
            })),
            originalPrice: priceOrigin,
            discountCode: voucher?.discountCode || undefined,
            paymentMethod: "Momo",
            checkInDate: convertTimezoneToVN(dateRange[0]),
            checkOutDate: convertTimezoneToVN(dateRange[1]),
            discountPrice: voucher?.discountAmount || 0,
            totalPrice: priceOrigin - (voucher?.discountAmount || 0),
            isOwnerCreate: isOwnerCreate
        }
        try {
            let mes = await bookingService.create(payload)
            mes && notification.info({ description: mes?.message, message: "Đang xử lý đơn đặt phòng", duration: 8, showProgress: true })
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (dates) => {
        if (dates && dates[0] && dates[1]) {
            const start = dates[0];
            const end = dates[1];

            // Kiểm tra nếu ngày kết thúc không lớn hơn ngày bắt đầu
            if (end.isSameOrBefore(start, 'day')) {
                message.error('Vui lòng chọn ít nhất 1 ngày sử dụng!');
                setDateRange([]);
                form.setFieldsValue({
                    dateRange: []
                });
                setUseDays([]);
            }
            else {
                setDateRange(dates);
                const start = dates[0];
                const end = dates[1];
                const dayList = [];
                let current = dayjs(start);
                while (current.isSameOrBefore(end, 'day')) {
                    dayList.push(current.format('DD/MM/YYYY'));
                    current = current.add(1, 'day');
                }
                setUseDays(dayList);
            }
        }
        else {
            setDateRange([])
            setUseDays([])
        }
    };

  
    const nextStep = async () => {
        try {
            if (currentStep === 0) {
                // Validate date range
                if (!dateRange || dateRange.length !== 2) {
                    message.error('Vui lòng chọn thời gian lưu trú!');
                    return;
                }
                setBookingDetail([])
                setSelectedRooms([])
            } else if (currentStep === 1) {
                // Validate room selection
                if (selectedRooms.length === 0) {
                    message.error('Vui lòng chọn ít nhất một phòng!');
                    return;
                }
            } else if (currentStep === 2) {
                // Validate customer information
                await form.validateFields(['name', 'CMND', 'email', 'phone']);
                setBooking({ ...form.getFieldsValue() })
            }
            setCurrentStep(currentStep + 1);
            refBk.current.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.log('Validation failed:', error);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleDetailBK = (room, name, value) => {
        setBookingDetail(prev => prev.map(item => item.roomId === room.roomId ?
            {
                ...item,
                [name]: value,
            }
            : item))
    }

    const steps = [
        {
            title: 'Chọn thời gian',
            icon: <CalendarOutlined />,
        },
        {
            title: 'Chọn phòng',
            icon: <HomeOutlined />,
        },
        {
            title: 'Thông tin khách hàng',
            icon: <UserOutlined />,
        },
        {
            title: 'Xác nhận đặt phòng',
            icon: <CheckCircleOutlined />,
        },
    ];

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Card className="border-blue-100 shadow-lg">
                        <div className="text-center mb-6">
                            <CalendarOutlined className="text-4xl text-blue-500 mb-3" />
                            <h3 className="text-xl font-semibold text-gray-800">Chọn thời gian lưu trú</h3>
                            <p className="text-gray-600">Vui lòng chọn ngày nhận phòng và trả phòng</p>
                        </div>

                        <Form.Item
                            name="dateRange"
                            className="mb-6"
                        >
                            <RangePicker
                                value={dateRange}
                                onChange={handleDateRangeChange}
                                disabledDate={disabledDate}
                                placeholder={['Ngày nhận phòng', 'Ngày trả phòng']}
                                format="DD/MM/YYYY"
                                size="large"
                                className="w-full rounded-lg border-blue-200 hover:border-blue-400 focus:border-blue-500"
                            />
                        </Form.Item>

                        {dateRange && dateRange.length === 2 && (
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg text-white text-center">
                                <div className="text-lg flex items-center justify-center font-medium">
                                    <CheckCircleOutlined className="text-xl mr-2 inline-block" />
                                    Tổng số đêm: {dateRange[1].diff(dateRange[0], 'days')} đêm
                                    <div className="text-sm opacity-90 inline-block ml-2">
                                        (Từ {dateRange[0].format('DD/MM/YYYY')} đến {dateRange[1].format('DD/MM/YYYY')})
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                );

            case 1:
                return (
                    <Card className="border-blue-100 shadow-lg">
                        <div className="text-center mb-6">
                            <HomeOutlined className="text-4xl text-blue-500 mb-3" />
                            <h3 className="text-xl font-semibold text-gray-800">Chọn phòng</h3>
                            <p className="text-gray-600">Danh sách phòng trống trong thời gian bạn chọn</p>
                        </div>

                        {availableRoomsByDate?.length > 0 ? (
                            <div className="space-y-4">
                                {availableRoomsByDate.map((room) => (
                                    <div key={room.roomId} className={`border-2 rounded-lg transition-all duration-300 ${selectedRooms.find(item => item.roomId === room.roomId)
                                        ? 'border-blue-400 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-200'
                                        }`}>

                                        <CardRoom
                                            ButtonAction={
                                                <Button
                                                    className='font-medium'
                                                    type={selectedRooms.find(item => item.roomId === room.roomId) ? 'default' : 'primary'}
                                                    danger={selectedRooms.find(item => item.roomId === room.roomId)}
                                                    onClick={() => {
                                                        if (selectedRooms.find(item => item.roomId === room.roomId)) {
                                                            setSelectedRooms(selectedRooms.filter(item => item.roomId !== room.roomId))
                                                            setBookingDetail(prev => prev.filter(item => item.roomId !== room.roomId))
                                                        } else {
                                                            setSelectedRooms([...selectedRooms, room])
                                                            const totalNight = dateRange[1].diff(dateRange[0], 'days')
                                                            setBookingDetail(prev => [...prev, {
                                                                roomId: room.roomId,
                                                                maxAdults: room.maxAdults,
                                                                maxChildren: room.maxChildren,
                                                                maxBaby: room.maxBaby,
                                                                numberAdults: 1,
                                                                numberChildren: 0,
                                                                numberBaby: 0,
                                                                pricePerNight: room.pricePerNight,
                                                                priceFromSecondNight: room.priceFromSecondNight,
                                                                extraFeePerChild: room.extraFeePerChild,
                                                                extraFeePerBaby: room.extraFeePerBaby,
                                                                extraFeePerAdult: room.extraFeePerAdult,
                                                                roomName: room.roomName,
                                                                dateStart: dateRange[0],
                                                                dateEnd: dateRange[1],
                                                                roomType: room.roomType,
                                                                totalPriceRoom: room.pricePerNight + (room.priceFromSecondNight * (totalNight - 1))
                                                            }])
                                                        }
                                                    }}


                                                >
                                                    {selectedRooms.find(item => item.roomId === room.roomId) ? 'Bỏ chọn phòng' : 'Chọn phòng này'}
                                                </Button>
                                            }
                                            room={room}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🏠</div>
                                <h4 className="text-lg font-medium text-gray-600 mb-2">Không có phòng trống</h4>
                                <p className="text-gray-500">Vui lòng chọn thời gian khác</p>
                            </div>
                        )}

                        {selectedRooms.length > 0 && (
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2 text-green-700">
                                    <CheckCircleOutlined />
                                    <span className="font-medium">
                                        Đã chọn {selectedRooms.length} phòng
                                    </span>
                                </div>
                            </div>
                        )}
                    </Card>
                );

            case 2:
                return (
                    <Card className="border-blue-100 shadow-lg">
                        <div className="text-center mb-6">
                            <UserOutlined className="text-4xl text-blue-500 mb-3" />
                            <h3 className="text-xl font-semibold text-gray-800">Thông tin khách hàng</h3>
                            <p className="text-gray-600">Vui lòng điền thông tin người đặt phòng</p>
                        </div>

                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700 flex items-center gap-2">
                                            <UserOutlined className="text-cyan-600" />
                                            Tên người liên hệ
                                        </span>
                                    }
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                                >
                                    <Input
                                        placeholder="Nhập họ và tên"
                                        size="large"
                                        className="rounded-lg border-blue-200 hover:border-blue-400 focus:border-blue-500"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700 flex items-center gap-2">
                                            <IdcardOutlined className="text-cyan-600" />
                                            Số CMND/CCCD
                                        </span>
                                    }
                                    name="CMND"
                                    rules={[{ required: true, message: 'Vui lòng nhập số CMND!' }]}
                                >
                                    <Input
                                        placeholder="Nhập số CMND/CCCD"
                                        size="large"
                                        className="rounded-lg border-blue-200 hover:border-blue-400 focus:border-blue-500"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700 flex items-center gap-2">
                                            <MailOutlined className="text-cyan-600" />
                                            Email liên hệ
                                        </span>
                                    }
                                    name="email"
                                    rules={[
                                        { required: true, type: 'email', message: 'Vui lòng nhập địa chỉ email hợp lệ!' }
                                    ]}
                                >
                                    <Input
                                        placeholder="Nhập email"
                                        size="large"
                                        className="rounded-lg border-blue-200 hover:border-blue-400 focus:border-blue-500"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700 flex items-center gap-2">
                                            <PhoneOutlined className="text-cyan-600" />
                                            Số điện thoại
                                        </span>
                                    }
                                    name="phone"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                >
                                    <Input
                                        placeholder="Nhập số điện thoại"
                                        size="large"
                                        className="rounded-lg border-blue-200 hover:border-blue-400 focus:border-blue-500"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className="mt-4">
                            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <TeamOutlined className="text-blue-500" />
                                Số lượng người sử dụng
                            </h2>
                            <Table
                                dataSource={selectedRooms}
                                pagination={false}
                                bordered
                                className="rounded-lg overflow-hidden"
                                size="small"
                            >
                                <Table.Column title="Tên phòng" dataIndex="roomName" key="roomName" />
                                <Table.Column title="Loại phòng" dataIndex="roomType" key="roomType" />
                                <Table.Column
                                    title="Người lớn"
                                    key="adults"
                                    render={(text, room) => (
                                        <InputNumber
                                            value={bookingDetail.find(item => item.roomId === room.roomId)?.numberAdults}
                                            min={1}
                                            max={room.maxAdults + 3}
                                            onChange={(value) => {
                                                handleDetailBK(room, 'numberAdults', value)
                                            }}
                                            defaultValue={1}
                                            className="w-16"
                                            size="small"
                                        />
                                    )}
                                />
                                <Table.Column
                                    title="Trẻ em"
                                    key="children"
                                    render={(text, room) => (
                                        <InputNumber
                                            value={bookingDetail.find(item => item.roomId === room.roomId)?.numberChildren}
                                            min={0}
                                            max={room.maxChildren + 3}
                                            onChange={(value) =>
                                                handleDetailBK(room, 'numberChildren', value)}
                                            defaultValue={0}
                                            className="w-16"
                                            size="small"
                                        />
                                    )}
                                />
                                <Table.Column
                                    title="Em bé"
                                    key="baby"
                                    render={(text, room) => (
                                        <InputNumber
                                            value={bookingDetail.find(item => item.roomId === room.roomId)?.numberBaby}
                                            min={0}
                                            max={room.maxBaby + 3}
                                            defaultValue={0}
                                            className="w-16"
                                            size="small"
                                            onChange={(value) => handleDetailBK(room, 'numberBaby', value, room)}
                                        />
                                    )}
                                />
                            </Table>
                        </div>
                        <Form.Item
                            label={
                                <span className="font-medium text-gray-700 flex items-center gap-2">
                                    <FileTextOutlined className="text-cyan-600" />
                                    Ghi chú thêm
                                </span>
                            }
                            name="description"
                            className="mt-6"
                        >
                            <TextArea
                                rows={4}
                                placeholder='Yêu cầu đặc biệt, ghi chú thêm...'
                                className="rounded-lg border-blue-200 hover:border-blue-400 focus:border-blue-500"
                            />
                        </Form.Item>

                        <div className="border-t border-blue-100 pt-6 mt-6">
                            <Form.Item
                                label={
                                    <span className="font-medium text-gray-700 flex items-center gap-2">
                                        <GiftOutlined className="text-cyan-600" />
                                        Mã giảm giá
                                    </span>
                                }
                                className="mb-0"
                            >
                                <div className="flex gap-3 items-start">
                                    <Input
                                        value={paramVoucher}
                                        allowClear
                                        onChange={(e) => setParamVoucher(e.target.value)}
                                        placeholder="Nhập mã voucher"
                                        size="large"
                                        className="flex-1 rounded-lg border-blue-200 hover:border-blue-400 focus:border-blue-500"
                                    />
                                    <Button
                                        type='primary'
                                        onClick={checkVoucher}
                                        size="large"
                                        className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 border-none font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                                    >
                                        Áp dụng
                                    </Button>
                                </div>
                                {voucher && (
                                    <div className="mt-3 p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white">
                                        <CheckCircleOutlined className="mr-2" />
                                        Voucher "{voucher?.discountCode}" đã được áp dụng - Giảm {formatPrice(voucher?.discountAmount)}
                                    </div>
                                )}
                            </Form.Item>
                        </div>
                    </Card>
                );

            case 3:
                return (
                    <Card className="border-blue-100 shadow-lg">
                        <div className="text-center mb-6">
                            <CheckCircleOutlined className="text-4xl text-green-500 mb-3" />
                            <h3 className="text-xl font-semibold text-gray-800">Xác nhận đặt phòng</h3>
                            <p className="text-gray-600">Kiểm tra lại thông tin trước khi xác nhận</p>
                        </div>

                        <div className="space-y-6">
                            {/* Booking Summary */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <CalendarOutlined className="text-blue-500" />
                                    Thông tin đặt phòng
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Thời gian:</span>
                                        <div className="font-medium">
                                            {dateRange[0]?.format('DD/MM/YYYY')} - {dateRange[1]?.format('DD/MM/YYYY')}
                                        </div>
                                        <div className="text-blue-600">
                                            ({dateRange[1]?.diff(dateRange[0], 'days')} đêm)
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Số phòng đã chọn:</span>
                                        <div className="font-medium text-blue-600">
                                            {selectedRooms.length} phòng

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <UserOutlined className="text-blue-500" />
                                    Thông tin khách hàng
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Tên:</span>
                                        <div className="font-medium">{form.getFieldValue('name')}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">CMND/CCCD:</span>
                                        <div className="font-medium">{form.getFieldValue('CMND')}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Email:</span>
                                        <div className="font-medium">{form.getFieldValue('email')}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Điện thoại:</span>
                                        <div className="font-medium">{form.getFieldValue('phone')}</div>
                                    </div>
                                </div>

                                {form.getFieldValue('description') && (
                                    <div className="mt-3">
                                        <span className="text-gray-600">Ghi chú:</span>
                                        <div className="font-medium">{form.getFieldValue('description')}</div>
                                    </div>
                                )}
                            </div>

                            {/* Voucher Info */}
                            {voucher && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <GiftOutlined className="text-green-500" />
                                        Số
                                    </h4>
                                    <div className="text-green-700">
                                        Mã: <span className="font-medium">{voucher.code}</span> -
                                        Giảm <span className="font-medium">{voucher.discount}%</span>
                                    </div>
                                </div>
                            )}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <BankOutlined className="text-green-500" />
                                    Chi phí
                                </h4>
                                <div className="text-green-700">
                                    <Table
                                        dataSource={bookingDetail}
                                        bordered
                                        className="rounded-lg overflow-hidden"
                                        size="small"
                                        pagination={false}
                                    >
                                        <Table.Column title="Tên phòng" dataIndex="roomName" key="roomName" />
                                        <Table.Column title="Loại phòng" dataIndex="roomType" key="roomType" />
                                        <Table.Column
                                            title="Giá phòng/đêm"
                                            key="pricePerNight"
                                            render={(text, record) => (
                                                <div className="w-auto">
                                                    <div className="grid grid-cols-2">
                                                        <span>Đêm đầu tiên:</span>
                                                        <span className="font-bold text-blue-600">{formatPrice(record.pricePerNight)}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2">
                                                        <span>Đêm thứ 2 trở đi:</span>
                                                        <span className="font-bold text-blue-600">{formatPrice(record.priceFromSecondNight)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                        <Table.Column
                                            title="Tổng số đêm"
                                            key="nights"
                                            render={(text, record) => {
                                                const start = dayjs(record.dateStart, "DD/MM/YYYY");
                                                const end = dayjs(record.dateEnd, "DD/MM/YYYY");
                                                return end.diff(start, 'days');
                                            }}
                                        />
                                        <Table.Column
                                            title="Số người sử dụng"
                                            key="extraFee"
                                            render={(text, record) => {
                                                return <span>{record.numberAdults} người lớn, {record.numberChildren} trẻ em, {record.numberBaby} em bé</span>
                                            }}
                                        />
                                        <Table.Column
                                            title="Tổng tiền"
                                            key="totalPrice"
                                            render={(text, record) => {
                                                return <span className="font-bold text-blue-600">{formatPrice(record.totalPriceRoom)}</span>;
                                            }}
                                        />
                                    </Table>
                                    <div className="text-green-700 mt-4 p-4 rounded-lg border border-green-200">
                                        <div className="grid grid-cols-2 gap-2 text-lg">
                                            <span className="font-medium">Tổng cộng:</span>
                                            <span className="font-bold text-right">{formatPrice(bookingDetail.reduce((acc, curr) => acc + curr.totalPriceRoom, 0))}</span>

                                            <span className="font-medium">Giảm giá:</span>
                                            <span className="font-bold text-right text-red-600">{formatPrice(voucher ? voucher?.discountAmount : 0)}</span>

                                            <span className="font-medium text-xl">Thành tiền:</span>
                                            <span className="font-bold text-right text-xl text-blue-700">{formatPrice(bookingDetail.reduce((acc, curr) => acc + curr.totalPriceRoom, 0) - (voucher ? voucher?.discountAmount : 0))}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <Alert type="warning" message={<>
                                <span className='font-semibold text-orange-700'>Lưu ý</span>
                                <p>Quý khách sẽ phải thanh toán tiền phòng trước, ngoài ra còn những dịch vụ và chi phí phát sinh sẽ được thanh toán ngay sau khi bạn checkout.
                                    <br />
                                    Huystay chân thành gửi lời cảm ơn quý khách đã tin tưởng sử dụng dịch vụ của Huystay.
                                </p>
                            </>}>

                            </Alert>
                        </div>
                    </Card>
                );

            default:
                return null;
        }
    };

    const renderStepButtons = () => {
        return (
            <div className="flex justify-between mt-4">
                <Button
                    size="large"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 rounded-lg"
                    icon={<ArrowLeftOutlined />}
                >
                    Quay lại bước trước
                </Button>

                {currentStep < steps.length - 1 ? (
                    <Button
                        type="primary"
                        size="large"
                        onClick={nextStep}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 border-none font-medium hover:from-cyan-600 hover:to-blue-600"
                        icon={<ArrowRightOutlined />}
                    >
                        Bước tiếp theo
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={() => form.submit()}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 border-none font-medium hover:from-green-600 hover:to-green-700"
                        icon={<CheckOutlined />}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
                    </Button>
                )}
            </div>
        );
    };

    return (
        <Modal
            title={null}
            visible={visible}
            onCancel={() => setVisible(false)}
            width={"95vw"}
            footer={null}
            className=""

            style={{ top: 20 }}
        >
            <div className="bg-white lg:p-6 rounded-2xl" ref={refBk}>
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-600 via-blue-400 to-blue-500 p-4 py-3 rounded-2xl mb-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <CalendarOutlined className="text-xl text-white" />
                        <h2 className="text-lg font-bold text-white m-0">
                            Đặt phòng trực tuyến
                        </h2>
                    </div>
                    <p className="text-blue-100 text-base m-0">
                        Hoàn thành {steps.length} bước đơn giản để đặt phòng
                    </p>
                </div>

                {/* Steps */}
                <div className="mb-4">
                    <Steps
                        current={currentStep}
                        items={steps}
                        className="px-4"
                    />
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="space-y-6"
                >
                    {/* Step Content */}
                    <div className="">
                        {renderStepContent()}
                    </div>

                    {/* Navigation Buttons */}
                    {renderStepButtons()}
                </Form>
            </div>
        </Modal>
    );
};

export default memo(CreateDetailBooking);