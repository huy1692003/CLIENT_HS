import React, { useState, useEffect } from 'react';
import { Result, Button, Input, Form, Modal, notification, Spin, message } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import bookingService from '../../../services/bookingService';

const { TextArea } = Input;
const actionType = {
    confirm: 'confirm',
    reject: 'reject'
}

const BookingAction = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [searchParams] = useSearchParams();
    const [idBooking, setIdBooking] = useState('')
    const [actionCurrent, setActionCurrent] = useState('')
    const [isLoadingPage, setIsLoadingPage] = useState(true)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [loadingModal, setLoadingModal] = useState(false)
    useEffect(() => {
        const action = searchParams.get('action');
        const idBooking = searchParams.get('id');

        if (action && idBooking) {
            setActionCurrent(action)
            setIdBooking(idBooking)
        }
    }, [searchParams]);

    useEffect(() => {
        if (actionCurrent === 'confirm' && idBooking) {
            handleConfirmBooking()
        }
        else if (actionCurrent === 'reject' && idBooking) {
            setIsLoadingPage(false)
            setShowRejectModal(true)
        }
    }, [actionCurrent, idBooking]);

    async function handleConfirmBooking() {
        try {
            let res = await bookingService.confirm(idBooking)
            res && setIsLoadingPage(false)
        } catch (error) {
            message.error("Có lỗi khi xác nhận đơn đặt phòng, hãy thử lại sau!")
        }
    }

    async function handleRejectBooking(values) {
        setLoadingModal(true)
        try {
            let res = await bookingService.cancel(idBooking, values.reason)
            res && setIsLoadingPage(false)
            setShowRejectModal(false)
        } catch (error) {
            message.error("Có lỗi khi từ chối đơn đặt phòng, hãy thử lại sau!")
        }
        finally {
            setLoadingModal(false)
        }
    }



    if (isLoadingPage) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
                <div className="p-5 bg-white rounded-xl shadow-lg text-center">
                    <Spin
                        indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
                        tip="Đang xử lý..."

                        size="large"
                    >
                    </Spin>
                    <div className="mt-6 pt text-xl text-gray-500 font-medium">
                        Vui lòng đợi trong giây lát...
                    </div>
                    <div className="mt-4 text-blue-500 text-lg">
                        Hệ thống đang xử lý yêu cầu của bạn
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            {actionCurrent === actionType.confirm && (
                <Result
                    icon={<CheckCircleFilled style={{ color: '#52c41a' }} />}
                    title="Xác nhận đơn đặt phòng thành công"
                    subTitle="Đơn đặt phòng đã được xác nhận và thông báo đã được gửi đến khách hàng."
                    extra={[
                        <Button type="primary" key="back" onClick={() => navigate('/')}>
                            Quay lại trang chủ
                        </Button>
                    ]}
                />
            )}

            {actionCurrent === actionType.reject && !showRejectModal && (
                <Result
                    icon={<CloseCircleFilled style={{ color: '#ff4d4f' }} />}
                    title="Từ chối đơn đặt phòng thành công"
                    subTitle="Đơn đặt phòng đã bị từ chối và thông báo đã được gửi đến khách hàng."
                    extra={[
                        <Button type="primary" key="back" onClick={() => navigate('/')}>
                            Quay lại trang chủ
                        </Button>
                    ]}
                />
            )}

            <Modal
                title={<div className="text-xl font-bold">Từ chối đơn đặt phòng <span className="text-blue-500">#{idBooking}</span></div>}
                open={showRejectModal}
                onCancel={() => {
                    notification.info({
                        message: 'Hủy thao tác từ chối đơn đặt phòng',
                        description: 'Bạn đã hủy thao tác từ chối đơn đặt phòng',
                    });
                    navigate('/')   
                }}
                footer={null}
            >
                <Form form={form} onFinish={handleRejectBooking} layout="vertical">
                    <Form.Item
                        name="reason"
                        label="Lý do từ chối"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
                    >
                        <TextArea rows={5} placeholder="Nhập lý do từ chối đơn đặt phòng" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loadingModal} style={{ marginRight: 8 }}>
                            Xác nhận
                        </Button>
                        <Button onClick={() => setShowRejectModal(false)}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BookingAction;
