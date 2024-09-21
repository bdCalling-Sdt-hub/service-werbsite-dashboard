import { ConfigProvider, DatePicker, Table, Space, Input, Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";
import { UserOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";

const Earnings = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }

    const url = buildUrl(baseURL + "/payments", {
      page: currentPage,
      startDate: filteredInfo.startDate,
      endDate: filteredInfo.endDate,
    });

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setData(data.data);
          setTotalData(data.pagination.totalData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [navigate, currentPage]);

  const columns = [
    {
      title: "Trx_ID",
      dataIndex: "transactionId",
    },
    {
      title: "Business Name",
      dataIndex: "business",
      render: (business) => business?.name,
    },
    {
      title: "Subscription Name",
      dataIndex: "subscription",
      render: (subscription) => subscription?.name,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (date) => date?.slice(0, 10),
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
  ];

  const { RangePicker } = DatePicker;
  const [filteredInfo, setFilteredInfo] = useState({
    name: null,
    startDate: null,
    endDate: null,
  });

  function buildUrl(base, params) {
    const query = Object.entries(params)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    return `${base}?${query}`;
  }

  async function filterData() {
    const params = {
      page: currentPage,
      startDate: filteredInfo.startDate,
      endDate: filteredInfo.endDate,
    };

    const url = buildUrl(baseURL + "/payments", params);

    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (data.ok) {
      setData(data.data);
      setTotalData(data.pagination.totalData);
    }
  }

  return (
    <div className=" ml-[24px]">
      <div className=" flex justify-between items-center">
        <h1 className="text-[30px] font-medium">All Earnings</h1>
        <Space size={20}>
          <RangePicker
            onChange={(_, dateString) =>
              setFilteredInfo({
                ...filteredInfo,
                startDate: dateString[0],
                endDate: dateString[1],
              })
            }
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
            onClick={filterData}
          />
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
            dataSource={data}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Earnings;
