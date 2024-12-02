import React, { memo, useEffect, useState } from "react";
import { message, Modal, Spin, Input, Row, Col, Upload, Image, Button } from "antd";
import partnerShipService from "../../../services/partnerShipService";
import { UploadOutlined } from "@ant-design/icons";
import 'tailwindcss/tailwind.css'; // Import tailwindcss
import TextArea from "antd/es/input/TextArea";
import { URL_SERVER } from "../../../constant/global";
const statuses = ["Chưa phê duyệt", "Đã phê duyệt", "Đã từ chối"];



const DetailPartnerShip = ({ stateModal, idPartner }) => {
    const [partnerDetails, setPartnerDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        const fetchPartnerDetails = async () => {
            setLoading(true);
            try {
                let res = await partnerShipService.getByIDPart(idPartner);
                res && setPartnerDetails(res);
                console.log("res", idPartner)
            } catch (err) {
                message.error("Có lỗi rồi hãy thử lại sau");
            } finally {
                setLoading(false);
            }
        };
        fetchPartnerDetails();

    }, [idPartner]);

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center h-64">
    //             <Spin size="large" tip="Đang tải dữ liệu..." />
    //         </div>
    //     );
    // }

    return (
        <Modal
            title={<h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-3">Chi tiết đơn đăng ký hợp tác</h2>}
            visible={stateModal.showDetail}
            onCancel={() => stateModal.setShowDetail(false)}
            footer={null}
            width="70%"
            bodyStyle={{ fontSize: '13px' }}
        >
            {
                partnerDetails &&
                <div className="space-y-5 mt-5">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <label><strong>Tên Công Ty hoặc Doanh nghiệp</strong></label>
                            <Input className="mt-2 disabled:text-black" value={partnerDetails.companyName} disabled />
                        </Col>
                        <Col span={12}>
                            <label><strong>Họ và tên người đại diện</strong></label>
                            <Input className="mt-2 disabled:text-black" value={partnerDetails.fullName} disabled />
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <label><strong>Địa Chỉ</strong></label>
                            <Input className="mt-2 disabled:text-black" value={partnerDetails.address} disabled />
                        </Col>
                        <Col span={12}>
                            <label><strong>Số Điện Thoại</strong></label>
                            <Input className="mt-2 disabled:text-black" value={partnerDetails.phoneNumber} disabled />
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <label><strong>Email</strong></label>
                            <Input className="mt-2 disabled:text-black" value={partnerDetails.email} disabled />
                        </Col>
                        <Col span={12}>
                            <label><strong>Số HomeStay Sở Hữu</strong></label>
                            <Input className="mt-2 disabled:text-black" value={partnerDetails.totalHomeStay} disabled />
                        </Col>
                    </Row>
                    <label className="block text-lg mt-4"><strong>Một số ảnh giới thiệu về HomeStay </strong></label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {partnerDetails.imgPreview && partnerDetails.imgPreview.map((img, index) => {
                            return (
                                <Image
                                    key={index}
                                    width={270}
                                    height={200}
                                    src={URL_SERVER + img}
                                    alt={`Image ${index + 1}`}
                                    className="rounded-md shadow-lg"
                                />
                            );
                        })}
                    </div>
                    <Row>
                        <Col span={24}>
                            <label><strong>Thông tin bổ sung</strong></label>
                            <TextArea rows={10} className="mt-2 disabled:text-black disabled:bg-gray-100 disabled:opacity-100" value={partnerDetails.note} disabled />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <label><strong>Tình trạng phê duyệt</strong></label>
                            <Input className="mt-2 disabled:text-black disabled:bg-gray-100 disabled:opacity-100"
                                value={statuses[partnerDetails.status] || ""}
                                disabled />

                        </Col>
                    </Row>
                    <div className="text-right">
                        <Button size="large" className="" type="primary" onClick={() => stateModal.setShowDetail(false)}>Đóng</Button>
                    </div>
                </div>
            }

        </Modal>
    );
};
export default memo(DetailPartnerShip)
