import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Image, Select, message, Button, InputNumber, Card, Tag, Carousel, Divider } from 'antd';
import amenitiesService from '../../services/amenitiesService';
import homestayService from '../../services/homestayService';
import { URL_SERVER } from '../../constant/global';
import { propFormatterNumber } from '../../utils/propState';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import CardRoom from '../../components/owner/CardRoom';

export const ViewHomeStayModal = ({ visible, idHomeStay, setVisible }) => {
    const [form] = Form.useForm();
    const [amenitiesList, setAmenitiesList] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch amenities chỉ một lần khi component mount
    useEffect(() => {
        const fetchAmenities = async () => {
            if (amenitiesList.length > 0) return; // Tránh fetch lại nếu đã có data
            
            try {
                const amenities = await amenitiesService.getAll();
                setAmenitiesList(amenities);
            } catch (error) {
                message.error('Lỗi khi lấy danh sách tiện nghi!');
            }
        };
        fetchAmenities();
    }, []); // Dependency array rỗng để chỉ chạy một lần

    const fillDataOnView = async () => {
        if (!idHomeStay) return;
        
        setLoading(true);
        try {
            const data = await homestayService.getDetail(idHomeStay);
            if (data) {
                // Chỉ lấy các field cần thiết từ homeStay và detailHomeStay
                const formValues = {
                    homestayName: data.homeStay.homestayName,
                    country: data.homeStay.country,
                    province: data.homeStay.province,
                    district: data.homeStay.district,
                    wardOrCommune: data.homeStay.wardOrCommune,
                    addressDetail: data.homeStay.addressDetail,
                    linkGoogleMap: data.homeStay.linkGoogleMap,
                    timeCheckIn: data.homeStay.timeCheckIn,
                    timeCheckOut: data.homeStay.timeCheckOut,
                    // Chi tiết homestay
                    noteHomestay: data.detailHomeStay?.noteHomestay,
                    stayRules: data.detailHomeStay?.stayRules,
                    policies: data.detailHomeStay?.policies,
                    hasSwimmingPool: data.detailHomeStay?.hasSwimmingPool || false,
                    hasBilliardTable: data.detailHomeStay?.hasBilliardTable || false,
                    manyActivities: data.detailHomeStay?.manyActivities || false,
                    spaciousGarden: data.detailHomeStay?.spaciousGarden || false,
                    lakeView: data.detailHomeStay?.lakeView || false,
                    mountainView: data.detailHomeStay?.mountainView || false,
                    seaView: data.detailHomeStay?.seaView || false,
                    riceFieldView: data.detailHomeStay?.riceFieldView || false,
                };
                
                form.setFieldsValue(formValues);
                
                // Set amenities
                setSelectedAmenities(data.homeStayAmenities?.map(a => a.amenityID) || []);

                // Set images - chỉ lấy những ảnh có URL hợp lệ
                const imageUrls = data.homeStay.imageHomestay?.split(',').filter(img => img?.trim()) || [];
                const listIMG_OLD = imageUrls.map((img, index) => ({
                    uid: String(index),
                    name: `image-${index}`,
                    status: 'done',
                    url: URL_SERVER + img.trim(),
                }));
                setFileList(listIMG_OLD);
                
                // Set rooms data - chỉ lấy những phòng có status = 1 (active)
                const activeRooms = data.rooms?.filter(room => room.status === 1) || [];
                setRooms(activeRooms);
            }
        } catch (error) {
            console.error('Error fetching homestay details:', error);
            message.error('Có lỗi khi lấy dữ liệu chi tiết về HomeStay!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idHomeStay && visible) {
            fillDataOnView();
        } else {
            // Reset form khi đóng modal
            form.resetFields();
            setSelectedAmenities([]);
            setFileList([]);
            setRooms([]);
        }
    }, [idHomeStay, visible]);

    const handleClose = () => {
        setVisible({ show: false, idHomeStay: null });
    };

    // Memoize các options cho Select để tránh re-render
    const amenityOptions = React.useMemo(() => 
        amenitiesList.map(amenity => ({
            label: amenity.name,
            value: amenity.amenityID
        })), [amenitiesList]
    );

    return (
        <Modal
            visible={visible}
            closable={false}
            onCancel={handleClose}
            title={
                <div className="flex justify-between items-center rounded-lg border-b bg-blue-600">
                    <h3 className='text-2xl text-white p-3' style={{width: '95%'}}>
                        {`Thông tin chi tiết Homestay | Mã: ${idHomeStay || 'N/A'}`}
                    </h3>
                    <Button 
                        type="default"
                        className="mr-3 hover:bg-red-500 hover:text-white text-xl h-full transition-colors"
                        icon={<i className="fa-solid fa-xmark mr-1"></i>}
                        onClick={handleClose}
                    >
                        Đóng
                    </Button>
                </div>
            }
            footer={null}
            width={1300}
            loading={loading}
        >
            <Form form={form} layout="vertical">
                <Card title="Thông tin cơ bản" className="mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="homestayName" label={<strong>Tên Homestay</strong>}>
                            <Input readOnly className="bg-gray-50" />
                        </Form.Item>

                        <Form.Item name="country" label={<strong>Quốc Gia</strong>}>
                            <Input readOnly className="bg-gray-50" />
                        </Form.Item>

                        <Form.Item name="province" label={<strong>Tỉnh / Thành Phố</strong>}>
                            <Input readOnly className="bg-gray-50" />
                        </Form.Item>

                        <Form.Item name="district" label={<strong>Quận / Huyện</strong>}>
                            <Input readOnly className="bg-gray-50" />
                        </Form.Item>

                        <Form.Item name="wardOrCommune" label={<strong>Phường / Xã</strong>}>
                            <Input readOnly className="bg-gray-50" />
                        </Form.Item>

                        <Form.Item name="addressDetail" label={<strong>Địa Chỉ Chi Tiết</strong>}>
                            <Input readOnly className="bg-gray-50" />
                        </Form.Item>

                        <Form.Item name="linkGoogleMap" label={<strong>Link GoogleMap</strong>}>
                            <Input readOnly className="bg-gray-50" />
                        </Form.Item>

                        <Form.Item name="timeCheckIn" label={<strong>Giờ Check-in</strong>}>
                            <Input readOnly className="bg-gray-50" />
                        </Form.Item>

                        <Form.Item name="timeCheckOut" label={<strong>Giờ Check-out</strong>}>
                            <Input readOnly className="bg-gray-50" />
                        </Form.Item>
                    </div>
                </Card>

                <Card title="Tiện nghi" className="mb-4">
                    <Form.Item label={<strong>Tiện Nghi Hiện Có</strong>}>
                        <Select
                            mode="multiple"
                            disabled
                            value={selectedAmenities}
                            placeholder="Không có tiện nghi nào"
                            options={amenityOptions}
                            className="w-full"
                        />
                    </Form.Item>
                </Card>

                <Card title="Tiện ích và Khung cảnh" className="mb-4">
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { key: 'hasSwimmingPool', icon: 'fas fa-swimming-pool', label: 'Bể bơi', color: 'blue' },
                            { key: 'hasBilliardTable', icon: 'fas fa-table-tennis', label: 'Bàn billiard', color: 'green' },
                            { key: 'manyActivities', icon: 'fas fa-running', label: 'Nhiều hoạt động', color: 'orange' },
                            { key: 'spaciousGarden', icon: 'fas fa-tree', label: 'Khu vườn rộng', color: 'green' },
                            { key: 'lakeView', icon: 'fas fa-water', label: 'View hồ', color: 'blue' },
                            { key: 'mountainView', icon: 'fas fa-mountain', label: 'View núi', color: 'gray' },
                            { key: 'seaView', icon: 'fas fa-umbrella-beach', label: 'View biển', color: 'yellow' },
                            { key: 'riceFieldView', icon: 'fas fa-seedling', label: 'View ruộng lúa', color: 'green' }
                        ].map(item => (
                            <Form.Item key={item.key} name={item.key} valuePropName="checked">
                                <div className="flex items-center p-2 border rounded-lg bg-gray-50">
                                    <i className={`${item.icon} text-${item.color}-500 mr-2`}></i>
                                    <Tag color={form.getFieldValue(item.key) ? "green" : "default"}>
                                        {form.getFieldValue(item.key) ? `Có ${item.label.toLowerCase()}` : `Không có ${item.label.toLowerCase()}`}
                                    </Tag>
                                </div>
                            </Form.Item>
                        ))}
                    </div>
                </Card>

                {/* Chỉ hiển thị các thông tin văn bản nếu có nội dung */}
                {(form.getFieldValue('noteHomestay') || form.getFieldValue('stayRules') || form.getFieldValue('policies')) && (
                    <Card title="Thông tin bổ sung" className="mb-4">
                        {form.getFieldValue('noteHomestay') && (
                            <Form.Item label={<strong>Ghi chú về Homestay</strong>} name="noteHomestay">
                                <div className="border p-4 rounded-lg bg-gray-50" 
                                     dangerouslySetInnerHTML={{ __html: form.getFieldValue('noteHomestay') }} />
                            </Form.Item>
                        )}

                        {form.getFieldValue('stayRules') && (
                            <Form.Item label={<strong>Nội quy lưu trú</strong>} name="stayRules">
                                <div className="border p-4 rounded-lg bg-gray-50" 
                                     dangerouslySetInnerHTML={{ __html: form.getFieldValue('stayRules') }} />
                            </Form.Item>
                        )}

                        {form.getFieldValue('policies') && (
                            <Form.Item label={<strong>Chính sách</strong>} name="policies">
                                <div className="border p-4 rounded-lg bg-gray-50" 
                                     dangerouslySetInnerHTML={{ __html: form.getFieldValue('policies') }} />
                            </Form.Item>
                        )}
                    </Card>
                )}
                
                {/* Chỉ hiển thị hình ảnh nếu có */}
                {fileList.length > 0 && (
                    <Card title="Hình ảnh tổng quan Homestay" className="mb-4">
                        <div className="mb-4">
                            <Carousel
                                arrows
                                prevArrow={<Button icon={<LeftOutlined />} />}
                                nextArrow={<Button icon={<RightOutlined />} />}
                            >
                                {fileList.map((file) => (
                                    <div key={file.uid} className="h-96 flex justify-center items-center">
                                        <Image
                                            src={file.url}
                                            alt="Homestay preview"
                                            className="object-contain max-h-96"
                                            style={{ maxHeight: '24rem' }}
                                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN2BvAJgEbA2Sb2CaELRw2cdiKrl"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                            {fileList.map((file) => (
                                <Image
                                    key={file.uid}
                                    src={file.url}
                                    alt="Homestay thumbnail"
                                    className="object-cover rounded-lg h-24 cursor-pointer hover:opacity-80 transition-opacity"
                                    style={{ height: '6rem', width: '100%', objectFit: 'cover' }}
                                />
                            ))}
                        </div>
                    </Card>
                )}

                {/* Chỉ hiển thị phòng nếu có */}
                <Card title={`Quản lý phòng (${rooms.length} phòng)`} className="mb-4">
                    {rooms.length > 0 ? rooms.map((room, index) => (
                        <div key={room.roomId || index} className="mb-4">
                            <CardRoom
                                room={room}
                                ButtonAction={null}
                            />
                        </div>
                    )) : (
                        <div className="text-center py-8">
                            <i className="fas fa-bed text-gray-400 text-4xl mb-2"></i>
                            <p className="text-gray-500">Không có thông tin phòng</p>
                        </div>
                    )}
                </Card>
            </Form>
        </Modal>
    );
};