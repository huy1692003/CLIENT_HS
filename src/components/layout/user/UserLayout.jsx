import { memo } from "react";
import Header from '../../layout/user/Header'
import Footer from '../../layout/user/Footer'
const UserLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <main style={{ margin: "20px 10px" }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};
export default memo(UserLayout)