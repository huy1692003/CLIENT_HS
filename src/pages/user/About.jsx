import React, { memo } from 'react';
import { Typography, Row, Col, Card, Space, Divider,Image } from 'antd';
import { HomeOutlined, TeamOutlined, SafetyCertificateOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import image from '~/assets/Image/partnership.png';

const { Title, Paragraph } = Typography;

const About = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <Typography>
                <Title level={1} className="text-center mb-8">Về HuyStay</Title>
                <div className="mb-12">
                    <Paragraph className="text-lg leading-relaxed mb-8">
                        HuyStay là nền tảng kết nối trực tiếp giữa chủ homestay và khách hàng, mang đến trải nghiệm đặt phòng an toàn, thuận tiện và đáng tin cậy. Chúng tôi cam kết mang đến những địa điểm lưu trú chất lượng với giá cả hợp lý nhất cho khách hàng. Với đội ngũ nhân viên chuyên nghiệp và tận tâm, chúng tôi luôn sẵn sàng hỗ trợ 24/7 để đảm bảo chuyến đi của bạn được trọn vẹn và đáng nhớ.
                    </Paragraph>
                    
                    <div className="grid grid-cols-1 gap-8">
                        <Image 
                            src={image} 
                            preview={false}
                            className="block mx-auto rounded-lg shadow-lg object-cover w-full md:w-4/5 lg:w-3/4 xl:w-2/3"
                            style={{
                                maxHeight: '60vh',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                </div>

                <Divider />

                <Title level={2} className="text-center mb-8">Điểm Nổi Bật Của Chúng Tôi</Title>

                <Row gutter={[32, 32]} className="mb-12">
                    <Col xs={24} sm={12} lg={6}>
                        <Card 
                            className="text-center h-full hover:shadow-lg transition-shadow"
                            bordered={false}
                        >
                            <Space direction="vertical" align="center" size="large">
                                <HomeOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                                <Title level={4}>Đa Dạng Lựa Chọn</Title>
                                <Paragraph>
                                    Hàng nghìn homestay chất lượng trên khắp Việt Nam
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                        <Card 
                            className="text-center h-full hover:shadow-lg transition-shadow"
                            bordered={false}
                        >
                            <Space direction="vertical" align="center" size="large">
                                <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                                <Title level={4}>An Toàn & Tin Cậy</Title>
                                <Paragraph>
                                    Đảm bảo thanh toán an toàn và xác thực chủ nhà
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                        <Card 
                            className="text-center h-full hover:shadow-lg transition-shadow"
                            bordered={false}
                        >
                            <Space direction="vertical" align="center" size="large">
                                <TeamOutlined style={{ fontSize: '48px', color: '#faad14' }} />
                                <Title level={4}>Cộng Đồng Lớn</Title>
                                <Paragraph>
                                    Kết nối hàng triệu người dùng trên toàn quốc
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                        <Card 
                            className="text-center h-full hover:shadow-lg transition-shadow"
                            bordered={false}
                        >
                            <Space direction="vertical" align="center" size="large">
                                <CustomerServiceOutlined style={{ fontSize: '48px', color: '#eb2f96' }} />
                                <Title level={4}>Hỗ Trợ 24/7</Title>
                                <Paragraph>
                                    Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Divider />

                <Title level={2} className="text-center mb-8">Sứ Mệnh Của Chúng Tôi</Title>
                
                <Paragraph className="text-lg text-center mb-12">
                    Chúng tôi cam kết tạo ra một nền tảng đáng tin cậy, nơi mọi người có thể tìm thấy 
                    những trải nghiệm lưu trú tuyệt vời với giá cả phải chăng. HuyStay không chỉ là 
                    một website đặt phòng, mà còn là cầu nối giữa những chủ nhà tận tâm và du khách 
                    đang tìm kiếm những kỷ niệm đáng nhớ.
                </Paragraph>
            </Typography>
        </div>
    );
};

export default memo(About);
