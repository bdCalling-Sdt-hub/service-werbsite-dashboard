import { ConfigProvider, DatePicker, Space, Table, Input, Button, Modal } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";
import { BsInfoCircle } from "react-icons/bs";

export default function Communications() {
  const { RangePicker } = DatePicker;
  const [communications, setCommunications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [client, setClient] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    fetch(baseURL + "/communications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setCommunications(data.data);
        }
      });
  }, [navigate]);

  const columns = [
    {
      title: "ID",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Customer Name",
      dataIndex: "user",
      render: (user) => (user ? user.firstName + " " + user.lastName : "Guest User"),
    },
    {
      title: "Business Name",
      dataIndex: "business",
      render: (business) => business?.name ?? "",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => text?.slice(0, 10),
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      render: (text) => text?.slice(11, 19),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space size="middle">
          <BsInfoCircle
            onClick={() => {
              setClient(record);
              setIsModalOpen(true);
            }}
            size={18}
            className="text-[#318130] cursor-pointer"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className=" ml-[24px]">
      <div className=" flex justify-between items-center">
        <h1 className="text-[30px] font-medium">Communication List</h1>
        <Space size={20}>
          <RangePicker
          // onChange={(_, dateString) =>
          //   setFilteredInfo({
          //     ...filteredInfo,
          //     startDate: dateString[0],
          //     endDate: dateString[1],
          //   })
          // }
          />
          <Input
            placeholder="Search Customer"
            prefix={<UserOutlined />}
            // onChange={(e) =>
            //   setFilteredInfo({ ...filteredInfo, name: e.target.value })
            // }
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
            // onClick={filterData}
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
            }}
            columns={columns}
            dataSource={communications}
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
            Communication Details
          </p>
          <div className="p-[20px] text-white">
            <div className="flex justify-between border-b py-[16px]">
              <p>Customer Name:</p>
              <p>{client?.user?client.user.firstName+" "+client.user.lastName:"N/A"}</p>
            </div>
            <div className="flex justify-between border-b py-[16px] ">
              <p>Business Name:</p>
              <p>{client?.business.name}</p>
            </div>
            <div className="flex justify-between border-b py-[16px]">
              <p>Type:</p>
              <p>{client?.type}</p>
            </div>
            <div className="flex justify-between py-[16px]">
              <p>CreatedAt date:</p>
              <p>{client?.createdAt?.slice(0, 10)}</p>
            </div>
            <div className="flex justify-between py-[16px]">
              <p>UpdatedAt date:</p>
              <p>{client?.updatedAt?.slice(0, 10)}</p>
            </div>
            <div className="flex justify-between border-b py-[16px]">
              <p> Status:</p>
              <p>{client?.status}</p>
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
}
