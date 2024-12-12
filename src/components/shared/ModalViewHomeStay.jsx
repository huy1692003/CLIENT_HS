import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Upload, Image, Select, message, Button, InputNumber } from 'antd';
import amenitiesService from '../../services/amenitiesService';
import homestayService from '../../services/homestayService';
import { URL_SERVER } from '../../constant/global';
import { propFormatterNumber } from '../../utils/propState';

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
            closable={false}
            onCancel={() => setVisible({ show: false, idHomeStay: null })}
            title={
                <div className="flex justify-between items-center rounded-lg border-b bg-blue-600">
                    <h3 className='text-2xl text-white p-3' style={{width: '95%'}}>
                        {`Thông tin chi tiết Homestay | Mã Homestay: ${idHomeStay}`}
                    </h3>
                    <Button 
                        type="default"
                        className="mr-3 hover:bg-red-500 hover:text-white text-xl h-full transition-colors"
                        icon={<i className="fa-solid fa-xmark mr-1"></i>}
                        onClick={() => setVisible({ show: false, idHomeStay: null })}
                    >
                        Đóng
                    </Button>
                </div>
            }
            footer={null}
            width={1300}
        >
            <Form form={form} layout="vertical">
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item name="homestayName" label={<strong className="text-black">Tên Homestay</strong>}>
                        <Input readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="country" label={<strong className="text-black">Quốc Gia</strong>}>
                        <Input readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="province" label={<strong className="text-black">Tỉnh / Thành Phố</strong>}>
                        <Input readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="district" label={<strong className="text-black">Quận / Huyện</strong>}>
                        <Input readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="wardOrCommune" label={<strong className="text-black">Phường / Xã</strong>}>
                        <Input readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="addressDetail" label={<strong className="text-black">Địa Chỉ Chi Tiết</strong>}>
                        <Input readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="linkGoogleMap" label={<strong className="text-black">Link GoogleMap</strong>}>
                        <Input readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="pricePerNight" label={<strong className="text-black">Giá/Đêm</strong>}>
                        <InputNumber  readOnly {...propFormatterNumber} addonAfter="VNĐ" className="text-black disabled:text-black w-full" />
                    </Form.Item>

                    <Form.Item name="discountSecondNight" label={<strong className="text-black">Giảm Giá Đêm Thứ Hai</strong>}>
                        <InputNumber type='number' readOnly {...propFormatterNumber} addonAfter="VNĐ" className="text-black disabled:text-black w-full" />
                    </Form.Item>

                    <Form.Item name="minPerson" label={<strong className="text-black">Số Người Tối Thiểu</strong>}>
                        <Input type="number" readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="maxPerson" label={<strong className="text-black">Số Người Tối Đa</strong>}>
                        <Input type="number" readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="numberOfBedrooms" label={<strong className="text-black">Số Phòng Ngủ</strong>}>
                        <Input type="number" readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="numberOfLivingRooms" label={<strong className="text-black">Số Phòng Khách</strong>}>
                        <Input type="number" readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="numberOfBathrooms" label={<strong className="text-black">Số Phòng Tắm</strong>}>
                        <Input type="number" readOnly className="text-black disabled:text-black" />
                    </Form.Item>

                    <Form.Item name="numberOfKitchens" label={<strong className="text-black">Số Phòng Bếp</strong>}>
                        <Input type="number" readOnly className="text-black disabled:text-black" />
                    </Form.Item>
                </div>

                <Form.Item label={<strong className="text-black">Tiện Nghi</strong>}>
                    <Select
                        mode="multiple"
                        disabled
                        value={selectedAmenities}
                        placeholder="Chọn tiện nghi"
                        options={amenitiesList.map(amenity => ({
                            label: amenity.name,
                            value: amenity.amenityID
                        }))}
                    />
                </Form.Item>

                <Form.Item label={<strong className="text-black">Ghi chú hoặc mô tả thêm về HomeStay</strong>} name="note">
                    <Input.TextArea readOnly rows={10} className="text-black disabled:text-black" />
                </Form.Item>
                
                <Form.Item label={<strong className="text-black">Ảnh Homestay</strong>}>
                    <div className="grid grid-cols-4 gap-4">
                        {fileList.map((file) => (
                            <Image
                                height={200}
                                key={file.uid}
                                src={file.url}
                                alt="preview"
                                className="object-cover rounded-lg"
                            />
                        ))}
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};
