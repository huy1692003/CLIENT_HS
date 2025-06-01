import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Rate, Button, message, notification } from 'antd';
import reviewRating from '../../services/reviewRatingService';
import reviewRatingService from '../../services/reviewRatingService';

const CreateReview = ({ show,onClose, cusID, IDHomeStay, refesh ,bookingID }) => {
    const [form] = Form.useForm();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading,setLoading]=useState(false)


    useEffect(() => {
        if (show) {

            setRating(0)
            setComment('')
            form.resetFields()
        }

    }, [show])
    // Xử lý submit
    const handleSubmit = async (data) => {
        if (data.rating === 0) {
            message.error("Bạn cần đánh giá ít nhất 1 sao!");
            return;
        }

        setLoading(false)
        const reviewData = {
            homestayID: IDHomeStay,
            customerID: cusID,
            rating: data.rating,
            comment: data.comment,
            reviewDate: new Date(),
            bookingID: bookingID,
        };
        try {
            await reviewRatingService.add(reviewData)
            notification.success({
                message: 'Tạo đánh giá thành công!',
            })

            // Cập nhật lại trạng thái hoặc dữ liệu nếu cần thiết


            refesh();
            onClose(false)
            setLoading(false)
        } catch (error) {
            notification.error({message:'Thất bại khi đánh giá HomeSTay'})
        }finally{
            setLoading(false)
        }

        // Gửi dữ liệu đến API của bạn để lưu vào cơ sở dữ liệu
        // Ví dụ sử dụng axios hoặc fetch

        // Đóng modal sau khi submit
    };

    // Xử lý thay đổi Rating
    const handleRatingChange = (value) => {
        setRating(value);
    };

    return (
        <Modal
            title={"Đánh giá về Homestay #" + IDHomeStay}
            visible={show}
            onCancel={() => onClose(false)}
            footer={null}
            centered
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={{
                    rating: rating,
                    comment: comment,
                }}
            >
                <Form.Item
                    label={<div className="flex items-center gap-2">Số sao bạn đánh giá : {rating}<i className="fa-solid fa-star text-yellow-500"></i></div>}
                    name="rating"
                    rules={[{ required: true, message: 'Vui lòng chọn mức độ đánh giá!' }]}
                >
                    <Rate
                        allowHalf
                        value={rating}
                        onChange={handleRatingChange}
                    />
                </Form.Item>

                <Form.Item
                    label="Cảm nhận của bạn sau khi trải nghiệm Homestay"
                    name="comment"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá!' }]}
                >
                    <Input.TextArea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        placeholder="Nhập nội dung tại đây"
                    />
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button loading={loading} type="primary" htmlType="submit">
                        Gửi đánh giá
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateReview;
