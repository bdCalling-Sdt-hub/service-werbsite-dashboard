import {
  ConfigProvider,
  DatePicker,
  Space,
  Table,
  Input,
  Button,
} from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";

export default function Referral() {
  const { RangePicker } = DatePicker;
  const [communications, setCommunications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    setCommunications([]);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    fetch(baseURL + "/referrals/refers?page=" + currentPage, {
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
          setCommunications(data.data);
          setTotalData(data.pagination.totalData);
        }
      });
  }, [navigate, currentPage]);

  const columns = [
    {
      title: "SL No",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      render: (user) => user.firstName + " " + user.lastName,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Total Referrals",
      dataIndex: "_count",
      render: (count) => count.Referrals,
    },
  ];

  return (
    <div className=" ml-[24px]">
      <div className=" flex justify-between items-center">
        <h1 className="text-[30px] font-medium">Referrals List</h1>
        <Space size={20}>
          <RangePicker />
          <Input placeholder="Search Customer" prefix={<UserOutlined />} />
          <Button type="primary" shape="circle" icon={<SearchOutlined />} />
        </Space>
      </div>
      <div className=" rounded-t-lg mt-[24px] shadow-2xl">
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#318130",
                headerColor: "white",
                headerBorderRadius: 2,
              },
            },
          }}
        >
          <Table
            pagination={{
              position: ["bottomCenter"],
              current: currentPage,
              onChange: (page) => setCurrentPage(page),
              total: totalData,
              pageSize: 10,
            }}
            columns={columns}
            dataSource={communications}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
