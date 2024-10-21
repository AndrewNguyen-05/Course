import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { getMyInfo, registerTeacher } from "../../../service/UserService";
import RegisterTeachForm from "./components/RegisterTeacherFrom";

export const RegisterTeacher = () => {

    useEffect(() => {
        document.title = 'Register Teacher'
    })

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
        getMyInfo()
            .then(data => {
                setFormData((prevData) => ({
                    ...prevData,
                    fullName: `${data.result.firstName} ${data.result.lastName}`,
                    email: data.result.email,
                }));
            }).catch(error => console.log(error));
    }, []);

    const handleSubmit = async (e) => {
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
            facebookLink: formData.facebook,
        })], { type: 'application/json' });

        formDataToSend.append('request', jsonBlob);

        formDataToSend.append('cv', formData.cv);
        formDataToSend.append('certificate', formData.certificate);

        try {
            const data = await registerTeacher(formDataToSend);
            if (data && data.result) {
                toast.success('Registration successful! Please await our notification.');
                return;
            }
            if (data.code === 400 && data.message === 'Your request is pending review, please do not resubmit.') {
                toast.error('Your request is pending review, please do not resubmit.');
                return;
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setLoadingRegister(false);
        }
    };

    return (
        <div className="register-teacher-page">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="custom-card shadow-sm p-4 rounded-4">
                            <h2 className="text-center mb-4 text-primary form-title">Become a Teacher</h2>
                            <p className="text-center mb-5 text-muted form-subtitle">
                                Share your expertise and join our community of professionals.
                            </p>

                            <RegisterTeachForm
                                handleSubmit={handleSubmit}
                                formData={formData}
                                handleChange={handleChange}
                                loadingRegister={loadingRegister}
                                handleFileChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                className="custom-toast-container"
            />
        </div>
    );
};
