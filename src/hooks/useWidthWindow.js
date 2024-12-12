import { useState, useEffect } from 'react';

const useWidthWindow = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        // Hàm xử lý khi thay đổi kích thước màn hình
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Thêm event listener
        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowWidth;
};

export default useWidthWindow;