import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../layouts/Footer";
import { Navbar } from "../layouts/Navbar";
import { TopBar } from "../layouts/TopBar";

export const Register = () => {
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
            [name]: value ? "" : formErrors[name]
        })
    };

    // Xử lý lỗi khi để trống
    const handleInputBlur = (event) => {
        const {name, value} = event.target;
        if(! value){
            setFormErrors({
                ...formErrors,
                [name]: "This field cannot be left blank"
            });
        }
    };

    // Kiểm tra email và gửi OTP nếu chưa tồn tại
    const handleRegisterSubmit = (e) => {
        e.preventDefault();

     

        // some: 1- kiểm tra có bất kì lỗi nào trong formErrors khong
        //       2- Kiểm tra có trường nào rỗng hoặc trống hay không

        if(formData.password.length < 6 ){
            setErrorMessage('Password must be 6 characters');
            return;
        }

        // Kiểm tra email đã tồn tại chưa
        fetch(`http://localhost:8080/api/v1/check-exists-user?email=${formData.email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("An error occurred while checking email.");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.result) {
                setErrorMessage("Email already exists, please use another email.");
            } else {
                fetch(`http://localhost:8080/api/v1/send-otp-register?email=${formData.email}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                .then((otpResponse) => {
                    if (!otpResponse.ok) {
                        throw new Error("Error sending OTP");
                    }
                    return otpResponse.json();
                })
                .then((otpData) => {
                    if (otpData.code === 200) {
                        setIsOtpSent(true); // Chuyển đến form nhập OTP
                        setErrorMessage("");
                        console.log("OTP sent successfully");
                    } else {
                        setErrorMessage("Error sending OTP, please try again.");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setErrorMessage("An error occurred while sending OTP.");
                });
            }
        })
    };

    // Xử lý xác thực OTP và gửi toàn bộ thông tin đăng ký
    const handleOtpSubmit = (e) => {
        e.preventDefault();

        // Gửi thông tin đăng ký kèm OTP
        fetch(`http://localhost:8080/api/v1/register?otp=${formData.otp}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstname,
                lastName: formData.lastname,
                dob: formData.dob,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                setErrorMessage('OTP is invalid or expired')
                throw new Error("Error during registration");
            }
            return response.json();
        })
        .then((data) => {
            if (data.result) {
                console.log("User registered successfully");
                navigate("/login");
            } else {
                setErrorMessage("OTP is invalid or expired");
                console.error("Error during registration:", data.message);
            }
        })
        .catch((error) => {
            console.error(error);
            setErrorMessage("OTP is invalid or expired");
        });
    };

    return (
        <div>
            <TopBar/>
            <Navbar />
            <section className="py-3 py-md-5 py-xl-8">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="mb-5">
                                <h2 className="display-5 fw-bold text-center">Register</h2>
                                <p className="text-center m-0">
                                    Already have an account?{" "}
                                    <Link to="/login">Sign in</Link>
                                </p>
                            
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10 col-xl-8">
                            <div className="row gy-5 justify-content-center">
                                <div className="col-12 col-lg-8">
                                    {!isOtpSent ? (
                                        // Form đăng ký bước 1 (trước khi gửi OTP)
                                        <form onSubmit={handleRegisterSubmit}>
                                            <div className="row gy-3 overflow-hidden">
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            name="email"
                                                            id="email"
                                                            placeholder="name@example.com"
                                                            required
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            onBlur={handleInputBlur}
                                                        />
                                                        <label htmlFor="email" className="form-label">Email</label>
                                                        {formErrors.email && <p className="text-danger">{formErrors.email}</p>}
                                                    </div>
                                            
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            name="password"
                                                            id="password"
                                                            placeholder="Password"
                                                            required
                                                            value={formData.password}
                                                            onChange={handleInputChange}
                                                            onBlur={handleInputBlur}
                                                        />
                                                        <label htmlFor="password" className="form-label">Password</label>
                                                        {formErrors.password && <p className="text-danger">{formErrors.password}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="firstname"
                                                            id="firstname"
                                                            placeholder="First Name"
                                                            required
                                                            value={formData.firstname}
                                                            onChange={handleInputChange}
                                                            onBlur={handleInputBlur}
                                                        />
                                                        <label htmlFor="firstname" className="form-label">First Name</label>
                                                        {formErrors.firstname && <p className="text-danger">{formErrors.firstname}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="lastname"
                                                            id="lastname"
                                                            placeholder="Last Name"
                                                            required
                                                            value={formData.lastname}
                                                            onChange={handleInputChange}
                                                            onBlur={handleInputBlur}
                                                        />
                                                        <label htmlFor="lastname" className="form-label">Last Name</label>
                                                        {formErrors.lastname && <p className="text-danger">{formErrors.lastname}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="dob"
                                                            id="dob"
                                                            placeholder="Date of Birth"
                                                            required
                                                            value={formData.dob}
                                                            onChange={handleInputChange}
                                                            onBlur={handleInputBlur}
                                                        />
                                                        <label htmlFor="dob" className="form-label">Date of Birth</label>
                                                        {formErrors.dob && <p className="text-danger">{formErrors.dob}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-grid">
                                                        <button className="btn btn-lg btn-dark rounded-0 fs-6" type="submit">
                                                            Register
                                                        </button>
                                                        
                                                    </div>
                                                </div>
                                                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                                            </div>
                                        </form>
                                    ) : (
                                        // Form nhập OTP (sau khi OTP đã được gửi)
                                        <form onSubmit={handleOtpSubmit}>
                                            <div className="row gy-3">
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="otp"
                                                            id="otp"
                                                            placeholder="Enter OTP"
                                                            required
                                                            value={formData.otp}
                                                            onChange={handleInputChange}
                                                            onBlur={handleInputBlur}
                                                        />
                                                        <label htmlFor="otp" className="form-label">OTP</label>
                                                        {formErrors.otp && <p className="text-danger">{formErrors.otp}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-grid">
                                                        <button className="btn btn-lg btn-dark rounded-0 fs-6" type="submit">
                                                            Verify OTP
                                                        </button>
                                                    </div>
                                                </div>
                                                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};
