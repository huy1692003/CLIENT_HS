import React, { memo, useMemo } from 'react';
import { Card, Button, Image, Tag } from 'antd';
import { URL_SERVER } from '../../constant/global';

const CardRoom = ({ room, ButtonAction }) => {
    return (
        <Card
            title={<h2 className="text-lg font-semibold text-gray-800">{"Phòng: " + room.roomName}</h2>}
            className='mb-6 shadow-sm hover:shadow-md transition-shadow duration-300'
            extra={
                <div className="flex gap-2">
                    {ButtonAction}
                </div>
            }
        >
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/3">
                    <div className="relative h-48 md:h-56 lg:h-64 w-full overflow-hidden rounded-xl">
                        <Image
                            src={URL_SERVER + room.roomImage?.split(',')[0]}
                            alt={room.roomName}
                            className="object-cover rounded-xl hover:scale-105 transition-transform duration-300"
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                            preview={true}
                            width="95%"
                            height="100%"
                        />
                    </div>
                </div>
                <div className="w-full lg:w-2/3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-home text-blue-500"></i>
                            <p><span className="font-medium">Loại phòng:</span> {room.roomType}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-ruler-combined text-green-500"></i>
                            <p><span className="font-medium">Diện tích:</span> {room.roomSize} m²</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-money-bill-wave text-yellow-500"></i>
                            <p><span className="font-medium">Giá/đêm:</span> {room.pricePerNight.toLocaleString()} VNĐ</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-money-bill-wave text-yellow-500"></i>
                            <p><span className="font-medium">Giá/đêm từ ngày thứ 2:</span> {room.priceFromSecondNight.toLocaleString()} VNĐ</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-bed text-purple-500"></i>
                            <p><span className="font-medium">Số giường:</span> {room.bedCount}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-bath text-cyan-500"></i>
                            <p><span className="font-medium">Phòng tắm:</span> {room.bathroomCount}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-user text-indigo-500"></i>
                            <p><span className="font-medium">Người lớn:</span> {room.maxAdults}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-child text-pink-500"></i>
                            <p><span className="font-medium">Trẻ em:</span> {room.maxChildren}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-baby text-orange-500"></i>
                            <p><span className="font-medium">Em bé:</span> {room.maxBaby}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-baby text-orange-500"></i>
                            <Tag color={room.status === 0 ? "red" : "green"}><span className="font-medium">Trạng thái:</span> {room.status === 0 ? "Không hoạt động" : "Hoạt động"}</Tag>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="font-medium text-gray-700 mb-2">Tiện nghi phòng:</p>
                        <div className="flex flex-wrap gap-2">
                            {room.hasBalcony && <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-door-open mr-1"></i>Ban công</span>}
                            {room.hasTv && <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-tv mr-1"></i>TV</span>}
                            {room.hasAirConditioner && <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-wind mr-1"></i>Điều hòa</span>}
                            {room.hasRefrigerator && <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-snowflake mr-1"></i>Tủ lạnh</span>}
                            {room.hasWifi && <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-wifi mr-1"></i>Wifi</span>}
                            {room.hasHotWater && <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs flex items-center"><i className="fas fa-hot-tub mr-1"></i>Nước nóng</span>}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
export default memo(CardRoom)