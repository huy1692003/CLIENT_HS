import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Upload, Image, Select, message } from 'antd';
import amenitiesService from '../../services/amenitiesService';
import homestayService from '../../services/homestayService';
import { URL_SERVER } from '../../constant/global';

export const ViewHomeStayModal = ({ visible, idHomeStay, setVisible }) => {
    const [form] = Form.useForm();
    const [amenitiesList, setAmenitiesList] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const amenities = await amenitiesService.getAll();
                setAmenitiesList(amenities);
            } catch (error) {
                message.error('Lỗi khi lấy danh sách tiện nghi!');
            }
        };
        fetchAmenities();
    }, []);

    const fillDataOnView = async () => {
        try {
            const data = await homestayService.getDetail(idHomeStay);
            if (data) {
                form.setFieldsValue({ ...data.homeStay, ...data.detailHomeStay });
                setSelectedAmenities(data.homeStayAmenities.map(a => a.amenityID));

                const listIMG_OLD = data.homeStay.imagePreview.map((img, index) => ({
                    uid: String(index),
                    name: `image-${index}`,
                    status: 'done',
                    url: URL_SERVER + img,
                }));
                setFileList(listIMG_OLD);
            }
        } catch (error) {
            message.error('Có lỗi khi lấy dữ liệu chi tiết về HomeStay, hãy thử lại sau ít phút!');
        }
    };

    useEffect(() => {
        if (idHomeStay && visible) {
            fillDataOnView();
        } else {
            form.resetFields();
            setSelectedAmenities([]);
            setFileList([]);
        }
    }, [idHomeStay, visible]);

    return (
        <Modal
            visible={visible}
            onCancel={() => setVisible({ show: false, idHomeStay: null })}
            title={<h3 className='text-2xl'>{`Chi tiết Homestay | Mã: ${idHomeStay}`}</h3>}
            footer={null}
            width={1300}
        >
            <Form form={form} layout="vertical">
                <div className="grid grid-cols-1 gap-5">
                    <Form.Item name="homestayName" label={<strong className="text-black">Tên Homestay</strong>}>
                        <Input disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="country" label={<strong className="text-black">Quốc Gia</strong>}>
                        <Input disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="province" label={<strong className="text-black">Tỉnh / Thành Phố</strong>}>
                        <Input disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="district" label={<strong className="text-black">Quận / Huyện</strong>}>
                        <Input disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="wardOrCommune" label={<strong className="text-black">Phường / Xã</strong>}>
                        <Input disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="addressDetail" label={<strong className="text-black">Địa Chỉ Chi Tiết</strong>}>
                        <Input disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="linkGoogleMap" label={<strong className="text-black">Link GoogleMap</strong>}>
                        <Input disabled className="text-black disabled:text-black" />
                    </Form.Item>
                </div>

                <Form.Item label={<strong className="text-black">Ảnh Homestay</strong>}>
                    <div className="flex gap-2 flex-wrap mb-4 mt-3">
                        {fileList.map((file) => (
                            <Image
                                key={file.uid}
                                src={file.url}
                                alt="preview"
                                style={{
                                    width: '25vw',
                                    height: '33vh',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    maxHeight: '33vh',
                                }}
                            />
                        ))}
                    </div>
                </Form.Item>

                <div className="grid grid-cols-2 gap-5">
                    <Form.Item name="pricePerNight" label={<strong className="text-black">Giá/Đêm</strong>}>
                        <Input type="number" disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="discountSecondNight" label={<strong className="text-black">Giảm Giá Đêm Thứ Hai</strong>}>
                        <Input type="number" disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="minPerson" label={<strong className="text-black">Số Người Tối Thiểu</strong>}>
                        <Input type="number" disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="maxPerson" label={<strong className="text-black">Số Người Tối Đa</strong>}>
                        <Input type="number" disabled className="text-black disabled:text-black" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <Form.Item name="numberOfBedrooms" label={<strong className="text-black">Số Phòng Ngủ</strong>}>
                        <Input type="number" disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="numberOfLivingRooms" label={<strong className="text-black">Số Phòng Khách</strong>}>
                        <Input type="number" disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="numberOfBathrooms" label={<strong className="text-black">Số Phòng Tắm</strong>}>
                        <Input type="number" disabled className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="numberOfKitchens" label={<strong className="text-black">Số Phòng Bếp</strong>}>
                        <Input type="number" disabled className="text-black disabled:text-black" />
                    </Form.Item>
                </div>

                <Form.Item label={<strong className="text-black">Tiện Nghi</strong>}>
                    <Select

                        mode="multiple"
                        allowClear
                        value={selectedAmenities}
                        placeholder="Chọn tiện nghi"
                        options={amenitiesList.map(amenity => ({
                            label: amenity.name,
                            value: amenity.amenityID
                        }))}

                    />
                </Form.Item>
                <Form.Item label={<strong className="text-black">Ghi chú hoặc mô tả thêm về HomeStay</strong>} name="note">
                    <Input.TextArea  disabled className="text-black disabled:text-black" />
                </Form.Item>
            </Form>
        </Modal>
    );
};
