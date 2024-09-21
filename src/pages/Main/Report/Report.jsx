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

export default function Report() {
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [suburbs, setSuburbs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({
    startDate: "",
    endDate: "",
    businessName: "",
    serviceId: "",
    suburb: "",
    active: "",
    workStatus: "",
    subscriptionId: "",
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

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

    fetch(`${baseURL}/services`)
      .then((res) => res.json())
      .then((data) => {
        setBusinessCategories(data.data);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });

    fetch(`${baseURL}/suburbs`)
      .then((res) => res.json())
      .then((data) => {
        setSuburbs(data.data);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });

    fetch(`${baseURL}/subscriptions`)
      .then((res) => res.json())
      .then((data) => {
        setPlans(data.data);
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

    fetch(baseURL + "/businesses/report", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filteredInfo),
    })
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
            setData(
              data.data.map((item) => ({
                name: item.name,
                address: item.address,
                suburb: item.suburb,
                mobile: item.mobile,
                businessCategory: item.mainService.name,
                workStatus: item._count.reviews ? "Work Done" : "Not Work Done",
              }))
            );
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
      title: "ID",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Business Name",
      dataIndex: "name",
    },
    {
      title: "Business Category",
      dataIndex: "businessCategory",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Suburb",
      dataIndex: "suburb",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
    },
    {
      title: "Work Status",
      dataIndex: "workStatus",
    },
  ];

  return (
    <div className=" ml-[24px]">
      {data.length > 0 ? (
        <div className=" rounded-t-lg mt-[24px] shadow-2xl p-6">
          <h1 className="text-[30px] font-medium text-start">Search Report</h1>
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
                // Convert JSON data to CSV
                const csv = Papa.unparse(data);

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
                  `search-report-${filteredInfo.startDate}-to-${filteredInfo.endDate}.csv`
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
          <h1 className="text-[30px] font-medium text-start">Search Report</h1>
          <form className="flex flex-col gap-6 mx-auto mt-8 min-w-[600px] p-6 rounded border border-green-600">
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
                defaultValue={"All"}
                onChange={(value) => {
                  const business = businesses.find(
                    (business) => business.id === value
                  );

                  setFilteredInfo({
                    ...filteredInfo,
                    businessName: business?.name,
                    serviceId: business?.mainServiceId,
                    suburb: business?.suburb,
                    active: new Date(business?.subscriptionEndAt) > new Date(),
                    subscriptionId:
                      business?.payments.length > 0
                        ? business?.payments[0]?.subscription?.id
                        : undefined,
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
                options={[
                  { value: "", label: "All" },
                  ...businesses.map((business) => ({
                    value: business.id,
                    label: business.name,
                  })),
                ]}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="search" className="text-[18px] font-medium">
                Business Category
              </label>
              <Select
                showSearch
                placeholder="Select a Business Category"
                defaultValue={"All"}
                value={filteredInfo.serviceId}
                onChange={(value) => {
                  setFilteredInfo({
                    ...filteredInfo,
                    serviceId: value,
                  });
                }}
                // onFocus={onFocus}
                // onBlur={onBlur}
                filterOption={false}
                onSearch={(value) => {
                  fetch(`${baseURL}/services?name=${value}`)
                    .then((res) => res.json())
                    .then((data) => {
                      setBusinessCategories(data.data);
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
                options={[
                  { value: "", label: "All" },
                  ...businessCategories.map((Category) => ({
                    value: Category.id,
                    label: Category.name,
                  })),
                ]}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="search" className="text-[18px] font-medium">
                Suburb
              </label>
              <Select
                showSearch
                placeholder="Select a Suburb"
                defaultValue={"All"}
                value={filteredInfo.suburb}
                onChange={(value) => {
                  setFilteredInfo({
                    ...filteredInfo,
                    suburb: value,
                  });
                }}
                // onFocus={onFocus}
                // onBlur={onBlur}
                filterOption={false}
                onSearch={(value) => {
                  fetch(`${baseURL}/suburbs?name=${value}`)
                    .then((res) => res.json())
                    .then((data) => {
                      setSuburbs(data.data);
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
                options={[
                  { value: "", label: "All" },
                  ...suburbs.map((suburb) => ({
                    value: suburb.name,
                    label: suburb.name + " - " + suburb.postcode,
                  })),
                ]}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="search" className="text-[18px] font-medium">
                Account Status
              </label>
              <Select
                placeholder="Select a Suburb"
                defaultValue={"All"}
                onChange={(value) => {
                  setFilteredInfo({
                    ...filteredInfo,
                    active: value,
                  });
                }}
                // onFocus={onFocus}
                // onBlur={onBlur}
                // onSearch={onSearch}
                size="large"
                value={filteredInfo.active}
                options={[
                  { value: "", label: "All" },
                  { value: true, label: "Active" },
                  { value: false, label: "Inactive" },
                ]}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="search" className="text-[18px] font-medium">
                Work Status
              </label>
              <Select
                placeholder="Select a Suburb"
                defaultValue={"All"}
                onChange={(value) => {
                  setFilteredInfo({
                    ...filteredInfo,
                    workStatus: value,
                  });
                }}
                // onFocus={onFocus}
                // onBlur={onBlur}
                // onSearch={onSearch}
                size="large"
                options={[
                  { value: "", label: "All" },
                  { value: true, label: "Work Done" },
                  { value: false, label: "Not Work Done" },
                ]}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="search" className="text-[18px] font-medium">
                Plan Name
              </label>
              <Select
                showSearch
                placeholder="Select a Business"
                defaultValue={"All"}
                value={filteredInfo.subscriptionId}
                onChange={(value) => {
                  setFilteredInfo({
                    ...filteredInfo,
                    subscriptionId: value,
                  });
                }}
                // onFocus={(value) => console.log(value)}
                // onBlur={(value) => console.log(value)}
                // onSearch={(value) => console.log(value)}
                size="large"
                options={[
                  { value: "", label: "All" },
                  ...plans.map((plan) => ({
                    value: plan.id,
                    label: plan.name,
                  })),
                ]}
              />
            </div>
            <Button
              type="primary"
              style={{ width: "200px" }}
              onClick={loading ? null : handelSubmit}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <IoReloadOutline className="animate-spin" />
                  <span> loading...</span>
                </div>
              ) : (
                "Show Report"
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
