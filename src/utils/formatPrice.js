export const formatPrice = (value) => {
    // Định dạng giá trị theo kiểu tiền tệ (VND)
    let formattedPrice = value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    // let formattedPrice = value.toLocaleString('vi-VN');

    
    return formattedPrice;
};
