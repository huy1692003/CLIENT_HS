import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Select, Checkbox, Image, Alert, notification } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation, useSearchParams } from 'react-router-dom';
import amenitiesService from '../../../services/amenitiesService';
import { uploadService } from '../../../services/uploadService';
import homestayService from '../../../services/homestayService';
import { useRecoilState } from 'recoil';
import { userState } from '../../../recoil/atom';
import createFromData from '../../../utils/createFormData';
import TextArea from 'antd/es/input/TextArea';
import { URL_SERVER } from '../../../constant/global';

const WriteHomeStay = () => {
    const [paramURL] = useSearchParams();
    const idHomeStay = paramURL.get('idHomeStay') || null;
    const [form] = Form.useForm();
    const [amenitiesList, setAmenitiesList] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [owner, setOwner] = useRecoilState(userState)
    const [loading, setLoading] = useState(false)


    // lấy về chi tiết homeStay
    const [listIMG_OLD, setListIMG_OLD] = useState([])

    useEffect(() => {
        fetchAmenities();
    }, []);

    const fetchAmenities = async () => {
        try {
            const amenities = await amenitiesService.getAll();
            setAmenitiesList(amenities);
        } catch (error) {
            message.error('Lỗi khi lấy danh sách tiện nghi!');
        }
    };

    // Call Api lấy về chi tiết HomeStay khi sửa
    const fillDataOnEdit = async () => {
        try {
            const data = await homestayService.getDetail(idHomeStay);
            if (data) {
                form.setFieldsValue({ ...data.homeStay, ...data.detailHomeStay })
                setSelectedAmenities(data.homeStayAmenities.map(a => a.amenityID))
                let listIMG_OLD = data.homeStay.imagePreview.map((img, index) => ({
                    uid: String(index),
                    name: `image-${index}`,
                    status: 'done',
                    url: URL_SERVER + img,
                    urlRoot: img,
                    originFileObj: null
                }))
                setFileList(listIMG_OLD);
                // Gán danh sách ảnh cũ
                setListIMG_OLD(listIMG_OLD)

            }
        } catch (error) {
            message.error('Có lỗi khi lấy dữ liệu chi tiết về HomeStay , hãy thử lại sau ít phút!');
        }
    };


    useEffect(() => {
        if (idHomeStay) {
            fillDataOnEdit(); // Khi có id, gọi hàm để lấy dữ liệu chi tiết
        } else {
            // Nếu không có id, reset form và các state
            form.resetFields();
            setSelectedAmenities([]);
            setFileList([]);
            setListIMG_OLD([]);
        }

    }, [idHomeStay])

    const onFinish = async (data) => {
        setLoading(true)
        try {
            let listFileOrigin = fileList.filter(f => f.originFileObj !== null) // Danh sách file mới tải lên
            // Upload ảnh mới
            let resUpload = (listFileOrigin.length > 0) ? await uploadService.postMany(createFromData.many(listFileOrigin)) : []
            // Lấy về danh sách ảnh mới
            let listIMG = resUpload.filePaths || []


            const homestayPayload = {
                homeStay: {
                    homestayID: idHomeStay ? idHomeStay : 0, // Use id if editing
                    ...data,
                    ownerID: owner.idOwner,
                    imagePreview: [...listIMG_OLD.map(l => l.urlRoot), ...listIMG],
                },
                listAmenities: selectedAmenities,
                detailHomeStay: {
                    note: data.note,
                    numberOfBedrooms: data.numberOfBedrooms,
                    numberOfLivingRooms: data.numberOfLivingRooms,
                    numberOfBathrooms: data.numberOfBathrooms,
                    numberOfKitchens: data.numberOfKitchens,
                },
            };
            console.log(homestayPayload)
            let res = idHomeStay
                ? await homestayService.update(homestayPayload) // Update if editing
                : await homestayService.add(homestayPayload);

            res && notification.success({
                message: idHomeStay ? "Cập nhật thành công" : "Thêm thành công",
                description: idHomeStay
                    ? "Bạn đã cập nhật thông tin homestay thành công."
                    : "Bạn đã thêm mới homestay thành công.",
            });
            idHomeStay && fillDataOnEdit()

        } catch (error) {
            console.log(error)
            message.error("Có lỗi rồi bạn hãy thử lại sau nhé !")
        } finally {
            setLoading(false)
        }

    };

    const handleAmenitiesChange = (checkedValues) => {
        setSelectedAmenities(checkedValues);
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleRemove = (file) => {
        setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
        idHomeStay && setListIMG_OLD((prevList) => prevList.filter((item) => item.uid !== file.uid))
    };

    return (
        <div className="w-full h-full mx-auto">
            <h2 className="text-2xl font-bold mb-5">{idHomeStay ? `Cập nhật Homestay | Mã:${idHomeStay} ` : "Thêm Homestay"}</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}

            >
                {/* Thông tin cơ bản của homestay */}
                <div className="grid grid-cols-1 gap-5">
                    <Form.Item
                        name="homestayName"
                        label="Tên Homestay"
                        rules={[{ required: true, message: 'Vui lòng nhập tên homestay!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="country"
                        label="Quốc Gia"
                        rules={[{ required: true, message: 'Vui lòng nhập quốc gia!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="province"
                        label="Tỉnh / Thành Phố"
                        rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="district"
                        label="Quận / Huyện"
                        rules={[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="wardOrCommune"
                        label="Phường / Xã"
                        rules={[{ required: true, message: 'Vui lòng nhập Phường/Xã!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="addressDetail"
                        label="Địa Chỉ Chi Tiết"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="linkGoogleMap"
                        label="Link GoogleMap"
                        rules={[{ required: true, message: 'Vui lòng nhập link googleMap!' }]}
                    >
                        <Input />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Một số ảnh về HomeStay của bạn "
                >
                    <Upload
                        accept=".jpg,.png,.webp,.jpeg"
                        listType="picture-card"
                        maxCount={10}
                        multiple
                        fileList={fileList}
                        onChange={handleUploadChange}
                        onRemove={handleRemove}
                        beforeUpload={() => false}
                    >
                        <div className='block'>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải lên</div>
                        </div>
                    </Upload>

                    <div className="flex gap-2 flex-wrap mb-4 mt-3">
                        {fileList.map((file) => (
                            <Image
                                key={file.uid}
                                src={file.url || URL.createObjectURL(file.originFileObj)} // Kiểm tra nếu file có URL, nếu không thì dùng createObjectURL cho file cục bộ
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
                    <Form.Item
                        name="pricePerNight"
                        label="Giá/Đêm"
                        rules={[{ required: true, message: 'Vui lòng nhập giá/đêm!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        name="discountSecondNight"
                        label="Giảm Giá Đêm Thứ Hai"
                        rules={[{ required: true, message: 'Vui lòng nhập giảm giá cho đêm thứ hai!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        name="minPerson"
                        label="Số Người Tối Thiểu"
                        rules={[{ required: true, message: 'Vui lòng nhập số người tối thiểu!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        name="maxPerson"
                        label="Số Người Tối Đa"
                        rules={[{ required: true, message: 'Vui lòng nhập số người tối đa!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </div>

                {/* Thông tin chi tiết homestay */}

                <div className="grid grid-cols-2 gap-5">
                    <Form.Item
                        name="numberOfBedrooms"
                        label="Số Phòng Ngủ"
                        rules={[{ required: true, message: 'Vui lòng nhập số phòng ngủ!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        name="numberOfLivingRooms"
                        label="Số Phòng Khách"
                        rules={[{ required: true, message: 'Vui lòng nhập số phòng khách!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        name="numberOfBathrooms"
                        label="Số Phòng Tắm"
                        rules={[{ required: true, message: 'Vui lòng nhập số phòng tắm!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        name="numberOfKitchens"
                        label="Số Phòng Bếp"
                        rules={[{ required: true, message: 'Vui lòng nhập số phòng bếp!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </div>

                {/* Chọn tiện nghi */}
                <Form.Item
                    label="Chọn Tiện Nghi"
                >
                    <Select
                        mode="multiple" // Kích hoạt chế độ chọn nhiều
                        allowClear
                        value={selectedAmenities}
                        onFocus={() => fetchAmenities()}
                        placeholder="Chọn tiện nghi"
                        onChange={handleAmenitiesChange} // Hàm xử lý khi chọn tiện nghi
                        options={amenitiesList.map(amenity => ({
                            label: amenity.name, // Tên tiện nghi sẽ hiển thị
                            value: amenity.amenityID // Giá trị là ID tiện nghi
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    label={<b>Ghi chú hoặc mô tả thêm về HomeStay</b>}
                    name="note"
                >
                    <TextArea rows={10} />
                </Form.Item>
                <Form.Item className='block text-right pr-4'>
                    <Button loading={loading} type="primary" htmlType="submit" size="large">
                        {idHomeStay ? "Cập nhật Homestay" : "Thêm Homestay"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
export default memo(WriteHomeStay)
