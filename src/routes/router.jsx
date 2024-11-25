import { createBrowserRouter } from "react-router-dom";
import Auth from "../layouts/Auth/Auth";
import LogIn from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import UpdatePassword from "../pages/Auth/UpdatePassword";
import Main from "../layouts/Main/Main";
import DashboardHome from "../pages/Main/DashboardHome/DashboardHome";
import AllClient from "../pages/Main/Customers/AllClient";
import AllEmployee from "../pages/Main/Providers/AllEmployee";
import ProfileInformation from "../pages/Main/ProfileInformation/ProfileInformation";
import EditProfileInformation from "../pages/Main/EditProfileInformation/EditProfileInformation";
import Settings from "../pages/Main/Settings/Settings";
import PrivacyPolicy from "../pages/Main/Settings/PrivacyPolicy";
import EditPrivacyPolicy from "../pages/Main/Settings/EditPrivacyPolicy";
import TearmsAndCondition from "../pages/Main/Settings/TearmsAndCondition";
import EditTramsAndCondition from "../pages/Main/Settings/EditTearmsAndCondition";
import AboutUs from "../pages/Main/Settings/AboutUs";
import EditAboutUs from "../pages/Main/Settings/EditAboutUs";
import Earnings from "../pages/Main/Earnings/Earnings";
import Services from "../pages/Main/Services/Services";
import Subscriptions from "../pages/Main/Subscriptions/Subscriptions";
import Communications from "../pages/Main/Communication/Communications";
import Notification from "../pages/Main/Notification/Notification.jsx";
import Review from "../pages/Main/Review/Review.jsx";
import Report from "../pages/Main/Report/Report.jsx";
import PaymentReport from "../pages/Main/payment-report/PaymentReport.jsx";
import CommunicationReport from "../pages/Main/communictionReport/CommunicationReport.jsx";
import Promotions from "../pages/Main/Promotions/Promotions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/notification",
        element: <Notification />,
      },
      {
        path: "/",
        element: <DashboardHome />,
      },
      {
        path: "/customers",
        element: <AllClient />,
      },
      {
        path: "/providers",
        element: <AllEmployee />,
      },
      {
        path: "/earnings",
        element: <Earnings />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/subscriptions",
        element: <Subscriptions />,
      },
      {
        path: "/reviews",
        element: <Review />,
      },
      {
        path: "/report",
        element: <Report />,
      },
      {
        path: "/payment-report",
        element: <PaymentReport />,
      },
      {
        path: "/communication-report",
        element: <CommunicationReport />,
      },
      {
        path: "/communications",
        element: <Communications />,
      },
      {
        path: "/promotions",
        element: <Promotions />,
      },
      {
        path: "/profile-information",
        element: <ProfileInformation />,
      },
      {
        path: "/edit-profile-information",
        element: <EditProfileInformation />,
      },
      // {
      //   path: "/matches/add-matches",
      //   element: <AddMatches/>,
      // },
      // {
      //   path: "/matches/edit-matches/:id",
      //   element: <EditMatches/>,
      // },

      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/settings/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/settings/edit-privacy-policy",
        element: <EditPrivacyPolicy />,
      },
      {
        path: "/settings/terms-and-conditions",
        element: <TearmsAndCondition />,
      },
      {
        path: "/settings/edit-terms-and-conditions",
        element: <EditTramsAndCondition />,
      },
      {
        path: "/settings/about-us",
        element: <AboutUs />,
      },
      {
        path: "/settings/edit-about-us",
        element: <EditAboutUs />,
      },

      // {
      //   path: "/settings/:settingType",
      //   element: <SettingDetail />,
      // },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <LogIn />,
      },
      // {
      //   path: "login",
      //   element: <Login />,
      // },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify",
        element: <VerifyOtp />,
      },
      {
        path: "update-password",
        element: <UpdatePassword />,
      },
    ],
  },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
]);

export default router;
