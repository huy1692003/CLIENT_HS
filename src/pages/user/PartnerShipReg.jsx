import React, { memo, useState } from 'react';
import { Form, Input, Button, Row, Col, Upload, message, Image, notification, Breadcrumb } from 'antd';
import Icon, { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import image from '~/assets/Image/partnership.png';
import { uploadService } from '../../services/uploadService';
import createFromData from '../../utils/createFormData';
import partnerShipService from './../../services/partnerShipService';
import { useRecoilValue } from 'recoil';
import { userState } from './../../recoil/atom';
import { Link } from 'react-router-dom';

 const PartnerShipReg = () => {
    const [fileList, setFileList] = useState([]);

    const user = useRecoilValue(userState)
    const onFinish = async (data) => {
        if (fileList.length > 3) {
            if (user) {

                try {
                    let listIMG = await uploadService.postMany(createFromData.many(fileList))
                    console.log(listIMG)
                    let checkRegister = await partnerShipService.registerParner({ ...data, imgPreview: listIMG.filePaths || [], customerID: user.idCus })
                    notification.success({
                        message: 'Đăng Kí Thành công!',
                        description: checkRegister,
                        placement: 'topRight',
                        duration: 2,
                    });

                }
                catch (error) {
                    console.log("error", error)
                    message.error(error.response.data)

                }
            }
            else {
                message.error("Hãy đăng nhập để thực hiện đăng ký hợp tác !")
            }
        }
        else {
            message.error("Bạn phải chọn ít nhất 3 ảnh giới thiệu về HomeStay của bạn !")
        }
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleRemove = (file) => {
        setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
    };

    return (
        <div className="p-8 ">
             <div className="px-4 py-2 bg-gray-100">
                <Breadcrumb
                    items={[
                        {
                            title: <Link to="/">Trang chủ</Link>,
                        },
                        {
                            title: 'Đăng Ký Hợp Tác',
                        },
                    ]}
                />
            </div>
            <h2 className="text-2xl font-bold mb-4 pt-4 ">Đăng Ký Hợp Tác Chủ Home Stay</h2>
            <p className="mb-4 italic">
                Chào mừng bạn đến với hệ thống đăng ký hợp tác Home Stay của chúng tôi! Bằng cách hợp tác, bạn sẽ có cơ hội tiếp cận thị trường rộng lớn hơn và tối ưu hóa lợi nhuận kinh doanh. Chúng tôi luôn cam kết đồng hành và hỗ trợ bạn trong suốt quá trình hợp tác, với các công cụ quản lý hiện đại và dịch vụ chuyên nghiệp. Hãy điền đầy đủ thông tin dưới đây để hoàn tất quá trình đăng ký. Chúng tôi rất mong chờ được hợp tác với bạn!
            </p>


            <div className="text-center mb-6">
                <Image preview={false} style={{ width: "100%" }} src={image} />
            </div>
            <Form
                style={{ maxWidth: "1000px", margin: "0 auto" }}
                layout="vertical"
                onFinish={onFinish}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-500 w-full"
            >
                <h2 className="text-2xl text-center font-bold mb-4 pt-3 pb-6 border-b-2 border-gray-300">Phiếu đăng kí</h2>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item style={{ fontSize: 19 }} label="Tên Công Ty hoặc Doanh nghiêp" name="companyName" required
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên công ty!' },
                                { min: 3, message: 'Tên công ty phải có ít nhất 3 ký tự.' }
                            ]}
                        >
                            <Input placeholder="Nhập tên công ty" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item style={{ fontSize: 19 }} label="Họ và tên người đại diện" name="fullName" required
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ tên!' },
                                { min: 3, message: 'Họ tên phải có ít nhất 3 ký tự.' }
                            ]}>
                            <Input placeholder="Nhập họ tên" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item style={{ fontSize: 19 }} label="Địa Chỉ " name="address" required
                            rules={[
                                { required: true, message: 'Vui lòng nhập địa chỉ!' },
                                { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự.' }
                            ]}>
                            <Input placeholder="Nhập địa chỉ" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                        ]} style={{ fontSize: 19 }} label="Số Điện Thoại" name="phoneNumber" required>
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]} style={{ fontSize: 19 }} label="Email" name="email" required>
                            <Input type="email" placeholder="Nhập email" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item rules={[
                            { required: true, message: 'Vui lòng nhập số lượng HomeStay!' },
                        ]} style={{ fontSize: 19 }} label="Bạn có khoảng bao nhiêu HomeStay?" name="totalHomeStay" required>
                            <Input type="number" placeholder="Nhập tổng số Home Stay" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item style={{ fontSize: 19 }} label="Một số ảnh về HomeStay của bạn (Tối đa 6 ảnh)" required

                        >
                            <Upload
                                accept=".jpg,.png,.webp,.jpeg"
                                listType="picture-card"
                                maxCount={6}
                                multiple
                                fileList={fileList}
                                onChange={handleUploadChange}
                                onRemove={handleRemove} // Add remove handler
                                beforeUpload={() => false} // Prevent auto-upload
                            >
                                {fileList.length >= 10 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải lên</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>
                    {/* Display preview images */}
                    <div className="flex gap-2 flex-wrap mb-4">
                        {fileList.map((file) => (
                            <Image
                                key={file.uid}
                                src={URL.createObjectURL(file.originFileObj)}
                                alt="preview"
                                style={{
                                    width: '310px',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    maxHeight: '200px',
                                }}
                            />
                        ))}
                    </div>
                </Row>

                <Form.Item style={{ fontSize: 19 }} label="Ghi Chú" name="note">
                    <Input.TextArea rows={10} placeholder="Mô tả thêm (nếu có)" />
                </Form.Item>

                <Form.Item style={{ fontSize: 19 }}>
                    <Button style={{ height: 50 }} size="large" type="primary" htmlType="submit" className="w-full text-xl font-bold">
                        <i className="fa-solid fa-paper-plane mr-2"></i>Gửi Phiếu Đăng Ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
export default memo(PartnerShipReg)
