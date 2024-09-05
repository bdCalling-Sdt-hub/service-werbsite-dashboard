import { LuBadgeDollarSign } from "react-icons/lu";
import { MdEmojiEvents } from "react-icons/md";
// import { FaUsers } from "react-icons/fa";
import { RiUserStarLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { baseURL } from "../config";
import { useNavigation } from "react-router-dom";

const Status = () => {
  const [totalEarning, setTotalEarning] = useState(0);
  const [totalService, setTotalService] = useState(0);
  const [totalProvider, setTotalProvider] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);

  const navigate = useNavigation();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    fetch(baseURL + "/payments/total", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setTotalEarning(data.data?.amount ?? 0);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(baseURL + "/services", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setTotalService(data?.pagination?.totalData??0);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(baseURL + "/users/total", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setTotalCustomer(data?.data?.totalCustomer??0);
          setTotalProvider(data?.data?.totalProvider??0);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="grid grid-cols-4 gap-[24px] mt-[24px]">
      <div className="bg-[white] shadow-xl px-[20px] py-[32px] flex justify-between items-center rounded-lg">
        <LuBadgeDollarSign
          size={81}
          color="white"
          className="bg-[#318130] p-[10px] rounded-2xl"
        />
        <div className="">
          <p className="">Total Earnings</p>
          <h1 className=" text-[44px]">{totalEarning}</h1>
        </div>
      </div>
      <div className="bg-[white] px-[20px] py-[32px] flex justify-between items-center rounded-lg shadow-xl">
        <FaUsers
          size={81}
          color="white"
          className="bg-[#1BC5BD] p-[10px] rounded-2xl"
        />
        <div className="">
          <p className="">Total Customer</p>
          <h1 className=" text-[44px]">{totalCustomer}</h1>
        </div>
      </div>
      <div className="bg-[white] px-[20px] py-[32px] flex justify-between items-center rounded-lg shadow-xl">
        <FaUsers
          size={81}
          color="white"
          className="bg-[#5EE46E] p-[10px] rounded-2xl"
        />
        <div className="">
          <p className="">Total Provider</p>
          <h1 className=" text-[44px]">{totalProvider}</h1>
        </div>
      </div>
      <div className="bg-[white] px-[20px] py-[32px] flex justify-between items-center rounded-lg shadow-xl">
        <RiUserStarLine
          size={81}
          color="white"
          className="bg-[#5F5CF1] p-[10px] rounded-2xl"
        />
        <div className="">
          <p className="">Total Services</p>
          <h1 className=" text-[44px]">{totalService}</h1>
        </div>
      </div>
    </div>
  );
};

export default Status;
