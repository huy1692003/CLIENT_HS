import AmenitiesManager from "../pages/admin/AmenitiesManager/AmenitiesManager";
import  ArticleManager  from "../pages/admin/ArticleManager/ArticleManager";
import  CategoryArticleManager  from "../pages/admin/CategoryArticleManager/CategoryArticleManager";
import  HomeStayCensor  from "../pages/admin/HomeStayCensor/HomeStayCensor";
import  PartnershipRegManager  from "../pages/admin/ParnershipRegManager/ParnershipRegManager";
import  RoleManager  from "../pages/admin/RoleManager/RoleManager";
import  UserManager  from "../pages/admin/UserManager/UserManager";
import BookingManager from "../pages/owner/Booking/BookingManager";
import  Overview  from "../pages/owner/Dashboad/Overview";
import  HomeStayManager  from "../pages/owner/HomeStay/HomeStayManager";
import  WriteHomeStay  from "../pages/owner/HomeStay/WriteHomeStay";
import  PromotionManager  from "../pages/owner/Promotion/PromotionManager";
import About from "../pages/user/About";
import Article from "../pages/user/Article";
import  Booking  from "../pages/user/Booking";
import DetailArticle from "../pages/user/DetailArticle";
import  DetailHomeStay  from "../pages/user/DetailHomeStay";
import Favorites from "../pages/user/Favorites";
import  HomePage  from "../pages/user/HomePage";
import  HomeStayOverview  from "../pages/user/HomeStayOverview";
import  LoginUser  from "../pages/user/LoginUser";
import  PartnerShipReg  from "../pages/user/PartnerShipReg";
import  ResultSearchHomeStay  from "../pages/user/ResultSearchHomeStay";

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
    { path: "/about", element: <About /> },
    { path: "/result-homestay-search", element: <ResultSearchHomeStay /> },

    // admin
    { path: "/admin/user-manager", element: <UserManager /> },
    { path: "/admin/partnership-manager", element: <PartnershipRegManager /> },
    { path: "/admin/amenities-manager", element: <AmenitiesManager /> },
    { path: "/admin/homestay-censor-pending", element: <HomeStayCensor status={0} /> },
    { path: "/admin/homestay-censor-current", element: <HomeStayCensor status={1} /> },
    { path: "/admin/homestay-censor-reject", element: <HomeStayCensor status={2} /> },
    { path: "/admin/role-manager", element: <RoleManager /> },
    { path: "/admin/customer-manager", element: <HomeStayCensor status={2} /> },
    { path: "/admin/article-manager", element: <ArticleManager /> },
    { path: "/admin/category-article-manager", element: <CategoryArticleManager /> },

    // Owner Layout
    { path: "/owner/dashboard", element: <Overview /> },
    { path: "/owner/homestay-waiting", element: <HomeStayManager status={0} /> },
    { path: "/owner/homestay", element: <WriteHomeStay /> },
    { path: "/owner/promotion-manager", element: <PromotionManager /> },
    { path: "/owner/homestay-current", element: <HomeStayManager status={1} /> },
    { path: "/owner/homestay-reject", element: <HomeStayManager status={2} /> },
    { path: "/owner/booking-pending", element: <BookingManager status={0} /> },
    { path: "/owner/booking-waiting", element: <BookingManager status={1} /> },
    { path: "/owner/booking-success", element: <BookingManager status={2} /> },
    { path: "/owner/booking-reject", element: <BookingManager status={3} /> },


]   