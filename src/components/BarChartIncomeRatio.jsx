import { DatePicker } from "antd";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { baseURL } from "../config";
import { useNavigate } from "react-router-dom";

const BarChartIncomeRatio = () => {
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    fetch(baseURL + "/payments/chart", {
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
          setData(
            data.data.map(({ month, totalAmount }) => ({
              name: month,
              uv: totalAmount,
            }))
          );
        }
      });
  }, [navigate]);

  const onChange = (_, dateString) => {
    fetch(baseURL + "/payments/chart?year=" + dateString, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          setData(
            data.data.map(({ month, totalAmount }) => ({
              name: month,
              uv: totalAmount,
            }))
          );
        }
      });
  };
  return (
    <div className="w-4/5 text-white  h-[318px] mt-5 rounded-xl shadow-2xl ">
      <div className="flex justify-between p-[16px] border-b-2">
        <div>
          <h1 className="text-[20px] text-black font-medium">Income Ratio</h1>
        </div>
        <div className="">
          <DatePicker
            className="custom-date-picker"
            onChange={onChange}
            picker="year"
            suffixIcon
          />
        </div>
      </div>
      <div className="mt-2">
        <BarChart
          width={1250}
          height={230}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ stroke: "black", strokeWidth: 0.5 }} />
          <YAxis tick={{ stroke: "black", strokeWidth: 0.5 }} />
          <Bar
            dataKey="uv"
            fill="#318130"
            barSize={30}
            // activeBar={<Rectangle fill="pink" stroke="green" />}
          />
          {/* <Bar
              dataKey="ThisMonth"
              fill="#54A630"
              barSize={6}
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            /> */}
        </BarChart>
      </div>
    </div>
  );
};

export default BarChartIncomeRatio;
