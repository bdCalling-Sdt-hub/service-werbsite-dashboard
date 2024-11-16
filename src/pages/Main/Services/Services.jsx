import { useEffect, useState } from "react";
import { Modal } from "antd";
import { MdAdd } from "react-icons/md";
import { baseURL } from "../../../config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TbEdit } from "react-icons/tb";

export default function Categories() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [client, setClient] = useState(null);
  const [navigatePage, setNavigatePage] = useState({
    prevPage: null,
    nextPage: null,
  });
  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    fetch(baseURL + "/services", {
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
          setServices(data.data);
        }
        if (data.pagination) {
          setNavigatePage({
            prevPage: data?.pagination?.prevPage || null,
            nextPage: data?.pagination?.nextPage || null,
          });
        }
      })
      .catch((err) => {
        Swal.fire("Error", "Something went wrong", "error");
      });
  }, [navigate]);

  return (
    <div className=" ml-[24px]">
      <h1 className="text-[30px] font-medium">All Services</h1>
      <button
        className="flex items-center gap-2 p-4 bg-[#058240] text-white ml-auto rounded-md"
        onClick={() => setIsAddModalOpen(true)}
      >
        <MdAdd /> Add Services
      </button>
      <div className=" rounded-t-lg mt-[24px] shadow-2xl p-5">
        <div className="grid grid-cols-7 gap-6 mt-8">
          {services.map((service) => (
            <div
              key={service._id}
              className=" bg-[#E6F3EC] border border-[#058240] rounded-t-xl"
            >
              <div className="p-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#B2D8C4] ml-auto"
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setClient(service);
                  }}
                >
                  <TbEdit />
                </button>
                <img
                  src={baseURL + "/" + service.image}
                  alt={service.name}
                  className="w-full my-4 rounded-xl aspect-video"
                />
                <h5 className="font-medium mb-2">{service.name}</h5>
                <p className="text-xs">{service.description}</p>
              </div>
              <button
                className="w-full py-4 border-t border-[#058240] font-medium text-red-500"
                onClick={() => {
                  const token = localStorage.getItem("token");
                  fetch(baseURL + "/services/" + service.id, {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: service._id }),
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
                        Swal.fire("Success", data.message, "success").then(
                          () => {
                            window.location.reload();
                          }
                        );
                      } else {
                        Swal.fire("Error", data.message, "error");
                      }
                    })
                    .catch((err) =>
                      Swal.fire("Error", "Something went wrong", "error")
                    );
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6 text-white px-8">
          {navigatePage.prevPage && (
            <button
              className="px-6 py-2 bg-green-600"
              onClick={() => {
                fetch(baseURL + "/services?page=" + navigatePage.prevPage, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
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
                      setServices(data.data);
                    }
                    if (data.pagination) {
                      setNavigatePage({
                        prevPage: data?.pagination?.prevPage || null,
                        nextPage: data?.pagination?.nextPage || null,
                      });
                    }
                  })
                  .catch((err) => {
                    Swal.fire("Error", "Something went wrong", "error");
                  });  
              }}
            >
              Prevues
            </button>
          )}
          {navigatePage.nextPage && (
            <button
              className="px-6 py-2 bg-green-600"
              onClick={() => {
                fetch(baseURL + "/services?page=" + navigatePage.nextPage, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
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
                      setServices(data.data);
                    }
                    if (data.pagination) {
                      setNavigatePage({
                        prevPage: data?.pagination?.prevPage || null,
                        nextPage: data?.pagination?.nextPage || null,
                      });
                    }
                  })
                  .catch((err) => {
                    Swal.fire("Error", "Something went wrong", "error");
                  });
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
      <Modal
        open={isAddModalOpen}
        onOk={() => setIsAddModalOpen(false)}
        onCancel={() => setIsAddModalOpen(false)}
        footer={[]}
        closeIcon
      >
        <div>
          <p className="font-medium text-white text-center p-4 border-b-2">
            Add new Service
          </p>
          <form
            className="p-[20px] text-white flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");
              const form = e.target;
              const data = new FormData(form);
              fetch(baseURL + "/services", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: data,
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
                  if (data.redirect) navigate(data.redirect);
                  console.log(data);
                  if (data.ok) {
                    Swal.fire("Success", data.message, "success").then(() => {
                      window.location.reload();
                    });
                  } else {
                    Swal.fire("Error", data.message, "error");
                  }
                });
            }}
          >
            <label htmlFor="">Service name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Service name"
              className="p-4 text-black"
              required
            />
            <label htmlFor="">Service description</label>
            <input
              type="text"
              name="description"
              placeholder="Enter Service description"
              className="p-4 text-black"
              required
            />
            <label htmlFor="">Upload image</label>
            <input type="file" name="image" required />
            <button className="py-4 w-full bg-green-700 rounded">
              Add Service
            </button>
          </form>
        </div>
      </Modal>
      <Modal
        open={isEditModalOpen}
        onOk={() => setIsEditModalOpen(false)}
        onCancel={() => {
          setIsEditModalOpen(false);
          setClient(null);
        }}
        footer={[]}
        closeIcon
      >
        <div>
          <p className="font-medium text-white text-center p-4 border-b-2">
            Edit Services
          </p>
          <form
            className="p-[20px] text-white flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");
              const form = e.target;
              const data = new FormData(form);
              fetch(baseURL + "/services/" + client.id, {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: data,
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
                  if (data.redirect) navigate(data.redirect);
                  console.log(data);
                  if (data.ok) {
                    Swal.fire("Success", data.message, "success").then(() => {
                      window.location.reload();
                    });
                  } else {
                    Swal.fire("Error", data.message, "error");
                  }
                })
                .catch((err) => {
                  Swal.fire("Error", "Something went wrong", "error");
                });
            }}
          >
            <label htmlFor="">Services name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Services name"
              className="p-4 text-black"
              value={client?.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
            />
            <label htmlFor="">Services description</label>
            <input
              type="text"
              name="description"
              placeholder="Enter Services description"
              className="p-4 text-black"
              value={client?.description}
              onChange={(e) =>
                setClient({ ...client, description: e.target.value })
              }
            />
            <label htmlFor="">Upload image</label>
            <input type="file" name="image" />
            <button className="py-4 w-full bg-green-700 rounded">
              Update Services
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
