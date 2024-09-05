import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { BiSolidDashboard } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi";
import { BsCalendar2, BsDot } from "react-icons/bs";
import { BiDollarCircle } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { HiLogout } from "react-icons/hi";
import { TbLogout2, TbTargetArrow } from "react-icons/tb";
import { FaCalendarDays, FaHandHoldingMedical } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaRegClipboard } from "react-icons/fa6";
import { FaClipboardCheck } from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { Menu } from "antd";
import { useState } from "react";

import { FaUser } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import { AiOutlineDollarCircle } from "react-icons/ai";
import Swal from "sweetalert2";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Sidebar = ({ collapsed }) => {
  const [mode, setMode] = useState("inline");
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const handleLogOut = () => {
    // localStorage.removeItem('token')
    // localStorage.removeItem('login-user')
    // localStorage.removeItem('user-update')
  };

  const logout = () => {
    Swal.fire({
      title: "Do you want to Logout from here?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");

        navigate("/auth");
      }
    });
  };

  const items = [
    getItem(
      <p onClick={(e) => navigate("/")} className="text-[20px] leading-normal">
        Dashboard
      </p>,
      "1",
      <BiSolidDashboard style={{ fontSize: "24px" }} />
    ),
    getItem(
      <p
        onClick={(e) => navigate("/customers")}
        className="text-[18px] leading-normal"
      >
        Customers
      </p>,
      "2",
      <FaUsers style={{ fontSize: "24px" }} />
    ),

    getItem(
      <p
        onClick={(e) => navigate("/providers")}
        className="text-[18px] leading-normal"
      >
        Providers
      </p>,
      "3",
      <FaUser style={{ fontSize: "24px" }} />
    ),

    getItem(
      <p
        onClick={(e) => navigate("/earnings")}
        className="text-[18px] leading-normal"
      >
        Earnings
      </p>,
      "4",
      <AiOutlineDollarCircle style={{ fontSize: "24px" }} />
    ),
    getItem(
      <p
        onClick={(e) => navigate("/services")}
        className="text-[18px] leading-normal"
      >
        Services
      </p>,
      "5",
      <FaRegCopy style={{ fontSize: "24px" }} />
    ),
    getItem(
      <p
        onClick={(e) => navigate("/subscriptions")}
        className="text-[18px] leading-normal"
      >
        Subscriptions
      </p>,
      "6",
      <FaRegCopy style={{ fontSize: "24px" }} />
    ),
    getItem(
      <p
        onClick={(e) => navigate("/communications")}
        className="text-[18px] leading-normal"
      >
        Communications
      </p>,
      "7",
      <FaRegCopy style={{ fontSize: "24px" }} />
    ),
    // getItem(
    //   <p
    //     // onClick={(e) => navigate("/appointments")}
    //     className="text-[18px] leading-normal"
    //   >
    //     Communication
    //   </p>,
    //   "7",
    //   <FaRegClipboard  style={{ fontSize: "24px" }} />,
    //    [
    //     getItem(
    //       <li
    //         onClick={(e) => navigate("/communication/messages")}
    //         className="text-[18px] leading-normal"
    //       >
    //         Messages
    //       </li>,
    //       "8"
    //     ),
    //     getItem(
    //       <li
    //         onClick={(e) => navigate("/communication/calls")}
    //         className="text-[18px] leading-normal"
    //       >
    //         Calls
    //       </li>,
    //       "9"
    //     ),
    //   ]

    // ),

    getItem(
      <p
        onClick={(e) => navigate("/settings")}
        className="text-[18px] leading-normal"
      >
        Settings
      </p>,
      "10",
      <CiSettings style={{ fontSize: "24px" }} />
    ),
    getItem(
      <p onClick={logout} className="text-[18px] leading-normal">
        Logout
      </p>,
      "11",
      <MdLogout style={{ fontSize: "24px" }} />
    ),
  ];

  return (
    <div className="w-[300px] flex flex-col justify-between bg-[#318130] min-h-screen rounded-lg">
      <div className="">
        <div className="p-[32px]">
          <img src={logo} alt="" />
        </div>

        {/* this  */}

        <Menu
          style={{ width: "295px" }}
          className={`w-[300px] p-[10px] bg-[#318130] `}
          defaultSelectedKeys={["1"]}
          mode={mode}
          theme={theme}
          items={items}
          inlineCollapsed={collapsed}
        />
      </div>
      <div className="mb-[32px]">
        {/* <div
          onClick={handleLogOut}
          className="flex items-center ml-[18px] cursor-pointer gap-2 text-[white] font-medium"
        >
          <HiLogout width={25} height={25} />
          <span className="text-[20px] ">Log Out</span>
        </div> */}
        {/* <Link to="/" className="flex items-center ml-[18px] cursor-pointer gap-2 text-[#3BA6F6] font-medium">
            
          </Link> */}
      </div>
    </div>
  );
};

export default Sidebar;
