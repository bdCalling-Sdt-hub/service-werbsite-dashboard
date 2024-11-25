import { useEffect, useState } from "react";
import {
  ConfigProvider,
  DatePicker,
  Table,
  Input,
  Button,
  Modal,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";
import { BsInfoCircle } from "react-icons/bs";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

export default function Promotions() {
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
    fetch(baseURL + "/promotions/all?page=" + currentPage, {
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
      title: "Business Name",
      dataIndex: "business",
      render: (business) => business?.name ?? "",
    },
    {
      title: "title",
      dataIndex: "title",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (text) => text + "%",
    },
    {
      title: "Start Date",
      dataIndex: "startAt",
      render: (date) => new Date(date).toDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endAt",
      render: (date) => new Date(date).toDateString(),
    },
    {
      title: "Apply Date",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toDateString(),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          onClick={() => {
            approve(record.id);
          }}
          className="bg-green-500 text-white"
        >
          Approve
        </Button>
      ),
    },
  ];

  async function approve(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    fetch(baseURL + "/promotions/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "PATCH",
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
          Swal.fire({
            icon: "success",
            title: "Promotion Approved",
            showConfirmButton: false,
            timer: 1500,
          });
          setCommunications(communications.filter((com) => com.id !== id));
        }
      });
  }

  return (
    <div className=" ml-[24px]">
      <div className=" flex justify-between items-center">
        <h1 className="text-[30px] font-medium">Pending promotions</h1>
        {/* <Space size={20}>
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
        </Space> */}
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
