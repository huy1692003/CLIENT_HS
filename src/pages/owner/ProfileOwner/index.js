import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../../recoil/atom";
import { Form, Input, Button, Card, Row, Col, TimePicker, Upload, message, Tabs, Modal, Spin, notification, Select, DatePicker, Avatar } from "antd";
import { UploadOutlined, UserOutlined, BankOutlined, ClockCircleOutlined, FileTextOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, HeatMapOutlined, PlusOutlined } from "@ant-design/icons";
import ownerService from "../../../services/ownerService";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import CKEditorField from "../../../components/shared/CKEditor";
import { uploadService } from "../../../services/uploadService";
import { URL_SERVER } from "../../../constant/global";
import createFromData from "../../../utils/createFormData";

const { TabPane } = Tabs;

const ProfileOwner = () => {
    const owner = useRecoilValue(userState);
    const setUser = useSetRecoilState(userState);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    
    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const data = await ownerService.getProfileOwnerStay(owner.idOwner);
            setProfileData(data);
            console.log(data);
            data.user.profilePicture && setFileList([
                {
                    uid: '-1',
                    name: `image-0`,
                    status: 'done',
                    url: URL_SERVER + data.user.profilePicture,
                    urlRoot: data.user.profilePicture,
                    originFileObj: null
                }
            ]);
            // Set form values
            form.setFieldsValue({
                fullName: data.user.fullName,
                email: data.user.email,
                phoneNumber: data.user.phoneNumber,
                address: data.user.address,
                gender: data.user.gender,
                dateOfBirth: moment(data.user.dateOfBirth),
                defaultCheckinTime: data.owner.defaultCheckinTime ? moment(data.owner.defaultCheckinTime, 'HH:mm') : null,
                defaultCheckoutTime: data.owner.defaultCheckoutTime ? moment(data.owner.defaultCheckoutTime, 'HH:mm') : null,
                nameBank: data.owner.nameBank,
                numberBank: data.owner.numberBank,
                defaultRules: data.owner.defaultRules,
                defaultPolicies: data.owner.defaultPolicies,
                description: data.owner.description,
            });
        } catch (error) {
            console.error("Error fetching profile data:", error);
            notification.error({
                message: "Lỗi",
                description: "Không thể tải thông tin hồ sơ. Vui lòng thử lại sau."
            });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        if (owner && owner.idOwner) {
            fetchProfileData();
        }
    }, [owner, form]);


    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

  
    console.log(fileList)
    const handleSubmit = async (values) => {
        try {
            setSaving(true);

            let fileImg = fileList?.[0]?.originFileObj;
            if (fileList?.[0]?.originFileObj) {
                const uploadResult = await uploadService.postSingle(createFromData.single(fileList));
                values.profilePicture = uploadResult.filePath;
            }
            const updatedOwnerData = {
                ownerID: owner.idOwner,
                user: {
                    userID: profileData.user.userID,
                    fullName: values.fullName,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    address: values.address,
                    gender: values.gender,
                    dateOfBirth: values.dateOfBirth ?? null,
                    profilePicture: fileList?.[0]?.originFileObj ? values.profilePicture : profileData.user.profilePicture
                },
                defaultCheckinTime: values.defaultCheckinTime ? values.defaultCheckinTime.format('HH:mm') : null,
                defaultCheckoutTime: values.defaultCheckoutTime ? values.defaultCheckoutTime.format('HH:mm') : null,
                nameBank: values.nameBank,
                numberBank: values.numberBank,
                defaultRules: values.defaultRules,
                defaultPolicies: values.defaultPolicies,
                description: values.description,
            };

            console.log(updatedOwnerData);
            const response = await ownerService.updateProfile(updatedOwnerData);

            if (response.success) {
                notification.success({
                    message: "Thành công",
                    description: "Cập nhật thông tin thành công!"
                });

                fetchProfileData();
            } else {
                notification.error({
                    message: "Lỗi",
                    description: response.message || "Cập nhật thông tin thất bại!"
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau."
            });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (values) => {
        try {
            setChangingPassword(true);
            const { oldPassword, newPassword } = values;

            const response = await ownerService.changePassword(profileData.user.userID, oldPassword, newPassword);

            if (response.success) {
                notification.success({
                    message: "Thành công",
                    description: "Đổi mật khẩu thành công!"
                });
                setIsPasswordModalVisible(false);
                passwordForm.resetFields();
            } else {
                notification.error({
                    message: "Lỗi",
                    description: response.message || "Đổi mật khẩu thất bại!"
                });
            }
        } catch (error) {
            console.error("Error changing password:", error);
            notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại sau."
            });
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spin size="large" tip="Đang tải thông tin..." />
            </div>
        );
    }

    return (
        <div className="p-6">
            <Card title="Thông tin chủ HomeStay" className="mb-6">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Thông tin cá nhân" key="1">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                gender: "1"
                            }}
                        >
                            <Row  >
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="profilePicture"
                                        label="Ảnh đại diện"
                                    >
                                        <Upload
                                            accept=".jpg,.png,.webp,.jpeg"
                                            listType="picture-circle"
                                            maxCount={1}
                                            fileList={fileList}
                                            onChange={handleUploadChange}
                                            beforeUpload={() => false}
                                        >
                                            
                                                <div className='block'>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                                </div>
                                            
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="fullName"
                                        label="Họ và tên"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email!' },
                                            { type: 'email', message: 'Email không hợp lệ!' }
                                        ]}
                                    >
                                        <Input prefix={<MailOutlined />} placeholder="Email" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="phoneNumber"
                                        label="Số điện thoại"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                    >
                                        <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="gender"
                                        label="Giới tính"
                                    >
                                        <Select prefix={<UserOutlined />} className="w-full">
                                            <Select.Option value={1}>Nam</Select.Option>
                                            <Select.Option value={0}>Nữ</Select.Option>
                                            <Select.Option value={2}>Khác</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="address"
                                        label="Địa chỉ"
                                    >
                                        <Input prefix={<HeatMapOutlined />} placeholder="Địa chỉ" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="dateOfBirth"
                                        label="Ngày sinh"
                                        className="w-full"
                                    >
                                        <DatePicker className="w-full" prefix={<CalendarOutlined />} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
                                    </Form.Item>
                                </Col>
                            </Row>


                            <Button type="primary" onClick={() => setIsPasswordModalVisible(true)}>
                                Đổi mật khẩu
                            </Button>
                        </Form>
                    </TabPane>

                    <TabPane tab="Thông tin HomeStay" key="2">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="defaultCheckinTime"
                                        label="Thời gian check-in mặc định"
                                    >
                                        <TimePicker format="HH:mm" placeholder="Chọn giờ" className="w-full" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="defaultCheckoutTime"
                                        label="Thời gian check-out mặc định"
                                    >
                                        <TimePicker format="HH:mm" placeholder="Chọn giờ" className="w-full" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="nameBank"
                                        label="Tên ngân hàng"
                                    >
                                        <Input prefix={<BankOutlined />} placeholder="Tên ngân hàng" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="numberBank"
                                        label="Số tài khoản"
                                    >
                                        <Input placeholder="Số tài khoản ngân hàng" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="description"
                                label="Mô tả về HomeStay"
                            >
                                <CKEditorField value={profileData?.owner?.description} placeholder="Mô tả về HomeStay của bạn" />
                            </Form.Item>

                            <Form.Item
                                name="defaultRules"
                                label="Quy tắc mặc định"
                            >
                                <CKEditorField value={profileData?.owner?.defaultRules} placeholder="Quy tắc mặc định cho HomeStay" />
                            </Form.Item>

                            <Form.Item
                                name="defaultPolicies"
                                label="Chính sách mặc định"
                            >
                                <CKEditorField value={profileData?.owner?.defaultPolicies} placeholder="Chính sách mặc định cho HomeStay" />
                            </Form.Item>



                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={saving}>
                                    Lưu thông tin
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>

            <Modal
                title="Đổi mật khẩu"
                visible={isPasswordModalVisible}
                onCancel={() => setIsPasswordModalVisible(false)}
                footer={null}
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                >
                    <Form.Item
                        name="oldPassword"
                        label="Mật khẩu hiện tại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
                            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu mới" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={changingPassword}>
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProfileOwner;