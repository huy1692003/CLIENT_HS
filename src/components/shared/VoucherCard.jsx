import React, { memo, useState } from 'react';
import { convertDateTime } from '../../utils/convertDate'; // Giả sử bạn có hàm convertDateTime để chuyển đổi định dạng ngày

const VoucherCard = ({ voucher }) => {
    const { discountCode, discountAmount, description, startDate, endDate } = voucher;

    // Trạng thái để theo dõi văn bản hiển thị
    const [copiedText, setCopiedText] = useState('Sao chép');

    // Hàm sao chép mã giảm giá
    const handleCopy = () => {
        navigator.clipboard.writeText(discountCode)  // Sao chép discountCode vào clipboard
            .then(() => {
                setCopiedText('Đã sao chép');  // Cập nhật trạng thái khi sao chép thành công
                setTimeout(() => setCopiedText('Sao chép'), 2000);  // Sau 2 giây, đổi lại thành "Sao chép"
            })
            .catch((err) => {
                console.error('Sao chép thất bại: ', err);
            });
    };

    return (
        <div title={"Nhân dịp :" + description} className="w-[350px] h-[150px] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg flex items-center p-4">
            <div className="flex flex-col justify-between w-full">
                {/* Phần hiển thị mã giảm giá và phần mô tả */}
                <div className="flex ">
                    <span className="text-3xl font-bold">{discountAmount.toLocaleString()} VNĐ</span>
                </div>
                <span className="text-lg uppercase font-semibold">CODE - #{discountCode}</span>
                <div className="mt-2 text-sm font-light">
                    <span>{description}</span>
                </div>
                {/* Phần hiển thị thời gian hiệu lực */}
                <div className="mt-2 text-xs">
                    <p>Start: {convertDateTime(startDate)}</p>
                    <p>End: {convertDateTime(endDate)}</p>
                </div>
            </div>
            {/* Phần bên phải voucher với chức năng sao chép */}
            <div
                onClick={handleCopy}  // Thêm sự kiện click vào div sao chép
                className="ml-4 w-[50px] h-full bg-white text-black rounded-lg flex text-center items-center justify-center text-xs uppercase cursor-pointer"
            >
                <span className='font-semibold'>{copiedText}</span>  {/* Hiển thị văn bản dựa trên trạng thái */}
            </div>
        </div>
    );
};

export default memo(VoucherCard);
