import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { InfoContact } from "../common/InfoContact";

export const Contact = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        document.title = 'Register Advertisement';
    }, []);

    const onSubmit = (data) => {
        console.log(data);
        toast.success("Advertisement registration successful!", { position: "top-center" });
    };

    return (
        <div className="container-fluid py-5">
            <div className="row justify-content-center mb-5">
                <div className="col-lg-8 text-center">
                    <h6 className="d-inline-block text-secondary text-uppercase pb-2 ads-title-highlight">Need Help?</h6>
                    <h1 className="ads-title">Register Your Advertisement</h1>
                </div>
            </div>
            <div className="container py-5">
                <div className="row align-items-center">
                    <InfoContact />

                    {/* Form đăng ký quảng cáo */}
                    <div className="col-lg-7">
                        <div className="contact-form">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row">
                                    <div className="col-6 form-group">
                                        <div className="input-group">
                                            <span className="input-group-text ads-input-icon bg-primary text-white border-0">
                                                <i className="fa fa-envelope"></i>
                                            </span>
                                            <input
                                                type="email"
                                                className="form-control border-top-0 border-right-0 border-left-0 p-2"
                                                placeholder="Your Email"
                                                {...register('contactEmail', { required: true })}
                                            />
                                        </div>
                                        {errors.contactEmail && <span className="text-danger">Email is required</span>}
                                    </div>
                                    <div className="col-6 form-group">
                                        <div className="input-group">
                                            <span className="input-group-text ads-input-icon bg-secondary text-white border-0">
                                                <i className="fa fa-phone"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control border-top-0 border-right-0 border-left-0 p-2"
                                                placeholder="Your Phone"
                                                {...register('contactPhone', { required: true })}
                                            />
                                        </div>
                                        {errors.contactPhone && <span className="text-danger">Phone number is required</span>}
                                    </div>
                                </div>
                                {/* Thêm trường Location */}
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-text ads-input-icon bg-info text-white border-0">
                                            <i className="fa fa-map-marker-alt"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-top-0 border-right-0 border-left-0 p-2"
                                            value='Home Page'
                                            placeholder="Home Page"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-text ads-input-icon bg-primary text-white border-0">
                                            <i className="fa fa-heading"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-top-0 border-right-0 border-left-0 p-2"
                                            placeholder="Advertisement Title"
                                            {...register('title', { required: true })}
                                        />
                                    </div>
                                    {errors.title && <span className="text-danger">Title is required</span>}
                                </div>
                                <div className="form-group">
                                    <textarea
                                        className="form-control border-top-0 border-right-0 border-left-0 p-2"
                                        rows="3"
                                        placeholder="Description"
                                        {...register('description')}
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-text ads-input-icon bg-warning text-white border-0">
                                            <i className="fa fa-link"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-top-0 border-right-0 border-left-0 p-2"
                                            placeholder="Advertisement Link"
                                            {...register('link', { required: true })}
                                        />
                                    </div>
                                    {errors.link && <span className="text-danger">Link is required</span>}
                                </div>
                                <div className="row">
                                    <div className="col-6 form-group">
                                        <div className="input-group">
                                            <span className="input-group-text ads-input-icon bg-info text-white border-0">
                                                <i className="fa fa-calendar"></i>
                                            </span>
                                            <input
                                                type="date"
                                                className="form-control border-top-0 border-right-0 border-left-0 p-2"
                                                {...register('startDate', { required: true })}
                                            />
                                        </div>
                                        {errors.startDate && <span className="text-danger">Start date is required</span>}
                                    </div>
                                    <div className="col-6 form-group">
                                        <div className="input-group">
                                            <span className="input-group-text ads-input-icon bg-info text-white border-0">
                                                <i className="fa fa-calendar"></i>
                                            </span>
                                            <input
                                                type="date"
                                                className="form-control border-top-0 border-right-0 border-left-0 p-2"
                                                {...register('endDate', { required: true })}
                                            />
                                        </div>
                                        {errors.endDate && <span className="text-danger">End date is required</span>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Upload Advertisement Image</label>
                                    <input
                                        type="file"
                                        className="form-control border-0 p-2"
                                        {...register('image', { required: true })}
                                    />
                                    {errors.image && <span className="text-danger">Image is required</span>}
                                </div>
                                <div>
                                    <button className="btn btn-primary py-3 px-5 ads-submit-btn" type="submit">Register Ads</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="custom-toast-container"
            />
        </div>
    );
};
