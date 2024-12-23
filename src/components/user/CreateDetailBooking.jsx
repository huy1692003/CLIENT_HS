import React, { memo, useEffect, useMemo, useState } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Select, Button, notification, Tag, Row, Col, message } from 'antd';
import moment, { duration } from 'moment';
import CardHomeStay from './CardHomeStay';
import TextArea from 'antd/es/input/TextArea';
import { data } from 'autoprefixer';
import { formatPrice } from '../../utils/formatPrice';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atom';
import bookingService from '../../services/bookingService';
import { convertDateTime, convertTimezoneToVN } from '../../utils/convertDate';
import promotionService from '../../services/promotionService';
import dayjs from 'dayjs';

const { Option } = Select;
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateString));
};
const CreateDetailBooking = ({ visible, onClose, data, bookingValue, disabledDates }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); // Đặt loading mặc định là false
    const [bookings, setBookings] = useState(bookingValue);
    const [user, setUser] = useRecoilState(userState)
    const [voucher, setVoucher] = useState(null)
    const [paramVoucher, setParamVoucher] = useState('')

    useEffect(
        () => {
            if (!paramVoucher) {
                setVoucher(null)
            }
        }, [paramVoucher]
    )

    useEffect(() => {
        if (visible && bookingValue) {
            // Gán giá trị vào form khi modal được mở
            form.setFieldsValue({
                numberOfGuests: bookingValue.numberofGuest,
                checkInDate: bookingValue.dateIn,
                checkOutDate: bookingValue.dateOut,
            });
        }
    }, [visible, bookingValue]); // Chạy khi visible hoặc jsonData thay đổi


    const checkVoucher = async () => {

        try {
            if (!paramVoucher) {
                notification.error({ message: "Trường mã giảm giá không được để trống!" })
                return
            }
            let res = await promotionService.getByCode(paramVoucher)
            res && setVoucher(res)
            notification.success({ message: 'Áp dụng thành công voucher' })
        } catch (error) {
            notification.error({ message: "Mã giảm giá không hợp lệ hãy thử lại mã khác !" })
        }
    }

    // Hiển thị các ngày đặt từ ngày bawtsd dầu đến ngày về
    const renderDateBooking = useMemo(() => {
        let { dateIn, dateOut } = bookings
        const startDate = dateIn; // Ngày bắt đầu
        const endDate = dateOut; // Ngày kết thúc

        // Tạo danh sách các ngày
        const days = [];
        if (dateIn && dateOut) {


            let currentDay = startDate;
            while (currentDay < endDate) {
                days.push(currentDay.format('DD-MM-YYYY')); // Định dạng ngày
                currentDay = currentDay.add(1, 'days'); // Tăng lên 1 ngày VD 16,17,18,19
            }
        }

        return days;

    }, [bookings])

    const totalBill = useMemo(() => {
        if (renderDateBooking.length > 0) {
            let price = 0;
            for (let index = 0; index < renderDateBooking.length; index++) {
                price += index === 0 ? data.homeStay.pricePerNight : data.homeStay.discountSecondNight

            }
            return price
        }
        else {
            return null
        }
    }, [renderDateBooking, data])

    const handleSubmit = async (dataForm) => {
        setLoading(true)
        if (user) {

            if (totalBill && totalBill > 0) {
                var booking = {
                    ...dataForm,
                    checkInDate: convertTimezoneToVN(bookings.dateIn),
                    checkOutDate: convertTimezoneToVN(bookings.dateOut),
                    totalPrice: voucher ? totalBill - voucher.discountAmount : totalBill,
                    originalPrice: totalBill,
                    bookingID: 0,
                    discountPrice: voucher ? voucher.discountAmount : 0,
                    discountCode: voucher ? voucher.discountCode : "",
                    customerID: user.idCus,
                    ownerID: data.homeStay.ownerID,
                    homeStayID: data.homeStay.homestayID,
                    isConfirm: 0,
                    isCancel: 0,
                    bookingTime: new Date().toISOString()
                }
                console.log(booking)
                try {
                    let res = await bookingService.create(booking)
                    res && notification.success({ message: "Đặt phòng thành công !", description: "Thông tin đặt phòng của bạn đã được ghi lại và đang được chờ xử lý ", showProgress: true, duration: 9 })
                    onClose()
                    form.resetFields()
                } catch (error) {
                    message.error('Đặt phòng không thành công thông tin đặt phòng không hợp lệ hoặc đã có người đặt vào thời điểm hãy thử lại sau ít phút')
                } finally {
                    setLoading(false)
                }
            }
            else {
                notification.error({
                    message: 'Thông tin đặt phòng không hợp lệ',
                    showProgress: true,
                    description: 'Hãy chọn ngày đến và ngày về hợp lệ !',
                    placement: "topRight", // vị trí của thông báo (có thể thay đổi)
                    duration: 5, // thời gian hiển thị (giây)
                });

            }
        }
        else {
            notification.error({
                message: 'Yêu cầu đăng nhập',
                showProgress: true,
                description: 'Vui lòng đăng nhập trước khi thuê phòng!',
                placement: "topRight", // vị trí của thông báo (có thể thay đổi)
                duration: 5, // thời gian hiển thị (giây)
            });
        }
        setLoading(false)
    };

    return (
        <div style={{ width: 1000 }}>
            <Modal
                title={<Tag color="green" className='text-xl font-bold mb-5 p-2' style={{ width: "97%" }}>Chi tiết đặt phòng</Tag>}
                visible={visible}
                onCancel={() => onClose(false)}
                width={1000}
                footer={null}
                className="rounded-lg"
            >
                <Row>
                    <Col className='w-8/12 mr-5'>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            className="space-y-4"
                        >
                            <Form.Item
                                label="Tên Người Liên Hệ "
                                name="name" // Cập nhật trường name
                                rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                            >
                                <Input placeholder="Nhập tên khách hàng" />
                            </Form.Item>

                            <Form.Item
                                label="Email Liên Hệ"
                                name="email" // Cập nhật trường email
                                rules={[{ required: true, type: 'email', message: 'Vui lòng nhập địa chỉ email hợp lệ!' }]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>

                            <Form.Item
                                label="Số Điện Thoại Liên Hệ"
                                name="phone" // Cập nhật trường phone
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <Form.Item
                                label="Ngày Nhận Phòng"
                                name="checkInDate"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày nhận phòng!' }]}
                            >
                                <DatePicker
                                    value={bookings.dateIn}
                                    disabledDate={disabledDates}
                                    placeholder="Chọn ngày nhận phòng"
                                    className="w-full"
                                    onChange={(date) => {
                                        setBookings({ ...bookings, dateIn: date })

                                        if (bookings.dateOut && date >= bookings.dateOut) {
                                            notification.error({
                                                message: 'Lỗi',
                                                showProgress: true,
                                                description: 'Quy định khi thuê HomeStay tối thiểu phải là 1 đêm vui lòng chọn lại ngày về',
                                                placement: "topRight", // vị trí của thông báo (có thể thay đổi)
                                                duration: 4, // thời gian hiển thị (giây)
                                            });
                                        }
                                        else {
                                            setBookings({ ...bookings, dateIn: date })
                                        }


                                    }}
                                    format="DD-MM-YYYY"
                                />
                            </Form.Item>

                            <Form.Item
                                format="DD-MM-YYYY"
                                label="Ngày Trả Phòng"
                                name="checkOutDate"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày trả phòng!' }]}
                            >
                                <DatePicker
                                    format="DD-MM-YYYY"
                                    value={bookings.dateOut}
                                    disabledDate={disabledDates}
                                    placeholder="Chọn ngày trả phòng"
                                    className="w-full"
                                    onChange={(date) => {
                                        if (date > bookings.dateIn) {

                                            setBookings({ ...bookings, dateOut: date })
                                        }
                                        else {
                                            setBookings({ ...bookings, dateOut: null })
                                            notification.error({
                                                message: 'Lỗi',
                                                showProgress: true,
                                                description: 'Quy định khi thuê HomeStay tối thiểu phải là 1 đêm vui lòng chọn lại ngày về',
                                                placement: "topRight", // vị trí của thông báo (có thể thay đổi)
                                                duration: 4, // thời gian hiển thị (giây)
                                            });
                                        }
                                    }
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                label={"Số người sử dụng -- " + "Từ " + data.homeStay.minPerson + " Đến " + data.homeStay.maxPerson + " Người"}
                                name="numberOfGuests"
                                rules={[{ required: true, message: 'Vui lòng nhập số người!' }]}
                            >
                                <InputNumber min={data.homeStay.minPerson} max={data.homeStay.maxPerson} placeholder="Nhập số khách" className="w-full" />
                            </Form.Item>
                            <Form.Item
                                label="Ghi chú thêm"
                                name="description"
                            >
                                <TextArea rows={7} placeholder='Yêu cầu thêm nếu có ...' />
                            </Form.Item>

                            <Form.Item
                                label="Voucher giảm giá nếu có"
                            // Cập nhật trường phone

                            >
                                <div className='flex gap-2'>

                                    <Input value={paramVoucher} allowClear onChange={(vl) => setParamVoucher(vl.target.value)} placeholder="Nhập mã voucher" />
                                    <Button type='primary' onClick={() => checkVoucher()}>Áp dụng</Button>
                                </div>
                            </Form.Item>
                            {/* {
                                voucher && <Form.Item
                                    label="Số tiền giảm giá"
                                // Cập nhật trường phone

                                >
                                    <div className='flex gap-2'>
                                        <Input value={paramVoucher} allowClear onChange={(vl) => setParamVoucher(vl.target.value)} placeholder="Nhập mã voucher" />
                                        <Button type='primary' onClick={() => alert()}>Áp dụng</Button>
                                    </div>
                                </Form.Item>
                            } */}
                        </Form>
                    </Col>
                    <Col className='w-3/12 text-center bg-gray-50 border py-6 pt-3 rounded-2xl'>
                        <Tag color='blue' className='w-11/12 text-xl text-center font-medium p-2'>Thông tin HomeStay</Tag>
                        <div className='text-center'>
                            <CardHomeStay data={data} width="100%" />
                        </div>
                    </Col>
                    <div className=' w-full mt-10'>
                        <div className=' w-7/12'>
                            <Tag color="gold-inverse" className='text-xl mb-4'>Thời gian lưu trú</Tag>
                            {renderDateBooking.length === 0 && <p className='text-orange-800 text-xl'>Bạn chưa chọn thời gian thuê</p>}
                            {renderDateBooking.map((d, index) => {
                                return <>
                                    {

                                        index < 1 ?
                                            <Row className='w-full py-3 border-b border-gray-300 flex justify-between '>
                                                <Col className='w-8/12' >
                                                    <span className='font-medium text-gray-600 text-base mb-3'>Đêm {d} </span>
                                                </Col>
                                                <Col className='text-right'>
                                                    <span className='font-bold text-orange-600 text-base mb-3'>{formatPrice(data.homeStay.pricePerNight)}</span>
                                                </Col>
                                            </Row> :
                                            <Row className=' py-3 border-b border-gray-300 flex justify-between'>
                                                <Col className='w-8/12' >
                                                    <span className='font-medium text-gray-600  text-base mb-3'>Đêm {d} </span>
                                                </Col>
                                                <Col className='text-right'>
                                                    <span className='font-bold text-orange-500 text-base mb-3'>{formatPrice(data.homeStay.discountSecondNight)}</span>
                                                </Col>
                                            </Row>
                                    }
                                </>
                            }
                            )}
                            {
                                totalBill &&
                                <Row className=' py-3 border-b border-gray-300 flex justify-between'>
                                    <Col className='w-8/12' >
                                        <span className='font-bold text-base mb-3'>Tổng tiền thuê </span>
                                    </Col>

                                    <Col className='text-right'>
                                        <span className='font-bold text-orange-500 text-base mb-3'>{formatPrice(totalBill)}</span>
                                    </Col>
                                </Row>
                            }
                            {
                                voucher && totalBill && <>
                                    <Row className=' py-3 border-b border-gray-300 flex justify-between'>
                                        <Col className='w-8/12' >
                                            <span className='font-bold text-base mb-3'>Giảm giá </span>
                                        </Col>

                                        <Col className='text-right w-auto'>
                                            <span className='font-bold text-orange-500 text-base mb-3'>- {formatPrice(voucher.discountAmount)}</span>
                                        </Col>
                                    </Row>
                                    <Row className=' py-3 border-b border-gray-300 flex justify-between'>
                                        <Col className='w-8/12' >
                                            <span className='font-bold text-base mb-3'>Thành tiền</span>
                                        </Col>

                                        <Col className='text-right'>
                                            <span className='font-bold text-orange-500 text-base mb-3'>{formatPrice(totalBill - voucher.discountAmount)}</span>
                                        </Col>
                                    </Row>
                                </>


                            }

                        </div>
                    </div >
                </Row >

                <Form.Item>
                    <Button loading={loading} type="primary" onClick={() => form.submit()} className="w-full mt-5 text-xl py-5">
                        Tạo Đặt Phòng
                    </Button>
                </Form.Item>
            </Modal >
        </div >
    );
};
export default memo(CreateDetailBooking)
