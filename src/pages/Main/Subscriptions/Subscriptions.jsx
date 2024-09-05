import { useEffect, useState } from "react";
import { Modal } from "antd";
import { MdAdd } from "react-icons/md";
import { baseURL } from "../../../config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Subscriptions() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [client, setClient] = useState(null);
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);

  const [newSubscription, setNewSubscription] = useState({
    name: "",
    price: "",
    minimumStart: "",
    benefits: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    fetch(baseURL + "/subscriptions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setSubscriptions(data.data);
        }
      });
  }, [navigate]);

  return (
    <div className=" ml-[24px]">
      <h1 className="text-[30px] font-medium">All Subscriptions</h1>
      <button
        className="flex items-center gap-2 p-4 bg-[#058240] text-white ml-auto rounded-md"
        onClick={() => setIsAddModalOpen(true)}
      >
        <MdAdd /> Add Subscription
      </button>
      <div className=" rounded-t-lg mt-[24px] shadow-2xl p-5">
        <div className="grid grid-cols-4 gap-6 mt-8">
          {subscriptions.map((subscription, index) => (
            <div
              key={index}
              className="rounded-3xl p-9 flex flex-col gap-6 bg-[#c9c7c7] items-start text-start lg:w-[387px]"
            >
              <h5 className="text-3xl text-black-500">{subscription.name}</h5>
              <ul className="flex flex-col gap-6">
                {subscription.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {benefit}
                  </li>
                ))}
              </ul>
              <p className="text-black-200">
                <span className="text-3xl font-bold text-black-500">
                  ${subscription.price}
                </span>
                /month
              </p>
              <button
                className="py-2 w-full bg-green-500 text-white rounded-xl"
                onClick={() => {
                  setClient(subscription);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </button>

              <button
                className="py-2 w-full bg-red-500 text-white rounded-xl"
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      fetch(baseURL + "/subscriptions/" + subscription.id, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                          "Content-Type": "application/json",
                        },
                        method: "DELETE",
                        body: JSON.stringify({
                          id: subscription._id,
                        }),
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          if (data.ok) {
                            Swal.fire(
                              "Deleted!",
                              "Your file has been deleted.",
                              "success"
                            ).then((result) => {
                              if (result.isConfirmed) {
                                window.location.reload();
                              }
                            });
                          }
                        });
                    }
                  });
                }}
              >
                Delete
              </button>
            </div>
          ))}
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
            Add new Subscription
          </p>
          <form
            className="p-[20px] text-white flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              fetch(baseURL + "/subscriptions", {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(newSubscription),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.ok) {
                    Swal.fire({
                      icon: "success",
                      title: "Subscription added successfully",
                      showConfirmButton: false,
                      timer: 1500,
                    }).then(() => {
                      window.location.reload();
                    });
                  }
                });
            }}
          >
            <label htmlFor="">Subscription Name</label>
            <input
              type="text"
              name="name"
              value={newSubscription.name}
              onChange={(e) =>
                setNewSubscription({ ...newSubscription, name: e.target.value })
              }
              placeholder="Enter Subscription name"
              className="p-4 text-black"
            />
            <label htmlFor="">Subscription Price</label>
            <input
              type="text"
              name="price"
              value={newSubscription.price}
              onChange={(e) => {
                if (isNaN(e.target.value)) return;
                setNewSubscription({
                  ...newSubscription,
                  price: e.target.value,
                });
              }}
              placeholder="Enter Subscription Price"
              className="p-4 text-black"
            />
            <label htmlFor="">Minimum Star</label>
            <input
              type="text"
              name="Minimum Star"
              value={newSubscription.minimumStart}
              onChange={(e) => {
                if (isNaN(e.target.value)) return;
                setNewSubscription({
                  ...newSubscription,
                  minimumStart: e.target.value,
                });
              }}
              placeholder="Enter Subscription Duration in days"
              className="p-4 text-black"
            />
            <label htmlFor="">Subscription Fetchers </label>
            {newSubscription.benefits.map((benefit, index) => (
              <div className="flex items-center gap-5 w-full" key={index}>
                <input
                  type="text"
                  value={benefit.name}
                  onChange={(e) => {
                    const newFetchers = [...newSubscription.benefit];
                    newFetchers[index].name = e.target.value;
                    setNewSubscription({
                      ...newSubscription,
                      benefit: newFetchers,
                    });
                  }}
                  placeholder="your subscription fetchers"
                  className="p-4 text-black w-full"
                />
              </div>
            ))}
            <button className="py-4 w-full bg-green-700 rounded">
              Add Subscription
            </button>
          </form>
        </div>
      </Modal>
      <Modal
        open={isEditModalOpen}
        onOk={() => setIsEditModalOpen(false)}
        onCancel={() => setIsEditModalOpen(false)}
        footer={[]}
        closeIcon
      >
        <div>
          <p className="font-medium text-white text-center p-4 border-b-2">
            Edit Subscription
          </p>
          <form
            className="p-[20px] text-white flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              fetch(baseURL + "/subscriptions", {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify(client),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.ok) {
                    Swal.fire({
                      icon: "success",
                      title: "Subscription updated successfully",
                      showConfirmButton: false,
                      timer: 1500,
                    }).then(() => {
                      window.location.reload();
                    });
                  }
                });
            }}
          >
            <label htmlFor="">Subscription Name</label>
            <input
              type="text"
              name="name"
              value={client?.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              placeholder="Enter Subscription name"
              className="p-4 text-black"
            />
            <label htmlFor="">Subscription Price</label>
            <input
              type="text"
              name="price"
              value={client?.price}
              onChange={(e) => {
                if (isNaN(e.target.value)) return;
                setClient({
                  ...client,
                  price: e.target.value,
                });
              }}
              placeholder="Enter Subscription Price"
              className="p-4 text-black"
            />
            <label htmlFor="">Subscription Duration</label>
            <input
              type="text"
              name="duration"
              value={client?.duration}
              onChange={(e) => {
                if (isNaN(e.target.value)) return;
                setClient({
                  ...client,
                  duration: e.target.value,
                });
              }}
              placeholder="Enter Subscription Duration"
              className="p-4 text-black"
            />
            <label htmlFor="">Subscription Fetchers </label>
            {client?.features?.map((fetcher, index) => (
              <div className="flex items-center gap-5 w-full" key={index}>
                <input
                  type="text"
                  value={fetcher?.name}
                  onChange={(e) => {
                    const newFetchers = [...client.features];
                    newFetchers[index].name = e.target.value;
                    setClient({
                      ...client,
                      features: newFetchers,
                    });
                  }}
                  placeholder="your subscription fetchers"
                  className="p-4 text-black w-full"
                />
                <div>
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={fetcher?.included}
                    onChange={(e) => {
                      const newFetchers = [...client.features];
                      newFetchers[index].included = e.target.checked;
                      setClient({
                        ...client,
                        features: newFetchers,
                      });
                    }}
                  />
                  <span>Included</span>
                </div>
              </div>
            ))}
            <button className="py-4 w-full bg-green-700 rounded">
              Update Subscription
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
