import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../config";

export default function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    fetch(baseURL + "/notifications", {
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
          setNotifications(data.data);
        }
      });
  }, [navigate]);

  return (
    <div className="ml-[24px]">
      <h1 className="text-[30px] font-medium mb-10">Notifications</h1>
      <div className="flex flex-col gap-5">
        {notifications.map((notification, index) => (
          <p className="text-[16px] p-5 border rounded" key={index}>
            {notification.message}
          </p>
        ))}
      </div>
    </div>
  );
}
