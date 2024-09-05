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
    fetch(baseURL + "/payments?page="+currentPage, {
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
      title: "ID",
      dataIndex: "id",
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

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

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
      name: filteredInfo.name,
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
    if (data.payments) {
      if (data.redirect) navigate(data.redirect);
      setData(data.payments);
    }
  }

  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (filteredInfo.name) {
      fetch(
        baseURL + "/userSuggetion?type=PROVIDER&name=" + filteredInfo.name,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.users) setSuggestions(data.users);
        });
    } else {
      setSuggestions([]);
    }
  }, [filteredInfo.name]);

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
          <div className="relative z-50">
            <Input
              placeholder="Search Customer"
              prefix={<UserOutlined />}
              value={filteredInfo.name}
              onFocus={() => setIsFocused(true)}
              onBlur={() =>
                setTimeout(() => {
                  setIsFocused(false);
                }, 300)
              }
              onChange={(e) =>
                setFilteredInfo({ ...filteredInfo, name: e.target.value })
              }
            />
            {suggestions.length > 0 && isFocused && (
              <ul className="absolute z-100 top-[40px] bg-white w-full border border-gray-300 rounded-lg">
                {suggestions.map((suggestion) => (
                  <li
                    onClick={() =>
                      setFilteredInfo({
                        ...filteredInfo,
                        name: suggestion.name,
                      })
                    }
                    key={suggestion._id}
                    className="p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
