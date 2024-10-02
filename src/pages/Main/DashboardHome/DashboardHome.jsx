import React from "react";
import Status from "../../../components/status";
import BarChartIncomeRatio from "../../../components/BarChartIncomeRatio";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseURL } from "../../../config";

const DashboardHome = () => {
  const [customers, setCustomers] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    fetch(baseURL + "/users?type=CUSTOMER&limit=5", {
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
        if (data.ok) {
          setCustomers(data.data);
        }
      });
  }, [navigate]);

  return (
    <div className="ml-[24px]">
      <h1 className="text-[44px] ">Overview</h1>
      <Status />
      <div className="flex w-full gap-5">
        <BarChartIncomeRatio />
        <div className="flex flex-col gap-4 w-1/5 shadow-xl p-4 rounded-lg">
          <h6 className="text-xl mt-7 font-medium">Recent Customers</h6>
          {customers.map((customer) => (
            <div className="flex items-center gap-2" key={customer.id}>
              <img
                src={
                  customer.image ? baseURL + "/" + customer.image : "/user.png"
                }
                alt={customer.firstName + " " + customer.lastName}
                className="w-10 h-10 rounded-full"
              />
              <p>{customer.firstName + " " + customer.lastName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
