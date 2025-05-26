import AmenitiesManager from "../pages/admin/AmenitiesManager/AmenitiesManager";
import ArticleManager from "../pages/admin/ArticleManager/ArticleManager";
import AdminstratorManager from "../pages/admin/AdminstratorManager/AdminstratorManager";
import CategoryArticleManager from "../pages/admin/CategoryArticleManager/CategoryArticleManager";
import HomeStayCensor from "../pages/admin/HomeStayCensor/HomeStayCensor";
import Login from "../pages/admin/Login/login";
import PartnershipRegManager from "../pages/admin/ParnershipRegManager/ParnershipRegManager";
import RoleManager from "../pages/admin/RoleManager/RoleManager";
import UserManager from "../pages/admin/UserManager/UserManager";
import AdminDashboard from "../pages/admin/Dashboard/dashboard";
import BookingManager from "../pages/owner/Booking/BookingManager";
import Overview from "../pages/owner/Dashboad/Overview";
import HomeStayManager from "../pages/owner/HomeStay/HomeStayManager";
import WriteHomeStay from "../pages/owner/HomeStay/WriteHomeStay";
import PromotionManager from "../pages/owner/Promotion/PromotionManager";
import About from "../pages/user/About";
import Article from "../pages/user/Article";
import Booking from "../pages/user/Booking";
import DetailArticle from "../pages/user/DetailArticle";
import DetailHomeStay from "../pages/user/DetailHomeStay";
import Favorites from "../pages/user/Favorites";
import HomePage from "../pages/user/HomePage";
import HomeStayOverview from "../pages/user/HomeStayOverview";
import LoginUser from "../pages/user/LoginUser";
import PartnerShipReg from "../pages/user/PartnerShipReg";
import ResultSearchHomeStay from "../pages/user/ResultSearchHomeStay";
import AdvetisementManager from "../pages/owner/Advertisement/AdvetisementManager";
import CreateAdvertisement from "../pages/owner/Advertisement/CreateAdvertisement";
import AdvertisementManager from "../pages/admin/AdvertisementManager/AdvertisementManager";
import BookingHistory from "../pages/user/BookingHistory";
import ReviewManager from "../pages/owner/ReviewManager";
import CheckoutManager from "../pages/owner/Checkout/CheckoutManager";
import CheckInManager from "../pages/owner/Checkin/CheckInManager";
import FAQManager from "../pages/admin/FAQManager";
import TransactionManager from "../pages/admin/TransactionManager";
import PaymentBooking from "../pages/owner/PaymentBooking";
import SupportCustomer from "../pages/owner/SupportCustomer";
import RevenueManager from "../pages/admin/RevenueManager";
import OwnerStayManager from "../pages/admin/OwnerStayManager";
import MenuManager from "../pages/admin/RoleManager/MenuManager";
import FAQ from "../pages/user/FAQ";
import BookingAction from "../pages/owner/Booking/BookingAction";
import ServiceHomestay from "../pages/owner/ServiceHomestay";

export const routers = [
    // customer
    { path: "/", element: <HomePage /> },
    { path: "/homestay", element: <HomeStayOverview /> },
    { path: "/login-user", element: <LoginUser /> },
    { path: "/detail-homestay", element: <DetailHomeStay /> },
    { path: "/article", element: <Article /> },
    { path: "/detail-article", element: <DetailArticle /> },
    { path: "/partnership-reg", element: <PartnerShipReg /> },
    { path: "/booking", element: <Booking /> },
    { path: "/favorites", element: <Favorites /> },
    { path: "/history-booking", element: <BookingHistory /> },
    { path: "/about", element: <About /> },
    { path: "/hoidap", element: <FAQ /> },
    { path: "/result-homestay-search", element: <ResultSearchHomeStay /> },
    { path: "/history-chat", element: <div className="p-5"> <SupportCustomer type={1} /></div> },
    { path: "/booking-action", element: <BookingAction /> },
    // admin
    { path: "/admin/user-manager", element: <UserManager /> },
    { path: "/admin/owner-manager", element: <OwnerStayManager /> },
    { path: "/admin/login", element: <Login /> },
    { path: "/admin/dashboard-overview", element: <AdminDashboard/> },
    { path: "/admin/partnership-manager", element: <PartnershipRegManager /> },
    { path: "/admin/amenities-manager", element: <AmenitiesManager /> },
    { path: "/admin/homestay-censor-pending", element: <HomeStayCensor status={0} /> },
    { path: "/admin/homestay-censor-current", element: <HomeStayCensor status={1} /> },
    { path: "/admin/homestay-censor-reject", element: <HomeStayCensor status={-1} /> },
    { path: "/admin/homestay-censor-maintenance", element: <HomeStayCensor status={2} /> },
    { path: "/admin/role-manager", element: <RoleManager /> },
    { path: "/admin/menu-manager", element: <MenuManager /> },
    { path: "/admin/customer-manager", element: <HomeStayCensor status={2} /> },
    { path: "/admin/article-manager", element: <ArticleManager /> },
    { path: "/admin/category-article-manager", element: <CategoryArticleManager /> },
    { path: "/admin/adminstrator-manager", element: <AdminstratorManager /> },
    { path: "/admin/advertisement-manager", element: <AdvertisementManager /> },
    { path: "/admin/FAQ-manager", element: <FAQManager /> },
    { path: "/admin/revenue-manager", element: <RevenueManager /> },
    { path: "/admin/transaction-management-booking", element: <TransactionManager type={1} /> },
    { path: "/admin/transaction-management-advertisement", element: <TransactionManager type={2} /> },
    // Owner Layout
    { path: "/owner/dashboard", element: <Overview /> },
    { path: "/owner/homestay-waiting", element: <HomeStayManager status={0} /> },
    { path: "/owner/homestay", element: <WriteHomeStay /> },
    { path: "/owner/promotion-manager", element: <PromotionManager /> },
    { path: "/owner/review-manager", element: <ReviewManager /> },
    { path: "/owner/homestay-current", element: <HomeStayManager status={1} /> },
    { path: "/owner/homestay-reject", element: <HomeStayManager status={-1} /> },
    { path: "/owner/homestay-maintenance", element: <HomeStayManager status={2} /> },
    { path: "/owner/booking-manager", element: <BookingManager /> },
    { path: "/owner/advertisement/write", element: <CreateAdvertisement /> },
    { path: "/owner/advertisement-manager", element: <AdvetisementManager /> },
    { path: "/owner/checkin-manager", element: <CheckInManager /> },
    { path: "/owner/checkout-manager", element: <CheckoutManager /> },
    { path: "/owner/history-payment-booking", element: <PaymentBooking /> },
    { path: "/owner/support-customer", element: <SupportCustomer type={2} /> },
    { path: "/owner/service-homestay-manager", element: <ServiceHomestay /> },


]   