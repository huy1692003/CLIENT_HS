import { memo } from "react";

// Component điều hướng carousel
const CarouselNavButton = ({ direction, onClick }) => (
    <button
        onClick={onClick}
        className={`absolute top-1/2 z-10 -translate-y-1/2 bg-white/70 p-2 ${
            direction === 'prev' ? 'left-0 rounded-r-lg' : 'right-0 rounded-l-lg'
        } hover:bg-white/90`}
    >
        <i className={`fa-solid fa-chevron-${direction === 'prev' ? 'left' : 'right'}`}></i>
    </button>
);

export default memo(CarouselNavButton);