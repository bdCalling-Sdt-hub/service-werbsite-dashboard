import { useState, useEffect } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";

const AboutUs = () => {
  const navigate = useNavigate();
  const [aboutUs, setAboutUs] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    fetch(baseURL + "/app-data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth");
          return;
        }

        return res.json();
      })
      .then((data) => {
        setAboutUs(data.siteData.about);
      });
  }, [navigate]);

  return (
    <div className="relative ml-[24px] ">
      <div className=" mt-[44px] cursor-pointer flex items-center pb-3 gap-2">
        <MdOutlineKeyboardArrowLeft
          className="text-black"
          onClick={() => navigate("/settings")}
          size={34}
        />
        <h1 className="text-[24px] text-primary font-semibold text-black">
          About Us
        </h1>
      </div>
      <div className=" text-justify mt-[24px] h-screen text-black">
        <p dangerouslySetInnerHTML={{ __html: aboutUs }} />
      </div>
      <Link
        to="/settings/edit-about-us"
        className="absolute text-center bottom-0 bg-gradient-to-r from-[#318130] via-[#318130] to-[#318130] 
        text-white  mt-5 py-3 rounded-lg w-full text-[18px] font-medium  duration-200"
      >
        Edit
      </Link>
    </div>
  );
};

export default AboutUs;
