import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  checkUserExists,
  registerUser,
  sendOtpRegister,
} from "../../../service/UserService";
import { motion } from "framer-motion";
import { RegisterForm } from "./components/RegisterForm";

export const Register = () => {
  useEffect(() => {
    document.title = "Register Page";
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    dob: "",
    otp: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    dob: "",
    otp: "",
  });

  const [isOtpSent, setIsOtpSent] = useState(false); // Quản lý trạng thái OTP
  const [errorMessage, setErrorMessage] = useState(""); // Hiển thị thông báo lỗi
  const navigate = useNavigate();

  // Xử lý thay đổi giá trị các input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setFormErrors({
      ...formErrors,
      [name]: value ? "" : formErrors[name],
    });
  };

  // Xử lý lỗi khi để trống
  const handleInputBlur = (event) => {
    const { name, value } = event.target;
    if (!value) {
      setFormErrors({
        ...formErrors,
        [name]: "This field cannot be left blank",
      });
    }
  };

  // Kiểm tra email và gửi OTP nếu chưa tồn tại
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    try {
      // Kiểm tra email đã tồn tại
      const data = await checkUserExists(formData.email);
      if (data.result) {
        setErrorMessage("Email already exists, please use another email.");
      } else {
        // Gửi OTP
        const otpData = await sendOtpRegister(formData.email);
        if (otpData.code === 200) {
          setIsOtpSent(true);
          setErrorMessage("");
        } else {
          setErrorMessage("Error sending OTP, please try again.");
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred while checking email.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser(formData.otp, {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstname,
        lastName: formData.lastname,
        dob: formData.dob,
      });
      if (data.result) {
        console.log("User registered successfully");
        navigate("/login");
      } else {
        setErrorMessage("OTP is invalid or expired");
        console.error("Error during registration:", data.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("OTP is invalid or expired");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }} // Hiệu ứng ban đầu: ẩn và dịch phải
      animate={{ opacity: 1, x: 0 }} // Hiệu ứng khi hiển thị: hiện và dịch về vị trí gốc
      exit={{ opacity: 0, x: -100 }} // Hiệu ứng khi thoát: ẩn và dịch trái
      transition={{ duration: 0.5 }} // Thời gian chuyển động
      className="content-page"
    >
      <section className="py-3 py-md-5 py-xl-8">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="mb-5">
                <h2 className="display-5 fw-bold text-center">Register</h2>
                <p className="text-center m-0">
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
              </div>
            </div>
          </div>

          <RegisterForm 
            handleRegisterSubmit={handleRegisterSubmit}
            errorMessage={errorMessage}
            handleOtpSubmit={handleOtpSubmit}
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            formErrors={formErrors}
            isOtpSent={isOtpSent}
          />
          
        </div>
      </section>
    </motion.div>
  );
};
