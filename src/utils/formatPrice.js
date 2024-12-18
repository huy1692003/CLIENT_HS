export const formatPrice = (value) => {
    // Định dạng giá trị theo kiểu tiền tệ (VND)
    let formattedPrice = value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    // Thay thế chữ 'đ' thành 'VNĐ'
    formattedPrice = formattedPrice.replace('₫', 'VNĐ');
    
    return formattedPrice;
};
