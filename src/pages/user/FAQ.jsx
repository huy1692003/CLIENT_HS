import React, { memo, useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Space, Divider, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import FAQService from '../../services/faqService';

const { Title, Paragraph } = Typography;

const FAQ = () => {
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    // Fetch data from FAQService
    const getData = async () => {
      const res = await FAQService.getAll();
      setFaqData(res || []);
    };
    
    getData();
  }, []);

  return (
    <div className=" mx-auto px-4 py-8">
      <div className="px-4 py-2 bg-gray-100">
        <Breadcrumb
          items={[
            {
              title: <Link to="/">Trang chủ</Link>,
            },
            {
              title: 'Câu Hỏi Thường Gặp',
            },
          ]}
        />
      </div>

      <Typography>

        <Row gutter={[32, 32]} className="mb-12">
          {faqData.map((faq) => (
            <Col key={faq.faqID} xs={24} sm={12} lg={8}>
              <Card
                className="hover:shadow-lg transition-shadow mb-4"
                bordered={false}
              >
                <Title level={4}>{faq.question}</Title>
                <Paragraph>{faq.answer}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Typography>
    </div>
  );
};

export default memo(FAQ);
