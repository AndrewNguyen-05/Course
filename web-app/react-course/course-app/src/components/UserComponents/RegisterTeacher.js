import React, { useEffect, useState } from "react";
import { Navbar } from "../layouts/Navbar";
import { Footer } from "../layouts/Footer";
import { ToastContainer, toast } from 'react-toastify';

export const RegisterTeacher = () => {

    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        experience: "",
        bio: "",
        facebook: "",
        cv: null,
        certificate: null,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.files[0],
        });
    };

    const [loadingRegister, setLoadingRegister] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/my-info`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(data => {
                setFormData((prevData) => ({
                    ...prevData,
                    fullName: `${data.result.firstName} ${data.result.lastName}`,
                    email: data.result.email,
                }));
            }).catch(error => console.log(error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoadingRegister(true);
        const formDataToSend = new FormData();

        //  Tại sao dùng Blob trong trường hợp này? Trong trường hợp này, chúng ta cần gửi một yêu cầu multipart/form-data, trong đó bao gồm cả:
        //  Dữ liệu JSON: thông tin giáo viên(họ tên, email, số điện thoại, v.v.).
        //  File: CV và chứng chỉ.
        //  Cú pháp Blob : new Blob([dữ liệu], {type: 'loại dữ liệu'})

        const jsonBlob = new Blob([JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            experience: formData.experience,
            bio: formData.bio,
            facebook: formData.facebook,
        })], { type: 'application/json' });

        formDataToSend.append('request', jsonBlob);

        formDataToSend.append('cv', formData.cv);
        formDataToSend.append('certificate', formData.certificate);

        fetch(`http://localhost:8080/api/v1/register-teacher`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formDataToSend
        }).then((response) => {
            return response.json().then(data => {
                if (response.ok) {
                    toast.success('Registration successful! Please await our notification.');
                } else {
                    toast.error('Your request is pending review, please do not resubmit.');
                }
                setLoadingRegister(false);
                return data;
            });
        }).catch(error => {
            console.error(error);
            toast.error('An error occurred during registration');
            setLoadingRegister(false)
        });
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="custom-card shadow-sm p-4 rounded-4">
                            <h2 className="text-center mb-4 text-primary form-title">Become a Teacher</h2>
                            <p className="text-center mb-5 text-muted form-subtitle">
                                Share your expertise and join our community of professionals.
                            </p>
                            <form onSubmit={handleSubmit}>
                                {/* Full Name */}
                                <div className="mb-3">
                                    <div className="input-group custom-input-group">
                                        <span className="input-group-text custom-input-group-text">
                                            <i className="fas fa-user text-primary"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control custom-form-control"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <div className="input-group custom-input-group">
                                        <span className="input-group-text custom-input-group-text">
                                            <i className="fas fa-envelope text-primary"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control custom-form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="mb-3">
                                    <div className="input-group custom-input-group">
                                        <span className="input-group-text custom-input-group-text">
                                            <i className="fas fa-phone text-primary"></i>
                                        </span>
                                        <input
                                            type="number"
                                            className="form-control custom-form-control"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="mb-3">
                                    <div className="input-group custom-input-group">
                                        <span className="input-group-text custom-input-group-text">
                                            <i className="fas fa-book text-primary"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control custom-form-control"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="Subject of Expertise"
                                        />
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="mb-3">
                                    <div className="input-group custom-input-group">
                                        <span className="input-group-text custom-input-group-text">
                                            <i className="fas fa-calendar-alt text-primary"></i>
                                        </span>
                                        <input
                                            type="number"
                                            className="form-control custom-form-control"
                                            id="experience"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            required
                                            placeholder="Years of Experience"
                                        />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="mb-3">
                                    <div className="input-group custom-input-group">
                                        <span className="input-group-text custom-input-group-text">
                                            <i className="fas fa-pencil-alt text-primary"></i>
                                        </span>
                                        <textarea
                                            className="form-control custom-form-control"
                                            id="bio"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="Tell us more about yourself"
                                        />
                                    </div>
                                </div>

                                {/* Facebook Link */}
                                <div className="mb-3">
                                    <div className="input-group custom-input-group">
                                        <span className="input-group-text custom-input-group-text">
                                            <i className="fab fa-facebook-f text-primary"></i>
                                        </span>
                                        <input
                                            type="url"
                                            className="form-control custom-form-control"
                                            id="facebook"
                                            name="facebook"
                                            value={formData.facebook}
                                            onChange={handleChange}
                                            placeholder="Facebook Profile Link"
                                        />
                                    </div>
                                </div>

                                {/* CV */}
                                <div className="mb-3">
                                    <label htmlFor="cv" className="form-label text-muted custom-form-label">
                                        Upload CV (PDF only)
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control custom-form-control-file"
                                        id="cv"
                                        name="cv"
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                    />
                                </div>

                                {/* Certificate */}
                                <div className="mb-3">
                                    <label htmlFor="certificate" className="form-label text-muted custom-form-label">
                                        Upload Certificate (PDF only)
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control custom-form-control-file"
                                        id="certificate"
                                        name="certificate"
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                    />
                                </div>

                                {/* Submit button */}

                                {loadingRegister ? (
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 rounded-pill mt-3 custom-submit-btn"
                                    >
                                        <i className="fas fa-spinner fa-spin me-2"></i>
                                        Updating...
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 rounded-pill mt-3 custom-submit-btn"
                                    >
                                        <i className="fas fa-user-plus me-2"></i>
                                        Register as Teacher
                                    </button>
                                )}

                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast container to display notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                className="custom-toast-container"
            />

            <Footer />

        </div>
    );
};
