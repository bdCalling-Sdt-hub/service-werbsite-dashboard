import { Button } from "antd";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import { useRef, useState,useEffect } from "react";
import { baseURL } from "../../../config";
import Swal from "sweetalert2";

const EditPrivacyPolicy = () => {
  const navigate = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
    fetch(baseURL + "/app-data", {
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
        setContent(data.data.privacy);
      });
  }, [navigate]);

  const handleUpdate = () => {
    fetch(baseURL + "/app-data", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        privacy: content,
      }),
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
          Swal.fire("Success", "Privacy Policy Updated", "success");
        }
      });

  };

  return (
    <div className="relative ml-[24px]">
      <div className=" mt-[44px] cursor-pointer flex items-center pb-3 gap-2">
        <MdOutlineKeyboardArrowLeft
          className=""
          onClick={() => navigate("/settings/privacy-policy")}
          size={34}
        />
        <h1 className="text-[24px] text-primary font-semibold">
          Edit Privacy Policy
        </h1>
      </div>
      <div className="text-wrap w-full">
        <JoditEditor
          ref={editor}
          value={content}
          onChange={(newContent) => {
            setContent(newContent);
          }}
          className="text-wrap"
          style={{ width: "100%" }}
        />
        <Button
          onClick={handleUpdate}
          block
          className="mt-[30px] bg-[#318130] text-[white] h-[50px] hover:text-white "
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default EditPrivacyPolicy;
