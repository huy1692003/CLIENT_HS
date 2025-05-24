import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Image, notification, Alert } from 'antd';
import { PlusOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { uploadService } from '../../../services/uploadService';
import advertisementService from '../../../services/advertisementService';
import { useRecoilState } from 'recoil';
import { userState } from '../../../recoil/atom';
import createFromData from '../../../utils/createFormData';
import TextArea from 'antd/es/input/TextArea';
import { URL_SERVER } from '../../../constant/global';
import moment from 'moment';

const CreateAdvertisement = () => {
    const [paramURL] = useSearchParams();
    const adId = paramURL.get('adId') || null;
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [owner] = useRecoilState(userState);
    const [loading, setLoading] = useState(false);
    const [listIMG_OLD, setListIMG_OLD] = useState([]);
    const [selectedPlacement, setSelectedPlacement] = useState(1);
    const [totalCost, setTotalCost] = useState(0);
    const [totalDays, setTotalDays] = useState(0);

    // Call Api lấy về chi tiết Advertisement khi sửa
    const fillDataOnEdit = async () => {
        try {
            const data = await advertisementService.getAdvertisementById(adId);
            console.log(data);
            if (data) {
                form.setFieldsValue({ ...data, endDate: data.endDate.slice(0, 10), startDate: data.startDate.slice(0, 10) });
                setSelectedPlacement(data.placement);
                let listIMG_OLD = [{
                    uid: '1',
                    name: 'advertisement-image',
                    status: 'done',
                    url: URL_SERVER + data.adPicture,
                    urlRoot: data.adPicture,
                    originFileObj: null
                }];
                setFileList(listIMG_OLD);
                setListIMG_OLD(listIMG_OLD);

                // Calculate cost when editing
                if (data.startDate && data.endDate) {
                    calculateCost(data.startDate, data.endDate, data.placement);
                }
            }
        } catch (error) {
            console.log("lỗi", error);

        }
    };

    useEffect(() => {
        if (adId) {
            fillDataOnEdit();
        } else {
            form.resetFields();
            setFileList([]);
            setListIMG_OLD([]);
            setTotalCost(0);
        }
    }, [adId]);

    const calculateCost = (startDate, endDate, placement) => {
        if (!startDate || !endDate || !placement) return;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Giá theo vị trí
        const pricePerDay = {
            1: 100000, // Banner
            2: 75000, // Sidebar
            3: 50000  // Homestay nổi bật
        };

        setTotalDays(diffDays);
        const cost = diffDays * pricePerDay[placement];
        setTotalCost(cost);
    };

    const onFinish = async (data) => {
        setLoading(true);
        try {
            let listFileOrigin = fileList.filter(f => f.originFileObj !== null);
            let resUpload = (listFileOrigin.length > 0) ? await uploadService.postMany(createFromData.many(listFileOrigin)) : [];
            let listIMG = resUpload.filePaths || [];


            const advertisementPayload = {
                adID: adId ? adId : 0,
                ownerID: owner.idOwner,
                adTitle: data.adTitle,
                adDescription: data.adDescription,
                adPicture: listIMG.length > 0 ? listIMG[0] : (listIMG_OLD[0]?.urlRoot || ''),
                urlClick: data.urlClick,
                startDate: moment(data.startDate).toISOString(), // Hoặc .format("YYYY-MM-DDTHH:mm:ss")
                endDate: moment(data.endDate).toISOString(),
                placement: selectedPlacement,
                statusAd: 0, // Chờ duyệt
                totalClick: 0,
                cost: totalCost,
                createdDate: new Date(),
                updatedDate: new Date()
            };
            console.log(advertisementPayload);
            let res = adId
                ? await advertisementService.updateAdvertisement(adId, advertisementPayload)
                : await advertisementService.createAdvertisement(advertisementPayload);


            res && notification.success({
                message: adId ? "Cập nhật thành công" : "Thêm thành công",
                description: adId
                    ? "Bạn đã cập nhật thông tin quảng cáo thành công."
                    : "Bạn đã thêm mới quảng cáo thành công.",
            });
            adId && fillDataOnEdit();

        } catch (error) {

            console.log(error);
            message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleRemove = (file) => {
        setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
        adId && setListIMG_OLD((prevList) => prevList.filter((item) => item.uid !== file.uid));
    };

    const handlePlacementSelect = (placement) => {
        setSelectedPlacement(placement);
        form.setFieldsValue({ placement });

        // Recalculate cost when placement changes
        const startDate = form.getFieldValue('startDate');
        const endDate = form.getFieldValue('endDate');
        calculateCost(startDate, endDate, placement);
    };

    // Handle date changes
    const handleDateChange = (e, field) => {
        const value = e.target.value;
        form.setFieldsValue({ [field]: value });

        const startDate = field === 'startDate' ? value : form.getFieldValue('startDate');
        const endDate = field === 'endDate' ? value : form.getFieldValue('endDate');

        calculateCost(startDate, endDate, selectedPlacement);
    };

    return (
        <div className="w-full h-full mx-auto">
            <h2 className="text-2xl font-bold mb-5">
                {adId ? `Cập nhật Quảng cáo | Mã:${adId}` : "Tạo Quảng cáo mới"}
            </h2>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="adTitle"
                    label="Tiêu đề quảng cáo"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề quảng cáo!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="adDescription"
                    label="Mô tả quảng cáo"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả quảng cáo!' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="urlClick"
                    label="Đường dẫn đến nơi quảng cáo"
                    rules={[{ required: true, message: 'Vui lòng nhập URL đích!' }]}
                >
                    <Input />
                </Form.Item>

                <div className="flex gap-2">
                    <Form.Item
                        name="placement"
                        initialValue={selectedPlacement}
                        label="Vị trí hiển thị"
                        rules={[{ required: true, message: 'Vui lòng chọn vị trí hiển thị!' }]}
                        className="flex-1"
                    >
                        <div className="flex flex-col gap-4">
                            {/* Header */}
                            <div style={{ backgroundColor: '#1890ff' }} className="h-16 flex text-white items-center rounded-md justify-center text-center opacity-50 ">
                                Phần Header (Thanh Menu)
                            </div>

                            {/* Banner */}
                            <div
                                className={`h-16 flex items-center justify-center text-center border rounded-md cursor-pointer relative ${selectedPlacement === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
                                onClick={() => handlePlacementSelect(1)}

                            >
                                1.Phần Banner (100.000đ/ngày)
                                {selectedPlacement === 1 && (
                                    <CheckCircleFilled className="absolute right-2 text-blue-500 text-xl" />
                                )}
                            </div>

                            {/* Main content area */}
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className={`h-16 flex items-center justify-center text-center border rounded-md cursor-pointer relative ${selectedPlacement === 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
                                    onClick={() => handlePlacementSelect(2)}

                                >
                                    2.Phần Sidebar (75.000đ/ngày)
                                    {selectedPlacement === 2 && (
                                        <CheckCircleFilled className="absolute right-2 text-blue-500 text-xl" />
                                    )}
                                </div>
                                <div className="h-16 flex items-center justify-center text-center border rounded-md" style={{ backgroundColor: '#faad14' }}>
                                    Main Content (Nội dung chính)
                                </div>
                            </div>

                            {/* Article section */}
                            <div className="h-16 flex items-center justify-center text-center border rounded-md">
                                Tin tức
                            </div>

                            <div
                                className={`h-16 flex items-center justify-center text-center border rounded-md cursor-pointer relative ${selectedPlacement === 3 ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
                                onClick={() => handlePlacementSelect(3)}

                            >
                                3.Phần Homestay nổi bật (50.000đ/ngày)
                                {selectedPlacement === 3 && (
                                    <CheckCircleFilled className="absolute right-2 text-blue-500 text-xl" />
                                )}
                            </div>

                            {/* Footer */}
                            <div style={{ backgroundColor: '#52c41a', color: 'white' }} className="h-16 flex items-center justify-center text-center border rounded-md opacity-50 cursor-not-allowed">
                                Footer (Chân trang)
                            </div>
                        </div>
                    </Form.Item>

                    <Alert
                        message="Chú thích vị trí hiển thị"
                        description={
                            <ul className="list-disc pl-1 space-y-2">
                                <li>Chỉ có thể chọn các vị trí được đánh số (1,2,3)</li>
                                <li>1. Banner: Vị trí nổi bật nhất trang chủ</li>
                                <li>2. Sidebar: Hiển thị bên cạnh nội dung chính</li>
                                <li>3. Homestay nổi bật: Hiển thị trong phần homestay được đề xuất</li>
                                <li>Các vị trí khác hiện không khả dụng</li>
                            </ul>
                        }
                        type="warning"
                        showIcon
                        className="w-1/3"
                    />
                </div>

                <Form.Item
                    name="startDate"
                    label="Ngày bắt đầu"
                    rules={[
                        { required: true, message: 'Vui lòng chọn ngày bắt đầu!' },
                        () => ({
                            validator(_, value) {
                                if (!value || new Date(value) > new Date()) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Ngày bắt đầu phải lớn hơn ngày hiện tại và quá khứ!'));
                            },
                        }),
                    ]}
                >
                    <Input type="date" onChange={(e) => handleDateChange(e, 'startDate')} />
                </Form.Item>

                <Form.Item
                    name="endDate"
                    label="Ngày kết thúc"
                    rules={[
                        { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const startDate = getFieldValue('startDate');
                                if (!value || !startDate || new Date(value) > new Date(startDate)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu!'));
                            },
                        }),
                    ]}
                >
                    <Input type="date" onChange={(e) => handleDateChange(e, 'endDate')} />
                </Form.Item>

                {totalCost > 0 && (
                    <Alert
                        message="Chi phí quảng cáo"
                        description={`Tổng chi phí: ${totalCost.toLocaleString('vi-VN')} VNĐ cho ${totalDays} ngày`}
                        type="info"
                        showIcon
                        className="mb-4"
                    />
                )}

                <Form.Item
                    label="Hình ảnh quảng cáo"
                >
                    <Alert
                        message="Lưu ý về kích thước hình ảnh"
                        description="Để hiển thị tốt nhất, vui lòng tải lên hình ảnh có kích thước banner: 1200x300 pixels hoặc tỷ lệ 4:1"
                        type="info"
                        showIcon
                        className="mb-4"
                    />
                    <Upload
                        accept=".jpg,.png,.webp,.jpeg"
                        listType="picture-card"
                        maxCount={1}
                        fileList={fileList}
                        onChange={handleUploadChange}
                        onRemove={handleRemove}
                        beforeUpload={() => false}
                    >
                        {fileList.length < 1 && (
                            <div className='block'>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải lên</div>
                            </div>
                        )}
                    </Upload>

                    {fileList.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-4 mt-3">
                            <div className="w-full mb-2">
                                <Alert
                                    message="Xem trước hình ảnh quảng cáo"
                                    type="success"
                                    showIcon
                                />
                            </div>
                            {fileList.map((file) => (
                                <Image
                                    key={file.uid}
                                    src={file.url || URL.createObjectURL(file.originFileObj)}
                                    alt="preview"
                                    style={{
                                        borderRadius: '8px',
                                        width: '1200px',
                                        height: '300px',
                                        objectFit: 'cover',
                                        maxWidth: '100%'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </Form.Item>

                <Form.Item className='block text-right pr-4'>
                    <Button loading={loading} type="primary" htmlType="submit" size="large">
                        {adId ? "Cập nhật Quảng cáo" : "Tạo Quảng cáo"}
                    </Button>
                </Form.Item>
            </Form>

        </div>
    );
};

export default memo(CreateAdvertisement);