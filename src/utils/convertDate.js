import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Chuyển đổi ngày về định dạng DD/MM/YYYY
 * @param {string | Date} date - Ngày cần chuyển đổi
 * @returns {string} Ngày theo định dạng DD/MM/YYYY
 */
export const convertDate = (date) => {
    const dateObj = new Date(date);

    // Lấy ngày, tháng và năm từ đối tượng Date
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Chuyển đổi ngày giờ về định dạng DD/MM/YYYY HH:mm:ss
 * @param {string | Date} date - Ngày giờ cần chuyển đổi
 * @returns {string} Ngày giờ theo định dạng DD/MM/YYYY HH:mm:ss
 */
export const convertDateTime = (date) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
};

/**
 * Chuyển đổi giá trị ngày giờ về định dạng ISO 8601 theo múi giờ Việt Nam
 * @param {string | Date | dayjs} date - Giá trị ngày giờ từ DatePicker (dayjs object)
 * @returns {string} Chuỗi ngày giờ theo định dạng ISO 8601 (UTC+7)
 */
export const convertTimezoneToVN = (date) => {
    return dayjs(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss');
};
