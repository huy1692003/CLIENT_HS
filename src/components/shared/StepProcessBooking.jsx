import { memo } from "react"
import { convertDateTime } from "../../utils/convertDate"
import { CheckCircleOutlined, CheckOutlined, DownSquareFilled, HomeOutlined, Loading3QuartersOutlined } from "@ant-design/icons"
import { Button, Steps, Tag } from "antd"

const StepProcessBookingOwner = ({ selectedBooking, confirmCheckIn, confirmCheckOut }) => {
    return (
        <Steps
            direction="vertical"
            size="small"
            className="mt-10"
            current={selectedBooking?.status-1}
            items={[
                {
                    title: 'Tiếp nhận đơn đặt phòng',
                    description: "Đã tiếp nhận ngày : " + convertDateTime(selectedBooking?.bookingProcess.timeConfirm),
                 
                    icon: <DownSquareFilled />,

                },
                {
                    title: 'Thanh toán tiền phòng',
                    description: selectedBooking?.status<=2 ? <>Chưa thanh toán</> : <>{"Đã thanh toán ngày : " + convertDateTime(selectedBooking?.bookingProcess.paymentTime)}</>,
                    icon: <CheckCircleOutlined />,
                },
                {
                    title: 'Chờ nhận phòng',
                    icon: <Loading3QuartersOutlined />,
                },
                {
                    title: 'Check-in',
                    description: selectedBooking?.bookingProcess.checkInTime && < >Đã nhận phòng vào lúc : {convertDateTime(selectedBooking?.bookingProcess.checkInTime)}</>,
                    subTitle: selectedBooking?.status === 4 ? <Button onClick={() => confirmCheckIn(selectedBooking?.bookingID)} >Xác nhận khách đã nhận phòng </Button> : "",
                    icon: <HomeOutlined />,
                },
                {
                    title: 'Check-out',
                    description: selectedBooking?.bookingProcess.checkOutTime && < >Đã trả phòng vào lúc : {convertDateTime(selectedBooking?.bookingProcess.checkOutTime)}</>,
                    subTitle: selectedBooking?.status === 5 ? <Button onClick={() => confirmCheckOut(selectedBooking?.bookingID)}>Xác nhận khách đã trả phòng </Button> : "",
                    icon: <CheckOutlined />,
                },
                {
                    title: 'Hoàn thành',
                    description: 'Quy trình thuê phòng đã hoàn tất',
                    icon: <CheckCircleOutlined />,
                },
            ]}
        />
    )
}

export default memo(StepProcessBookingOwner)