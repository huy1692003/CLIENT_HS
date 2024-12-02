import { Button, Image, Result } from "antd";
import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

 const NotFoundPage = () => {
    const navigate = useNavigate()
    return (
        <>
            <Result

                status="404"
                title={<p className="text-2xl font-bold">404 Page Not Found</p>}
                subTitle={<h3 className="text-xl font-bold">Rất tiếc , địa chỉ bạn đang truy cấp không tồn tại hãy thử lại sau !</h3>}
                extra={<Button type="primary" onClick={() => navigate(-1)}>Quay lại</Button>}
            />
        </>
    );
};
export default memo(NotFoundPage)