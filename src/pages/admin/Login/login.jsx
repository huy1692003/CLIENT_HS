import React, { memo, useState } from 'react';
import { Form, Input, Button, Card, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import adminService from '../../../services/adminService';
import { adminState } from '../../../recoil/atom';
import { useRecoilState } from 'recoil';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useRecoilState(adminState);
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const onFinish = async () => {
    if (!form.username || !form.password) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!',
      });
      return;
    }

    try {
      setLoading(true);
      let res = await adminService.login(form);
      if (res) {
        sessionStorage.setItem('admin', JSON.stringify(res));
        sessionStorage.setItem('token', res.tokenUser);
        setAdmin(res);
        navigate('/admin/user-manager');
      }
    } catch (error) {
      notification.error({
        message: 'Đăng nhập thất bại',
        description: 'Thông tin tài khoản hoặc mật khẩu không chính xác !',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-blue-400">
      <Card className="w-full max-w-xl p-6 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-800">HuyStay Admin</h2>
          <p className="text-gray-500">Đăng nhập vào hệ thống quản trị</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-6"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-blue-400" />}
              placeholder="Tên đăng nhập"
              size="large"
              className="rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-blue-400" />}
              placeholder="Mật khẩu"
              size="large"
              className="rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-800 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md"
              loading={loading}
              size="large"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default memo(Login);
