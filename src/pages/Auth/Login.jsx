import { Button, Checkbox, Form, Input } from "antd";

import { HiOutlineMailOpen } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

import loginImg from "../../assets/Isometric.png";
import logo from "../../assets/logo2.png";
import { IconLock } from "@tabler/icons-react";
import { baseURL } from "../../config";
import Swal from "sweetalert2";
const LogIn = () => {
  const navigate = useNavigate();

  const onFinish = async ({ email, password }) => {
    try {
      const res = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        // if (res.status === 401) {
        //   navigate("/auth");
        //   return;
        // }

        return res.json();
      });

      if (res.ok) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later",
      });
    }
  };

  return (
    <div className="mx-[310px] text-black px-[115px] py-[120px] rounded-xl border-2 border-[#318130] shadow-2xl">
      <div className="flex gap-[120px]">
        <div className="flex items-center">
          <img src={loginImg} alt="" />
        </div>
        <div>
          <div className="w-[500px]">
            <img src={logo} alt="" />
            <h1 className="text-[24px]  font-medium mt-[24px] mb-[32px]">
              Hello,Welcome!
            </h1>
            <p className=" text-16  mt-[24px] mb-[32px]">
              Please Enter Your Details Below to Continue
            </p>
            <Form
              name="normal_login"
              // className="login-form"
              labelCol={{ span: 22 }}
              wrapperCol={{ span: 40 }}
              layout="vertical"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              className="space-y-4"
            >
              <Form.Item
                name="email"
                label={<span className=" text-[16px] font-medium">Email</span>}
                rules={[
                  {
                    required: true,
                    message: "Please Input Your Email!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter Your Email"
                  // onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  prefix={
                    <HiOutlineMailOpen
                      className="mr-2 rounded-full p-[6px]"
                      size={28}
                      color="#318130"
                    />
                  }
                  style={{
                    borderBottom: "2px solid #4E4E4E",
                    height: "52px",
                    background: "#F6F6F6",
                    outline: "none",
                    marginBottom: "20px",
                  }}
                  required
                  bordered={false}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <span className=" text-[16px] font-medium">Password</span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please Input Your Password!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  // onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Your Password"
                  name="current_password"
                  prefix={
                    <IconLock
                      className="mr-2 bg-white rounded-full p-[6px]"
                      size={28}
                      color="#318130"
                    />
                  }
                  style={{
                    borderBottom: "2px solid #4E4E4E",
                    height: "52px",
                    background: "#F6F6F6",
                    outline: "none",
                    marginBottom: "20px",
                  }}
                  bordered={false}
                />
              </Form.Item>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>
                      <span className="text-[#318130]font-medium">
                        {" "}
                        Remember Me
                      </span>
                    </Checkbox>
                  </Form.Item>
                </div>
                <div>
                  <Link
                    to="/auth/forgot-password"
                    className="text-[#318130] font-medium"
                  >
                    Forget password?
                  </Link>
                </div>
              </div>
              <div></div>

              <Form.Item>
                <Button
                  //   type="primary"
                  htmlType="submit"
                  className="block w-[500px] h-[56px] px-2 py-4 mt-2 text-white bg-gradient-to-r from-[#318130] to-[#318130] rounded-lg hover:bg-[#318130]"
                >
                  Log in
                </Button>
                {/* <Link to="/dashboard"
              // type="primary"
              // htmlType="submit"
              className="block text-center w-[350px] h-[56px] px-2 py-4 mt-2 hover:text-white text-white bg-[#3BA6F6] rounded-lg"
            >
              Log In
            </Link> */}
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
