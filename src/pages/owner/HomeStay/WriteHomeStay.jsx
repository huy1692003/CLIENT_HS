import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Select, Checkbox, Image, Alert, notification, TimePicker, Switch, Card, Divider, Modal, Carousel } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useLocation, useSearchParams } from 'react-router-dom';
import amenitiesService from '../../../services/amenitiesService';
import { uploadService } from '../../../services/uploadService';
import homestayService from '../../../services/homestayService';
import { useRecoilState } from 'recoil';
import { userState } from '../../../recoil/atom';
import createFromData from '../../../utils/createFormData';
import TextArea from 'antd/es/input/TextArea';
import { URL_SERVER } from '../../../constant/global';
import data_province from '../../../assets/Data/data_province.json';
import { Option } from 'antd/es/mentions';
import dayjs from 'dayjs';
import ModalWriteRoom from './ModalWriteRoom';
import CardRoom from '../../../components/owner/CardRoom';
import roomService from '../../../services/roomService';
import CKEditorField from '../../../components/shared/CKEditor';

const WriteHomeStay = () => {
    const [paramURL] = useSearchParams();
    const idHomeStay = paramURL.get('idHomeStay') || null;
    const [form] = Form.useForm();
    const [amenitiesList, setAmenitiesList] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [owner, setOwner] = useRecoilState(userState)
    const [loading, setLoading] = useState(false)
    const [selectedProvince, setSelectedProvince] = useState()
    const [selectedDistrict, setSelectedDistrict] = useState()
    const [listIMG_OLD, setListIMG_OLD] = useState([])
    const [rooms, setRooms] = useState([]);
    const [actionModalWriteRoom, setActionModalWriteRoom] = useState({ isOpen: false, isNewHomeStay: true, roomOld: null })
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
            console.log(data)
            if (data) {
                // Set form values cho homeStay và detailHomeStay
                const formValues = {
                    ...data.homeStay,
                    ...data.detailHomeStay,
                    timeCheckIn: data.homeStay.timeCheckIn ? dayjs(data.homeStay.timeCheckIn, 'HH:mm') : null,
                    timeCheckOut: data.homeStay.timeCheckOut ? dayjs(data.homeStay.timeCheckOut, 'HH:mm') : null,
                };
                form.setFieldsValue(formValues);

                setSelectedAmenities(data.homeStayAmenities?.map(a => a.amenityID) || []);

                // Set images
                let listIMG_OLD = data.homeStay.imageHomestay?.split(',').map((img, index) => ({
                    uid: String(index),
                    name: `image-${index}`,
                    status: 'done',
                    url: URL_SERVER + img,
                    urlRoot: img,
                    originFileObj: null
                })) || [];
                setFileList(listIMG_OLD);
                setListIMG_OLD(listIMG_OLD);

                // Set rooms data
                setRooms(data.rooms || []);
                console.log(data.rooms)
            }
        } catch (error) {
            console.log(error)
            message.error('Có lỗi khi lấy dữ liệu chi tiết về HomeStay, hãy thử lại sau ít phút!');
        }
    };

    useEffect(() => {
        if (idHomeStay) {
            fillDataOnEdit();
        } else {
            form.resetFields();
            setSelectedAmenities([]);
            setFileList([]);
            setListIMG_OLD([]);
            setRooms([]);
        }
    }, [idHomeStay]);

   

    const onFinish = async (data) => {
        setLoading(true);
        try {
            let listIMG = fileList.length > 0 ? await uploadService.upload(fileList) : [];

            if (!idHomeStay) {
                message.error("Vui lòng chọn ảnh khi thêm mới homestay!")
                return
            }
            if (!idHomeStay && rooms.length === 0) {
                message.error("Vui lòng thêm ít nhất 1 phòng!")
                return
            }
            if (!idHomeStay) {
                rooms.forEach(async (room, index) => {

                    let listIMG_ROOM = await uploadService.upload(room.roomImage);
                    room.roomImage = listIMG_ROOM.join(',');

                });
            }

            const homestayPayload = {
                homeStay: {
                    homestayID: idHomeStay ? parseInt(idHomeStay) : 0,
                    ownerID: owner.idOwner,
                    homestayName: data.homestayName,
                    country: data.country,
                    province: data.province,
                    district: data.district,
                    wardOrCommune: data.wardOrCommune,
                    addressDetail: data.addressDetail,
                    imageHomestay: [...listIMG, ...listIMG_OLD.length > 0 ? listIMG_OLD.map(l => l.urlRoot) : []].join(','),
                    linkGoogleMap: data.linkGoogleMap,
                    timeCheckIn: data.timeCheckIn ? data.timeCheckIn.format('HH:mm') : null,
                    timeCheckOut: data.timeCheckOut ? data.timeCheckOut.format('HH:mm') : null,
                    totalScore: 0,
                    viewCount: 0,
                    reviewCount: 0,
                    averageRating: 0,
                    statusHomestay: data.statusHomestay || 0,
                    isLocked: data.isLocked || false,
                },
                listAmenities: selectedAmenities,
                detailHomeStay: {
                    id: data.id || 0,
                    homestayID: idHomeStay ? parseInt(idHomeStay) : 0,
                    noteHomestay: data.noteHomestay || '',
                    stayRules: data.stayRules || '',
                    hasSwimmingPool: data.hasSwimmingPool || false,
                    hasBilliardTable: data.hasBilliardTable || false,
                    manyActivities: data.manyActivities || false,
                    spaciousGarden: data.spaciousGarden || false,
                    lakeView: data.lakeView || false,
                    mountainView: data.mountainView || false,
                    seaView: data.seaView || false,
                    riceFieldView: data.riceFieldView || false,
                    policies: data.policies || '',
                },
                rooms: rooms
            };

            console.log(homestayPayload)
            let res = idHomeStay
                ? await homestayService.update(homestayPayload)
                : await homestayService.add(homestayPayload);

            res && notification.success({
                message: idHomeStay ? "Cập nhật thành công" : "Thêm thành công",
                description: idHomeStay
                    ? "Bạn đã cập nhật thông tin homestay thành công."
                    : "Bạn đã thêm mới homestay thành công.",
            });

            idHomeStay && fillDataOnEdit();

        } catch (error) {
            console.log(error);
            message.error("Có lỗi rồi bạn hãy thử lại sau nhé !");
        } finally {
            setLoading(false);
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
        idHomeStay && setListIMG_OLD((prevList) => prevList.filter((item) => item.uid !== file.uid));
    };

    // Room management functions
    const onAddRoom = () => {
        if (idHomeStay) {
            setActionModalWriteRoom(prev => ({ ...prev, isOpen: true, isNewHomeStay: idHomeStay ? false : true, idHomeStay: idHomeStay, refeshDetail: fillDataOnEdit, roomOld: null }))
        } else {
            setActionModalWriteRoom(prev => ({ ...prev, isOpen: true, isNewHomeStay: idHomeStay ? false : true, idHomeStay: null, roomOld: null }))
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!idHomeStay) {
            setRooms(prev => prev.filter(room => room.roomId !== roomId));
        } else {
            if (rooms.length === 1) {
                message.error("Không thể xóa phòng cuối cùng! Ít nhất phải có 1 phòng!");
                return;
            }
            let res = await roomService.delete(roomId);

            if (res) {
                setRooms(prev => prev.filter(room => room.roomId !== roomId));
            }
            message.success(`Xóa phòng có mã #${roomId} thành công`);
        }
    };



    return (
        <div className="w-full h-full mx-auto">
            <h2 className="text-2xl font-bold mb-5">
                {idHomeStay ? `Cập nhật Homestay | Mã:${idHomeStay}` : "Thêm Homestay"}
            </h2>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* Thông tin cơ bản của homestay */}
                <Card title="Thông tin cơ bản" className="mb-4">
                    <div className="grid grid-cols-2 gap-5">
                        <Form.Item
                            className='col-span-2'
                            name="homestayName"
                            label="Tên Homestay"
                            rules={[{ required: true, message: 'Vui lòng nhập tên homestay!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="country"
                            label="Quốc Gia"
                            initialValue={"Việt Nam"}
                            rules={[{ required: true, message: 'Vui lòng nhập quốc gia!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="province"
                            label="Tỉnh / Thành Phố"
                            rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố!' }]}
                        >
                            <Select showSearch allowClear onChange={(s) => setSelectedProvince(s)}>
                                {data_province.map((s) => <Option key={s.name} value={s.name}>{s.name}</Option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="district"
                            label="Quận / Huyện"
                            rules={[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]}
                        >
                            <Select showSearch allowClear onChange={(e) => setSelectedDistrict(e)}>
                                {data_province.find(s => s.name == selectedProvince)?.districts.map((s) =>
                                    <Option key={s.name} value={s.name}>{s.name}</Option>
                                )}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="wardOrCommune"
                            label="Phường / Xã"
                            rules={[{ required: true, message: 'Vui lòng nhập Phường/Xã!' }]}
                        >
                            <Select showSearch allowClear>
                                {data_province.find(s => s.name == selectedProvince)?.districts.find(s => s.name === selectedDistrict)?.wards.map((s) =>
                                    <Option key={s.name} value={s.name}>{s.name}</Option>
                                )}
                            </Select>
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

                        <Form.Item
                            name="timeCheckIn"
                            label="Giờ Check-in"
                        >
                            <TimePicker format="HH:mm" className='w-full' />
                        </Form.Item>

                        <Form.Item
                            name="timeCheckOut"
                            label="Giờ Check-out"
                        >
                            <TimePicker format="HH:mm" className='w-full' />
                        </Form.Item>

                    </div>
                </Card>
                {/* Chọn tiện nghi */}
                <Card title="Tiện nghi" className="mb-4">
                    <Form.Item label="Chọn Tiện Nghi">
                        <Select
                            mode="multiple"
                            allowClear
                            value={selectedAmenities}
                            onFocus={() => fetchAmenities()}
                            placeholder="Chọn tiện nghi"
                            onChange={handleAmenitiesChange}
                            options={amenitiesList.map(amenity => ({
                                label: amenity.name,
                                value: amenity.amenityID
                            }))}
                        />
                    </Form.Item>
                </Card>

                {/* Chi tiết homestay */}
                <Card title="Chi tiết Homestay" className="mb-4">
                   

                    <Divider className='mb-2'>Tiện ích và Khung cảnh</Divider>
                    <div className="  grid grid-cols-4 gap-2">
                        <Form.Item name="hasSwimmingPool" valuePropName="checked">
                            <Checkbox><i className="fas fa-swimming-pool text-blue-500 mr-1"></i>Có bể bơi</Checkbox>
                        </Form.Item>
                        <Form.Item name="hasBilliardTable" valuePropName="checked">
                            <Checkbox><i className="fas fa-table-tennis text-green-500 mr-1"></i>Có bàn billiard</Checkbox>
                        </Form.Item>
                        <Form.Item name="manyActivities" valuePropName="checked">
                            <Checkbox><i className="fas fa-running text-orange-500 mr-1"></i>Nhiều hoạt động</Checkbox>
                        </Form.Item>
                        <Form.Item name="spaciousGarden" valuePropName="checked">
                            <Checkbox><i className="fas fa-tree text-green-600 mr-1"></i>Khu vườn rộng</Checkbox>
                        </Form.Item>
                        <Form.Item name="lakeView" valuePropName="checked">
                            <Checkbox><i className="fas fa-water text-blue-400 mr-1"></i>View hồ</Checkbox>
                        </Form.Item>
                        <Form.Item name="mountainView" valuePropName="checked">
                            <Checkbox><i className="fas fa-mountain text-gray-600 mr-1"></i>View núi</Checkbox>
                        </Form.Item>
                        <Form.Item name="seaView" valuePropName="checked">
                            <Checkbox><i className="fas fa-umbrella-beach text-yellow-500 mr-1"></i>View biển</Checkbox>
                        </Form.Item>
                        <Form.Item name="riceFieldView" valuePropName="checked">
                            <Checkbox><i className="fas fa-seedling text-green-500 mr-1"></i>View ruộng lúa</Checkbox>
                        </Form.Item>
                    </div>
                    <Form.Item
                        name="noteHomestay"
                        label="Ghi chú về Homestay"
                    >
                         <CKEditorField placeholder="Nhập ghi chú về homestay..." />
                    </Form.Item>

                    <Form.Item
                        name="stayRules"
                        label="Nội quy lưu trú"
                    >
                         <CKEditorField placeholder="Nhập nội quy lưu trú..." />
                    </Form.Item>

                    <Form.Item
                        name="policies"
                        label="Chính sách"
                    >
                         <CKEditorField placeholder="Nhập chính sách..." />
                    </Form.Item>
                </Card>

                
                {/* Upload ảnh */}
                <Card title="Hình ảnh tổng quan Homestay" className="mb-4">
                    <Form.Item label="Ảnh liên quan">
                        <Upload
                            accept=".jpg,.png,.webp,.jpeg"
                            listType="picture-card"
                            maxCount={35}
                            multiple
                            fileList={fileList}
                            onChange={handleUploadChange}
                            onRemove={handleRemove}
                          
                        >
                            <div className='block'>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải lên</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </Card>
                {/* Quản lý phòng */}
                <Card
                    title="Quản lý phòng"
                    className="mb-4"
                    extra={
                        <Button type="primary" onClick={onAddRoom} icon={<PlusOutlined />}>
                            Thêm phòng
                        </Button>
                    }
                >
                    {rooms.length > 0 && rooms.map((room, index) => (
                        <div key={index} >
                            <CardRoom
                                room={room}
                                ButtonAction={<>
                                    <Button type="primary" size="small" className="flex items-center" onClick={() => setActionModalWriteRoom(prev => ({ ...prev, isOpen: true, isNewHomeStay: false, idHomeStay: idHomeStay, refeshDetail: fillDataOnEdit, roomOld: room }))} >
                                        <span className="hidden sm:inline" >Sửa</span>
                                    </Button>
                                    <Button danger size="small" className="flex items-center" onClick={() => handleDeleteRoom(room.roomId)}>
                                        <span className="hidden sm:inline" >Xóa</span>
                                    </Button>
                                </>
                                }
                            />
                        </div>
                    ))}
                    <ModalWriteRoom action={actionModalWriteRoom} setAction={setActionModalWriteRoom} setRooms={setRooms} />
                </Card>



                <Form.Item className='block text-right pr-4'>
                    <Button loading={loading} type="primary" htmlType="submit" size="large">
                        {idHomeStay ? "Cập nhật Homestay" : "Thêm Homestay"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default memo(WriteHomeStay);