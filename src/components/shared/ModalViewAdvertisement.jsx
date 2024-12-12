import { memo } from "react"
import { URL_SERVER } from "../../constant/global"
import { CheckCircleFilled, CloseCircleFilled, EyeOutlined } from "@ant-design/icons";
import { Button, Table, Tag, Tooltip, Modal, Descriptions, Divider, Image, notification, Input, Popconfirm } from "antd";
import { formatPrice } from "../../utils/formatPrice";
import { statusAdvertisement } from "../../constant/statusConstant";
const ModalviewAdvertisement = ({ isModalVisible, handleModalClose, selectedAd }) => {
    return <Modal
        title="Chi tiết quảng cáo"
        width={"60vw"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
            <Button key="close" onClick={handleModalClose} className="bg-blue-500 text-white">
                Đóng
            </Button>,
        ]}
    >
        {selectedAd && (
            <div>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Mã quảng cáo">{selectedAd.adID}</Descriptions.Item>
                    <Descriptions.Item label="Tiêu đề">{selectedAd.adTitle}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">{selectedAd.adDescription}</Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu">{new Date(selectedAd.startDate).toLocaleDateString('vi-VN')}</Descriptions.Item>
                    <Descriptions.Item label="Ngày kết thúc">{new Date(selectedAd.endDate).toLocaleDateString('vi-VN')}</Descriptions.Item>
                    <Descriptions.Item label="Lượt click">{selectedAd.totalClick}</Descriptions.Item>
                    <Descriptions.Item label="Tổng chi phí">{formatPrice(selectedAd.cost)}</Descriptions.Item>
                    <Descriptions.Item label="Đường dẫn">
                        <a href={selectedAd.urlClick} target="_blank" rel="noopener noreferrer">
                            {selectedAd.urlClick}
                        </a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={statusAdvertisement.find(status => status.index === selectedAd.statusAd).tag} >
                            {statusAdvertisement.find(s => s.index === selectedAd.statusAd).des}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>
                <Divider />
                <p className="text-lg font-semibold mb-2">Ảnh quảng cáo:</p>
                <Image src={URL_SERVER + selectedAd.adPicture} alt="Ảnh quảng cáo" height={300} width="100%" className="object-cover" />
            </div>
        )}
    </Modal>
}
export default memo(ModalviewAdvertisement)