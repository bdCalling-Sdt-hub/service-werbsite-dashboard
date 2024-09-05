import { Outlet,useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect, useState } from "react";

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const navigate = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (!token) {
      navigate("/auth");
    }
  },[navigate])

  return (
    <div className="flex p-[32px] min-h-screen">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1">
        <div className="ml-[24px]">
          <Header toggleCollapsed={toggleCollapsed} collapsed={collapsed} />
        </div>
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
