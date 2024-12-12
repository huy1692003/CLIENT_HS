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
  const [admin,setAdmin] = useRecoilState(adminState)
  const [form,setForm] = useState({
    username:"",
    password:""
  })

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
      let res = await adminService.login(form)
      if(res)
      {
        sessionStorage.setItem("admin",JSON.stringify(res))
        setAdmin(res)
        navigate("/admin/user-manager")
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-96">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-800">HuyStay Admin</h2>
          <p className="text-gray-600">Đăng nhập vào hệ thống quản trị</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Tên đăng nhập"
              size="large"
              onChange={(e) => setForm({...form, username: e.target.value})}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full bg-blue-800"
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
