import {
    ConfigProvider,
    DatePicker,
    Space,
    Table,
    Input,
    Button,
    Modal,
  } from "antd";
  import { UserOutlined, SearchOutlined } from "@ant-design/icons";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { baseURL } from "../../../config";
  import { BsInfoCircle } from "react-icons/bs";
  import Swal from "sweetalert2";
  
  export default function Review() {
    const { RangePicker } = DatePicker;
    const [communications, setCommunications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalData, setTotalData] = useState(0);
    const [client, setClient] = useState();
  
    const navigate = useNavigate();
    useEffect(() => {
      setCommunications([]);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
      }
      fetch(baseURL + "/reviews/all?page=" + currentPage, {
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
        title: "ID",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Customer Name",
        dataIndex: "user",
        render: (user) =>
          user ? user.firstName + " " + user.lastName : "Guest User",
      },
      {
        title: "Business Name",
        dataIndex: "business",
        render: (business) => business?.name ?? "",
      },
      {
        title:"Rating",
        dataIndex: "rating",
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
          <h1 className="text-[30px] font-medium">Reviews List</h1>
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
        <Modal
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          footer={[]}
          closeIcon
        >
          <div>
            <p className="font-medium text-white text-center p-4 border-b-2">
              Review Details
            </p>
            <div className="p-[20px] text-white">
              <div className="flex justify-between border-b py-[16px]">
                <p>Customer Name:</p>
                <p>
                  {client?.user
                    ? client.user.firstName + " " + client.user.lastName
                    : "N/A"}
                </p>
              </div>
              <div className="flex justify-between border-b py-[16px] ">
                <p>Business Name:</p>
                <p>{client?.business.name}</p>
              </div>
              <div className="flex justify-between border-b py-[16px]">
                <p>Rating:</p>
                <p>{client?.rating}</p>
              </div>
              <div className="flex justify-between border-b py-[16px]">
                <p>Message:</p>
                <p>{client?.message}</p>
              </div>
              <div className="flex justify-between border-b py-[16px]">
                <p>Date:</p>
                <p>{client?.createdAt?.slice(0, 10)}</p>
              </div>
              <div className="flex justify-between border-b py-[16px]">
                <p>Time:</p>
                <p>{client?.createdAt?.slice(11, 19)}</p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
  