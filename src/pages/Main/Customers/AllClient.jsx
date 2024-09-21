import {
  ConfigProvider,
  DatePicker,
  Modal,
  Space,
  Table,
  Input,
  Button,
} from "antd";
import { useEffect, useState } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";
import { UserOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const AllClient = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [client, setClient] = useState();
  const [customers, setCustomers] = useState([{}]);
  const [totalData, setTotalData] = useState(0);
  const [filteredInfo, setFilteredInfo] = useState({
    name: null,
    startDate: null,
    endDate: null,
  });

  const handleView = (value) => {
    setClient(value);
    setIsModalOpen(true);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    const url = buildUrl(baseURL + "/users", {
      type: "CUSTOMER",
      page: currentPage,
      name: filteredInfo.name,
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
          setCustomers(data.data);
          setTotalData(data.pagination.totalData);
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Please try again later",
        });
      });
  }, [navigate, currentPage]);

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "mobile",
    },
    {
      title:"status",
      dataIndex: "isDeleted",
      render: (status) => status ? "Inactive" : "Active",
    },
    {
      title: "Join Date",
      dataIndex: "createdAt",
      render: (text) => text?.slice(0, 10),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space size="middle">
          <BsInfoCircle
            onClick={() => handleView(record)}
            size={18}
            className="text-[#318130] cursor-pointer"
          />

          {/* <a><RxCross2 size={18} className='text-[red]'/></a> */}
        </Space>
      ),
    },
  ];

  const { RangePicker } = DatePicker;

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
      type: "CUSTOMER",
      page: currentPage,
      name: filteredInfo.name,
      startDate: filteredInfo.startDate,
      endDate: filteredInfo.endDate,
    };

    const url = buildUrl(baseURL + "/users", params);

    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json();
    if (data.ok) {
      setCustomers(data.data);
      setTotalData(data.pagination.totalData);
    }
  }

  return (
    <div className=" ml-[24px]">
      <div className=" flex justify-between items-center">
        <h1 className="text-[30px] font-medium">Customer List</h1>
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
          <Input
            placeholder="Search Customer"
            prefix={<UserOutlined />}
            onChange={(e) =>
              setFilteredInfo({ ...filteredInfo, name: e.target.value })
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
            dataSource={customers}
          />
        </ConfigProvider>
      </div>
      <Modal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        closeIcon
      >
        <div>
          <p className="font-medium text-white text-center p-4 border-b-2">
            Customer Details
          </p>
          <div className="p-[20px] text-white">
            <div className="flex justify-between border-b py-[16px]">
              <p>Customer Name:</p>
              <p>{client?.firstName + " " + client?.lastName}</p>
            </div>
            <div className="flex justify-between border-b py-[16px] ">
              <p>Email:</p>
              <p>{client?.email}</p>
            </div>
            <div className="flex justify-between border-b py-[16px]">
              <p>Phone number:</p>
              <p>{client?.mobile}</p>
            </div>
            <div className="flex justify-between py-[16px]">
              <p>Joining date:</p>
              <p>{client?.createdAt?.slice(0, 10)}</p>
            </div>
            <div className="flex items-center justify-center mt-5">
              <button
                className="py-3 px-7 rounded-xl bg-red-300 text-red-500"
                onClick={() => {
                  fetch(baseURL + "/users/" + client.id, {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      if (res.ok) {
                        Swal.fire({
                          icon: "success",
                          title: "Success",
                          text: "User deleted successfully",
                        });
                        window.location.reload();
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: "Something went wrong! Please try again later",
                        });
                      }
                    });
                }}
              >
                Delete
              </button>
            </div>
            {/* <div className="flex items-center justify-center mt-5">
              <button className="py-3 px-7 rounded-xl bg-red-300 text-red-500">
                Delete Customer
              </button>
            </div> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AllClient;
