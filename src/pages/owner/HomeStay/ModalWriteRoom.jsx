import { Form, Modal, Input, Button, Checkbox, InputNumber, Upload, message, Select } from "antd";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import { uploadService } from "../../../services/uploadService";
import { URL_SERVER } from "../../../constant/global";
import roomService from "../../../services/roomService";

const ModalWriteRoom = ({ action, setAction, setRooms }) => {
    const [form] = Form.useForm();
    const { isOpen, isNewHomeStay, idHomeStay, roomOld } = action;
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [listIMG_OLD, setListIMG_OLD] = useState([])

    useEffect(() => {
        // Set images
        if (idHomeStay && roomOld) {
            let listIMG_OLD = roomOld.roomImage?.split(',').map((img, index) => ({
                uid: String(index),
                name: `image-${index}`,
                status: 'done',
                url: URL_SERVER + img,
                urlRoot: img,
                originFileObj: null
            })) || [];
            form.setFieldsValue(roomOld);
            setFileList(listIMG_OLD);
            setListIMG_OLD(listIMG_OLD);
        }
        if (!idHomeStay && roomOld) {
            setFileList([...roomOld.roomImage]);
            form.setFieldsValue(roomOld);
        }
        if (isNewHomeStay) {
            setFileList([]);
            setListIMG_OLD([]);
            form.resetFields();
        }



    }, [isOpen])

    const onClose = () => {
        setFileList([]);
        setListIMG_OLD([]);
        setLoading(false);
        form.resetFields();
        setAction(prev => ({ ...prev, isOpen: false }));
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleRemove = (file) => {
        setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
        idHomeStay && setListIMG_OLD((prevList) => prevList.filter((item) => item.uid !== file.uid));
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            let listIMG = fileList.length > 0 ? await uploadService.upload(fileList) : [];

            var roomPayload =
            {
                ...values,
                homestayId: idHomeStay,
                roomId: roomOld?.roomId || Math.floor(Math.random() * 10000),
                hasBalcony: values.hasBalcony || false,
                roomImage: [...listIMG, ...listIMG_OLD.length > 0 ? listIMG_OLD.map(l => l.urlRoot) : []].join(','),
                hasTv: values.hasTv || false,
                hasAirConditioner: values.hasAirConditioner || false,
                hasRefrigerator: values.hasRefrigerator || false,
                hasWifi: values.hasWifi || false,
                hasHotWater: values.hasHotWater || false,
            }
                ;

            if (!idHomeStay) {
                if (roomOld) {
                    roomPayload.roomImage = fileList;
                    setRooms(prev => prev.filter(room => room.roomId !== roomOld.roomId));
                    setRooms(prev => [...prev, roomPayload]);
                }
                else {

                    roomPayload.roomImage = fileList;
                    setRooms(prev => [...prev, roomPayload]);
                }
            } else {
                if (roomOld) {
                    console.log(roomPayload);
                    let res = await roomService.update(roomPayload);
                    res && message.success("Cập nhật phòng thành công");
                } else {
                    let res = await roomService.add(roomPayload);
                    res && message.success("Thêm phòng thành công");
                }
                onClose();
                await action.refeshDetail();
            }
            message.success(roomOld ? "Cập nhật phòng thành công" : "Thêm phòng thành công");
            onClose();
        } catch (error) {
            console.error("Error processing room:", error);
            message.error("Có lỗi xảy ra khi xử vừa thực hiện thao tác");
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Thông tin phòng"
            open={isOpen}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="back" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
                    Lưu
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="mt-4"
                initialValues={roomOld || {}}
            >
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label="Tên phòng"
                        name="roomName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên phòng!' }]}
                    >
                        <Input placeholder="Nhập tên phòng" />
                    </Form.Item>

                    <Form.Item
                        label="Loại phòng"
                        name="roomType"
                        rules={[{ required: true, message: 'Vui lòng nhập loại phòng!' }]}
                    >
                        <Input placeholder="Nhập loại phòng" />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái hoạt động"
                        name="status"
                        initialValue={roomOld?.status || 1}
                    >
                        <Select>
                            <Select.Option value={1}>Hoạt động</Select.Option>
                            <Select.Option value={0}>Không hoạt động</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Kích thước phòng (m²)"
                        name="roomSize"
                        rules={[{ required: true, message: 'Vui lòng nhập kích thước phòng!' }]}
                    >
                        <InputNumber className="w-full" min={0} placeholder="Nhập kích thước phòng" />
                    </Form.Item>

                    <Form.Item
                        label="Số người lớn tối đa"
                        name="maxAdults"
                        rules={[{ required: true, message: 'Vui lòng nhập số người lớn tối đa!' }]}
                    >
                        <InputNumber className="w-full" min={0} placeholder="Nhập số người lớn tối đa" />
                    </Form.Item>

                    <Form.Item
                        label="Số trẻ em tối đa"
                        name="maxChildren"
                    >
                        <InputNumber className="w-full" min={0} placeholder="Nhập số trẻ em tối đa" />
                    </Form.Item>

                    <Form.Item
                        label="Số em bé tối đa"
                        name="maxBaby"
                    >
                        <InputNumber className="w-full" min={0} placeholder="Nhập số em bé tối đa" />
                    </Form.Item>

                    <Form.Item
                        label="Số phòng tắm"
                        name="bathroomCount"
                    >
                        <InputNumber className="w-full" min={0} placeholder="Nhập số phòng tắm" />
                    </Form.Item>

                    <Form.Item
                        label="Số giường"
                        name="bedCount"
                        rules={[{ required: true, message: 'Vui lòng nhập số giường!' }]}
                    >
                        <InputNumber className="w-full" min={0} placeholder="Nhập số giường" />
                    </Form.Item>

                    <Form.Item
                        label="Giá/đêm"
                        name="pricePerNight"
                        rules={[{ required: true, message: 'Vui lòng nhập giá/đêm!' }]}
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            placeholder="Nhập giá/đêm"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Giá/đêm từ ngày thứ 2"
                        name="priceFromSecondNight"
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            placeholder="Nhập giá/đêm từ ngày thứ 2"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phí phụ thu thêm trẻ em"
                        name="extraFeePerChild"
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            placeholder="Nhập phí thêm trẻ em"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phí phụ thu thêm người lớn"
                        name="extraFeePerAdult"
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            placeholder="Nhập phí thêm người lớn"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phí phụ thu thêm em bé"
                        name="extraFeePerBaby"
                    >
                        <InputNumber
                            className="w-full"
                            min={0}
                            placeholder="Nhập phí thêm em bé"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Mô tả phòng"
                    name="description"
                    className="mt-2"
                >
                    <TextArea rows={3} placeholder="Nhập mô tả phòng" />
                </Form.Item>

                <Form.Item label="Ảnh phòng">
                    <Upload
                        accept=".jpg,.png,.webp,.jpeg"
                        listType="picture-card"
                        maxCount={20}
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

                </Form.Item>

                <div className="mt-4">
                    <h4 className="mb-2 font-medium">Tiện nghi phòng:</h4>
                    <div className="grid grid-cols-2 gap-y-3 sm:grid-cols-3">
                        <Form.Item name="hasBalcony" valuePropName="checked" noStyle>
                            <Checkbox>Có ban công</Checkbox>
                        </Form.Item>
                        <Form.Item name="hasTv" valuePropName="checked" noStyle>
                            <Checkbox>Có TV</Checkbox>
                        </Form.Item>
                        <Form.Item name="hasAirConditioner" valuePropName="checked" noStyle>
                            <Checkbox>Có điều hòa</Checkbox>
                        </Form.Item>
                        <Form.Item name="hasRefrigerator" valuePropName="checked" noStyle>
                            <Checkbox>Có tủ lạnh</Checkbox>
                        </Form.Item>
                        <Form.Item name="hasWifi" valuePropName="checked" noStyle>
                            <Checkbox>Có Wifi</Checkbox>
                        </Form.Item>
                        <Form.Item name="hasHotWater" valuePropName="checked" noStyle>
                            <Checkbox>Có nước nóng</Checkbox>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalWriteRoom;