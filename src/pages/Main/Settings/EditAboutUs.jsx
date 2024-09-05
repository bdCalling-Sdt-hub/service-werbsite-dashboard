import { Button } from "antd";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import { useEffect, useRef, useState } from "react";
import { baseURL } from "../../../config";
import Swal from "sweetalert2";

const EditAboutUs = () => {
    const navigate = useNavigate();
    const editor = useRef(null);
    const [content, setContent] = useState("");

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
      }
      fetch(baseURL + "/sitedata", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setContent(data.siteData.aboutUs);
        });
    }, [navigate]);
    
  
    const handleUpdate = ()=>{
      fetch(baseURL + "/sitedata", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          aboutUs: content,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if(data.ok) Swal.fire("Success", "About Us Updated", "success");
        });
    } 
  
    return (
        <div className="relative ml-[24px]">
      <div className=" mt-[44px] cursor-pointer flex items-center pb-3 gap-2">
        <MdOutlineKeyboardArrowLeft
          className=""
          onClick={() => navigate("/settings/about-us")}
          size={34}
        />
        <h1 className="text-[24px] text-primary font-semibold">
          Edit About Us
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
        style={{ width: '100%' }} 
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
}

export default EditAboutUs;
