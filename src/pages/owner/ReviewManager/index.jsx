import { memo, useEffect, useState } from "react";
import { Table, Tag, Rate, Input, Button, DatePicker, Space, Select } from "antd";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import reviewRatingService from "../../../services/reviewRatingService";
import dayjs from "dayjs";  // Thêm dayjs để xử lý ngày tháng
import { SearchOutlined } from "@ant-design/icons";
import { convertDate, convertDateTime } from "../../../utils/convertDate";

const { RangePicker } = DatePicker;

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const [searchFields, setSearchFields] = useState({
        rating: 5,
        comment: "",
        reviewDate: [],
    });
    const owner = useRecoilValue(userState);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const data = await reviewRatingService.getReviewByOwner(owner.idOwner);
                setReviews(data);
                setFilteredReviews(data);
                setPagination((prev) => ({
                    ...prev,
                    total: data.length,
                }));
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu đánh giá:", error);
            } finally {
                setLoading(false);
            }
        };

        if (owner?.idOwner) {
            fetchReviews();
        }
    }, [owner]);

    console.log(reviews);
    const handleTableChange = (pagination) => {
        setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

    const handleSearchChange = (field, value) => {
        setSearchFields((prev) => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        const filtered = reviews.filter((review) => {
            const matchesRating = review.rating.toString().includes(searchFields.rating);
            const matchesComment = review.comment.toLowerCase().includes(searchFields.comment.toLowerCase());
            const matchesDate =
                searchFields.reviewDate.length === 0 ||
                (dayjs(review.reviewDate).isAfter(searchFields.reviewDate[0], "day") &&
                    dayjs(review.reviewDate).isBefore(searchFields.reviewDate[1], "day"));
            return matchesRating && matchesComment && matchesDate;
        });
        setFilteredReviews(filtered);
        setPagination((prev) => ({
            ...prev,
            total: filtered.length,
            current: 1,
        }));
    };

    const paginatedData = filteredReviews.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
    );

    const columns = [
       
        {
            title: "Mã Homestay",
            dataIndex: "homestayID",
            key: "homestayID",
        },
        {
            title: "Chất lượng",
            dataIndex: "rating",
            key: "rating",
            render: (rating) => (
                <>
                    <Rate disabled defaultValue={rating} /> 
                </>
            ),
        },
        {
            title: "Nội dung đánh giá",
            dataIndex: "comment",
            key: "comment",
            render: (comment) => <span className="text-gray-700">{comment}</span>,
        },
        {
            title: "Ngày Đánh Giá",
            dataIndex: "reviewDate",
            key: "reviewDate",
            render: (date) => <Tag color="green">{convertDate(date)}</Tag>,
        },
    ];

    return (
        <div className=" bg-gray-50 min-h-screen">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Quản Lý Đánh Giá</h1>
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700">Tìm theo Số Sao</label>
                    <Select
                        placeholder="Chọn số sao"
                        value={searchFields.rating}
                        className="w-full"
                        onChange={(value) => handleSearchChange("rating", value)}
                    >
                        <Select.Option value={1}>Từ 1 sao đến 2 sao</Select.Option>
                        <Select.Option value={2}>Từ 2 sao đến 3 sao</Select.Option>
                        <Select.Option value={3}>Từ 3 sao đến 4 sao</Select.Option>
                        <Select.Option value={4}>Từ 4 sao đến 5 sao</Select.Option>
                        <Select.Option value={5}>Từ 5 sao</Select.Option>
                    </Select>
                    
                </div>
                <div>
                    <label className="block text-gray-700">Tìm theo Nội dung đánh giá</label>
                    <Input
                        placeholder="Nhập nội dung đánh giá"
                        value={searchFields.comment}
                        onChange={(e) => handleSearchChange("comment", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Tìm theo khoảng thời gian</label>
                    <RangePicker
                        format="DD/MM/YYYY"
                        value={searchFields.reviewDate}
                        onChange={(dates) => handleSearchChange("reviewDate", dates)}
                    />
                </div>
                <Button icon={<SearchOutlined/>} type="primary" onClick={handleSearch} className="self-end font-semibold">
                    Tìm kiếm
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={paginatedData}
                loading={loading}
                rowKey={(record) => record.reviewID}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
                bordered
                className="shadow-md bg-white pr-2  "
            />
        </div>
    );
};

export default memo(ReviewManager);
