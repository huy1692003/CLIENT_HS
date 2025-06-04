import { Button, Descriptions, Modal, notification } from "antd";
import StepProcessBooking from "../shared/StepProcessBooking";
import bookingService from "../../services/bookingService";

const DetailBooking = ({data,handleModalClose,isModalVisible,refeshData}) => {
      async function confirmCheckIn(bookingID) {
        try {
            await bookingService.confirmCheckIn(bookingID);
            refeshData();
            notification.success({
                message: "Thành Công",
                description: `Xác nhận checkin đơn đặt phòng #${bookingID} thành công!`,
            });
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: `Có lỗi khi xác nhận checkin đơn đặt phòng #${bookingID}. Hãy thử lại sau!`,
            });
        }
    }
    async function confirmCheckOut(bookingID, jsonDetailExtraCost) {
        try {
            await bookingService.confirmCheckOut(bookingID, jsonDetailExtraCost);
            refeshData();
            notification.success({
                message: "Thành Công",
                description: `Xác nhận checkout đơn đặt phòng #${bookingID} thành công!`,
            });
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Lỗi",
                description: `Có lỗi khi xác nhận  checkout đơn đặt phòng #${bookingID}. Hãy thử lại sau!`,
            });
        }
    }
    return <>
        <Modal

            title={`Chi Tiết Đơn Đặt Phòng #${data?.bookingID}`}
            visible={isModalVisible}
            onCancel={handleModalClose}
            width={900}
            footer={[
                <Button key="close" onClick={handleModalClose}>
                    Đóng
                </Button>,
            ]}
        >
            {data && (
                <div className="flex justify-between ">
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Mã Đặt Phòng">
                            {data.bookingID}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã HomeStay">
                            {data.homeStayID}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên Khách">
                            {data.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {data.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số Điện Thoại">
                            {data.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số người lớn">
                            {data.numberAdults + " người"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số người trẻ em">
                            {data.numberChildren + " người"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số em bé">
                            {data.numberBaby + " người"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày Đến">
                            {new Date(data.checkInDate).toLocaleDateString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày Về">
                            {new Date(data.checkOutDate).toLocaleDateString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng Giá Tiền">
                            {`${data.totalPrice.toLocaleString()} VND`}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng Thái">
                            {getStatus(data.status)?.des || "Không xác định"}
                        </Descriptions.Item>
                    </Descriptions>
                    {data.isSuccess === 1 &&
                        <div className="mt-7">
                            <h3 className="text-xl font-bold mb-1">Thông tin chi tiết</h3>
                            <StepProcessBooking data={data} confirmCheckIn={confirmCheckIn} confirmCheckOut={confirmCheckOut} />
                        </div>}
                </div>


            )}
        </Modal>
    </>
}
export default DetailBooking;