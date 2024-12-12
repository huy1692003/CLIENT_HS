import { memo, useEffect, useState } from "react";
import { Table, Tag, Rate, Input, Button, DatePicker, Space } from "antd";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atom";
import reviewRatingService from "../../../services/reviewRatingService";
import dayjs from "dayjs";  // Thêm dayjs để xử lý ngày tháng
import { SearchOutlined } from "@ant-design/icons";

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
        rating: "",
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
            title: "Mã Đánh Giá",
            dataIndex: "reviewID",
            key: "reviewID",
            render: (text) => <span className="text-blue-500">{text}</span>,
        },
        {
            title: "Homestay ID",
            dataIndex: "homestayID",
            key: "homestayID",
        },
        {
            title: "Chất lượng",
            dataIndex: "rating",
            key: "rating",
            render: (rating) => (
                <>
                    <Rate disabled defaultValue={rating} /> | 
                    <span className="text-orange-600 text-base"> {rating} sao</span>
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
            render: (date) => <Tag color="green">{new Date(date).toLocaleDateString()}</Tag>,
        },
    ];

    return (
        <div className=" bg-gray-50 min-h-screen">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Quản Lý Đánh Giá</h1>
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700">Tìm theo Số Sao</label>
                    <Input
                        placeholder="Nhập số sao"
                        value={searchFields.rating}
                        onChange={(e) => handleSearchChange("rating", e.target.value)}
                    />
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
