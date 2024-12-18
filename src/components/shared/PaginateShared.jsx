import { Pagination } from "antd";
import { memo } from "react";

/**
 * Component PaginateShared
 * 
 * Component này xử lý phân trang để hiển thị dữ liệu trên frontend.
 * Sử dụng component `Pagination` của Ant Design để cho phép người dùng điều hướng qua các trang.
 * 
 * @param {Object} props - Các thuộc tính được truyền vào component.
 * @param {function} setPaginate - Hàm dùng để cập nhật trạng thái phân trang (từ component cha).
 * @param {number} page - Số trang hiện tại đang hiển thị.
 * @param {number} pageSize - Số lượng mục hiển thị trên mỗi trang.
 * @param {number} total - Tổng số lượng mục có thể phân trang.
 * 
 * Tính năng:
 * - Cho phép thay đổi trang và cập nhật số trang trong component cha.
 * - Hiển thị các điều khiển phân trang bao gồm: `trang hiện tại`, `kích thước trang`, và `tổng số mục`.
 * - Cung cấp tính năng "nhảy nhanh" giữa các trang.
 * - Tính năng thay đổi số mục mỗi trang (`showSizeChanger`) bị tắt, do đó số lượng mục mỗi trang là cố định.
 * 
 * Tối ưu:
 * - Được bao bọc trong `memo` để tránh việc render lại không cần thiết khi các props không thay đổi.
 */

const PaginateShared = ({ setPaginate, page, align="center", pageSize, totalRecord }) => {
    const onPageChange = (page) => {
        setPaginate(prev => ({ ...prev, page })); // Cập nhật trang khi người dùng thay đổi
    };
    const onPageSizeChange = (current, size) => {
        setPaginate(prev => ({ ...prev, page: 1, pageSize: size })); // Khi thay đổi kích thước trang, quay lại trang 1
    };
    return (
        <>
            <Pagination
                className="text-lg mt-[25px] "
                align={align}
                size="default"
                responsive={true}
                showLessItems={true}
                current={page}
                pageSize={pageSize}
                total={totalRecord} // Tổng số mục trả về từ API
                onChange={onPageChange} // Xử lý thay đổi trang
                showSizeChanger={true} // 
                onShowSizeChange={onPageSizeChange} 
                pageSizeOptions={[10,20, 50, 100, 200, 500]}
                
            />
        </>
    );
};

export default memo(PaginateShared);
