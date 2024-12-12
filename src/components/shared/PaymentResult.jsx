import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Result, Spin, Button } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";

const ResultPayment = () => {
  const location = useLocation();
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    // Lấy các tham số từ URL
    const params = new URLSearchParams(location.search);
    const result = {
      partnerCode: params.get("partnerCode"),
      accessKey: params.get("accessKey"),
      requestId: params.get("requestId"),
      amount: params.get("amount"),
      orderId: params.get("orderId"),
      orderInfo: params.get("orderInfo"),
      message: params.get("message"),
      localMessage: params.get("localMessage"),
      errorCode: params.get("errorCode"),
      transId: params.get("transId"),
      payType: params.get("payType"),
    };
    setPaymentResult(result);
  }, [location]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Kết Quả Thanh Toán</h2>
        {paymentResult ? (
          paymentResult.errorCode === "0" ? (
            <Result
              status="success"
              icon={<SmileOutlined />}
              title="Thanh toán thành công!"
              subTitle={`Mã đơn hàng: ${paymentResult.orderId}`}
              extra={[
                <Button type="primary" href="/" key="home">
                  Về trang chủ
                </Button>,
              ]}
            >
              <p><strong>Số tiền:</strong> {paymentResult.amount} VND</p>
              <p><strong>Nội dung:</strong> {paymentResult.orderInfo}</p>
              <p><strong>Mã giao dịch:</strong> {paymentResult.transId}</p>
              <p><strong>Thông báo:</strong> {paymentResult.localMessage}</p>
            </Result>
          ) : (
            <Result
              status="error"
              icon={<FrownOutlined />}
              title="Thanh toán thất bại!"
              subTitle={`Mã đơn hàng: ${paymentResult.orderId}`}
              extra={[
                <Button type="primary" href="/" key="retry">
                  Thử lại
                </Button>,
              ]}
            >
              <p><strong>Thông báo:</strong> {paymentResult.localMessage}</p>
            </Result>
          )
        ) : (
          <Spin tip="Đang xử lý..." size="large" className="block mx-auto" />
        )}
      </Card>
    </div>
  );
};

export default memo(ResultPayment);
