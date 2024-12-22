import { Button, Form, Input, message, notification, Select } from "antd";
import { memo, useEffect, useState } from "react";
import imageBanner from '~/assets/Banner/banner2.jpg'; // Đảm bảo đường dẫn là chính xác
import CustomerService from "../../services/customerService";
import { json, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../../recoil/atom";

const LoginUser = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const setUserState = useSetRecoilState(userState)

    const onFinish = async (data) => {
        setLoading(true)
        try {
            let res = isLogin ? await CustomerService.login(data) : await CustomerService.register(data)
            if (isLogin) {
                sessionStorage.setItem("user", JSON.stringify(res))
                sessionStorage.setItem('token', res.tokenUser);

                setUserState(JSON.parse(sessionStorage.getItem("user")))
                navigate("/")
            }
            notification.success({
                message: isLogin ? 'Đăng nhập thành công' : 'Thông báo',
                description: isLogin ? 'Chào mừng bạn đến với HuyStay!' : 'Bạn đã đăng ký thành công hãy đăng nhập ngay nào!',
            });

        } catch (error) {
            console.log(error)
            message.error(error.response?.data || "Có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        !isLogin && form.resetFields();
    }, [isLogin])

    return (
        <div className="relative h-screen">
            {/* Thiết lập ảnh nền */}
            <div
                className="absolute inset-0 bg-cover bg-center rounded-lg object-cover"
                style={{ backgroundImage: `url(${imageBanner})` }}
            ></div>
            <div className="flex items-center justify-center h-full rounded-3xl">
                <div style={{ opacity: "99%" }} className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-3xl shadow-2xl ">
                    <h2 className="text-2xl font-bold text-center">
                        {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                    </h2>
                    <Form
                        form={form}
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        {
                            !isLogin && <>
                                <Form.Item
                                    name="fullName"
                                    label="Họ Tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                >
                                    <Input placeholder="Nhập họ tên của bạn" />
                                </Form.Item>
                                <Form.Item
                                    name="gender"
                                    label="Giới Tính"
                                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                                >
                                    <Select placeholder="Chọn giới tính">
                                        <Select.Option value="1">Nam</Select.Option>
                                        <Select.Option value="0">Nữ</Select.Option>
                                        <Select.Option value="2">Khác</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, message: 'Vui lòng nhập email để chúng tôi liên hệ với bạn khi cần thiết!' }]}
                                >
                                    <Input placeholder="Nhập tài khoản của bạn" />
                                </Form.Item>
                            </>
                        }
                        <Form.Item
                            name="username"
                            label="Tài Khoản"
                            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
                        >
                            <Input placeholder="Nhập tài khoản của bạn" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Mật Khẩu"
                            rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu của bạn" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                                {isLogin ? "Đăng nhập" : "Đăng kí"}
                            </Button>
                            <p className="mt-3 text-right">Nếu bạn {isLogin ? "chưa" : "đã"} có tài khoản ?
                                <Button className="border-0 text-base text-blue-500 "
                                    onClick={() => {
                                        setIsLogin(!isLogin)
                                    }
                                    }>{isLogin ? "Đăng kí" : "Đăng nhập"}</Button></p>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};
export default memo(LoginUser)
