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
import { IoReloadOutline } from "react-icons/io5";

export default function Communications() {
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
    fetch(baseURL + "/communications?page=" + currentPage, {
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
      title: "Type",
      dataIndex: "type",
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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [processDone, setProcessDone] = useState(0);
  const [processing, setProcessing] = useState(false);

  async function handelSendEmail(id) {
    const res = await fetch(baseURL + "/communications/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
        if (res.status === 401) {
localStorage.removeItem("token");
          navigate("/auth");
          return;
        }

        return res.json();
      });

    Swal.fire({
      icon: res.ok ? "success" : "error",
      title: res.message,
      showConfirmButton: false,
      timer: 1500,
    });

    return res.ok;
  }

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
      <div className=" rounded-t-lg mt-[24px] shadow-2xl p-6">
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
            dataSource={communications.map((communication) => ({
              ...communication,
              key: communication.id,
            }))}
            rowSelection={{
              selectedRowKeys,
              onChange: (key) => setSelectedRowKeys(key),
            }}
          />
        </ConfigProvider>
        {selectedRowKeys.length > 0 && (
          <button
            className="px-4 py-2 text-white bg-green-600 rounded"
            onClick={async () => {
              setProcessing(true);
              for (let id of selectedRowKeys) {
                const done = await handelSendEmail(id);
                if (done) {
                  setProcessDone((prev) => prev + 1);
                }
              }
              setProcessing(false);
              setSelectedRowKeys([]);
              setProcessDone(0);
            }}
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <IoReloadOutline className="animate-spin" />{" "}
                <span>
                  {processDone} of {selectedRowKeys.length} Done
                </span>
              </div>
            ) : (
              "Send Email"
            )}
          </button>
        )}
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
              <p>Type:</p>
              <p>{client?.type}</p>
            </div>
            {client?.type === "MESSAGE" && (
              <div className="flex justify-between border-b py-[16px]">
                <p>Message:</p>
                <p>{client?.message}</p>
              </div>
            )}
            <div className="flex justify-between border-b py-[16px]">
              <p>Date:</p>
              <p>{client?.createdAt?.slice(0, 10)}</p>
            </div>
            <div className="flex justify-between border-b py-[16px]">
              <p>Time:</p>
              <p>{client?.createdAt?.slice(11, 19)}</p>
            </div>
            <div className="flex justify-between border-b py-[16px]">
              <p> Status:</p>
              <p>{client?.status}</p>
            </div>
            {client?.status !== "PENDING" && (
              <div className="flex justify-between border-b py-[16px]">
                <p>
                  {client?.status === "SENDED"
                    ? "Last mail send:"
                    : "reviewed At:"}
                </p>
                <p>{client?.updatedAt?.slice(0, 10)}</p>
              </div>
            )}
            {client?.status !== "REVIEWED" && client?.user && (
              <div className="flex items-center justify-center mt-5">
                <button
                  className="py-3 px-7 rounded-xl bg-green-600 text-white"
                  onClick={() => handelSendEmail(client.id)}
                >
                  Send Email
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
