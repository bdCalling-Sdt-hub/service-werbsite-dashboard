import { DatePicker, Select, Button, Modal, ConfigProvider, Table } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";
import { BsInfoCircle } from "react-icons/bs";
import Swal from "sweetalert2";
import { data } from "autoprefixer";
import { IoReloadOutline } from "react-icons/io5";
import Papa from "papaparse";

export default function CommunicationReport() {
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({
    startDate: "",
    endDate: "",
    businessId: "",
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalAmount,setTotalAmount] = useState(0);

  useEffect(() => {
    fetch(`${baseURL}/businesses`)
      .then((res) => res.json())
      .then((data) => {
        setBusinesses(data.data);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  }, []);

  function handelSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }

    fetch(
      baseURL +
        `/payments/report?startDate=${filteredInfo.startDate}&endDate=${filteredInfo.endDate}&businessId=${filteredInfo.businessId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          if (data.data.length === 0) {
            Swal.fire({
              icon: "info",
              title: "No Data Found",
              text: "No data found for the selected criteria",
            });
          } else {
            setData(data.data.payments);
            setTotalAmount(data.data.totalAmount);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  }

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

  return (
    <div className=" ml-[24px]">
      {data.length > 0 ? (
        <div className=" rounded-t-lg mt-[24px] shadow-2xl p-6">
          <h1 className="text-[30px] font-medium text-start">Communication Report</h1>
          <p className="my-3 text-lg">
            Result for {filteredInfo.startDate} to {filteredInfo.endDate}
          </p>
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
            <Table pagination={false} columns={columns} dataSource={data} />
            <div className="text-right mr-36 text-lg font-medium">Total ${totalAmount}</div>
          </ConfigProvider>

          <div className="flex items-center justify-between mt-8">
            <Button
              type="primary"
              style={{ width: "200px" }}
              onClick={() => setData([])}
            >
              New Search
            </Button>
            <Button
              type="primary"
              style={{ width: "200px" }}
              onClick={() => {
                const csvData = data.map((item) => ({
                  Trx_ID: item.transactionId,
                  Business_Name: item.business.name,
                  Subscription_Name: item.subscription.name,
                  Date: item.createdAt.slice(0, 10),
                  Amount: item.amount,
                }));
                // Convert JSON data to CSV
                const csv = Papa.unparse(csvData);

                // Create a Blob from the CSV data
                const blob = new Blob([csv], {
                  type: "text/csv;charset=utf-8;",
                });

                // Create a link element for downloading
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.setAttribute(
                  "download",
                  `payment-report-${filteredInfo.startDate}-to-${filteredInfo.endDate}.csv`
                );

                // Append the link to the document and simulate a click
                document.body.appendChild(link);
                link.click();

                // Clean up by removing the link after the download starts
                document.body.removeChild(link);
              }}
            >
              Download Report
            </Button>
          </div>
        </div>
      ) : (
        <div className=" w-full flex flex-col items-center justify-center">
          <h1 className="text-[30px] font-medium text-start">Communication Report</h1>
          <form
            className="flex flex-col gap-6 mx-auto mt-8 min-w-[600px] p-6 rounded border border-green-600"
            onSubmit={loading ? null : handelSubmit}
          >
            <div className="flex flex-col">
              <label htmlFor="search" className="text-[18px] font-medium">
                Date Range
              </label>
              <RangePicker
                required
                onChange={(_, dateString) =>
                  setFilteredInfo({
                    ...filteredInfo,
                    startDate: dateString[0],
                    endDate: dateString[1],
                  })
                }
                size="large"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="search" className="text-[18px] font-medium">
                Business Name
              </label>
              <Select
                showSearch
                placeholder="Select a Business"
                required
                onChange={(value) => {
                  const business = businesses.find(
                    (business) => business.id === value
                  );

                  setFilteredInfo({
                    ...filteredInfo,
                    businessId: business?.id ?? "",
                  });
                }}
                // onFocus={(value) => console.log(value)}
                // onBlur={(value) => console.log(value)}
                filterOption={false}
                value={filteredInfo.businessName}
                onSearch={(value) => {
                  fetch(`${baseURL}/businesses?name=${value}`)
                    .then((res) => res.json())
                    .then((data) => {
                      setBusinesses(data.data);
                    })
                    .catch(() => {
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                      });
                    });
                }}
                size="large"
                options={businesses.map((business) => ({
                  value: business.id,
                  label: business.name,
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
            <Button type="primary" style={{ width: "200px" }} htmlType="submit">
              {loading ? (
                <div className="flex items-center gap-2">
                  <IoReloadOutline className="animate-spin" />
                  <span> loading...</span>
                </div>
              ) : (
                "Show Report"
              )}
            </Button>
            <Button type="primary" style={{ width: "200px" }} htmlType="submit">
              {loading ? (
                <div className="flex items-center gap-2">
                  <IoReloadOutline className="animate-spin" />
                  <span> loading...</span>
                </div>
              ) : (
                "Send Report to All"
              )}
            </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
