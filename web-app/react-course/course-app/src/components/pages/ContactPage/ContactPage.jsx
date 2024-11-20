import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { registerAds } from "../../../service/AdsService";
import { InfoContact } from "./components/InfoContact";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";

export const ContactPage = () => {

    useEffect(() => {
        document.title = 'Register Advertisement';
    }, []);

    const token = localStorage.getItem('token');
    const [isLoadingRegisterAds, setIsLoadingRegisterAds] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        contactEmail: "",
        contactPhone: "",
        location: "Home Page",
        title: "",
        description: "",
        link: "",
        startDate: "",
        endDate: "",
        image: null
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleOnchangeImg = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
            setFormData({ ...formData, image: file });
        }
        console.log(formData.image)
    };

    const handleSubmitAds = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error('Please log in again.');
            return;
        }
        try {
            setIsLoadingRegisterAds(true);
            const formDataAds = new FormData();

            const jsonBlog = new Blob([JSON.stringify({
                contactEmail: formData.contactEmail,
                contactPhone: formData.contactPhone,
                title: formData.title,
                location: formData.location,
                description: formData.description,
                link: formData.link,
                startDate: formData.startDate,
                endDate: formData.endDate
            })], { type: 'application/json' });

            formDataAds.append("request", jsonBlog);
            formDataAds.append("file", formData.image);

            const response = await registerAds(token, formDataAds);

            if (response.error || response.message) {
                throw new Error(response.message);
            }
            toast.success('Registration successful! Please await our notification.');
            setFormData({
                contactEmail: "",
                contactPhone: "",
                location: "Home Page",
                title: "",
                description: "",
                link: "",
                startDate: "",
                endDate: "",
                image: null
            });
            setSelectedImage(null);
            setIsLoadingRegisterAds(false);

        } catch (error) {
            setIsLoadingRegisterAds(false);
            toast.error(error.message);
            console.log(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="content-page"
        >
            {isLoadingRegisterAds && (
                <div className="overlay">
                    <ClipLoader size={50} color={"#ffffff"} loading={isLoadingRegisterAds} />
                </div>
            )}
            <div className="container-fluid py-5">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 text-center">
                        <h6 className="d-inline-block text-secondary text-uppercase pb-2 ads-title-highlight">Need Help?</h6>
                        <h1 className="ads-title">Register Your Advertisement</h1>
                    </div>
                </div>
                <div className="container py-6">
                    <div className="row align-items-center">
                        <InfoContact />
                        <div className="col-lg-7">
                            <div className="contact-form">
                                <form onSubmit={handleSubmitAds}>
                                    {/* Các trường nhập liệu khác */}
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
                                                    name="contactEmail"
                                                    value={formData.contactEmail}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
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
                                                    name="contactPhone"
                                                    value={formData.contactPhone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
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
                                                placeholder="Home Page"
                                                name="location"
                                                value={formData.location}
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
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <textarea
                                            className="form-control border-top-0 border-right-0 border-left-0 p-2"
                                            rows="3"
                                            placeholder="Description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
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
                                                name="link"
                                                value={formData.link}
                                                onChange={handleInputChange}
                                            />
                                        </div>
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
                                                    name="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6 form-group">
                                            <div className="input-group">
                                                <span className="input-group-text ads-input-icon bg-info text-white border-0">
                                                    <i className="fa fa-calendar"></i>
                                                </span>
                                                <input
                                                    type="date"
                                                    className="form-control border-top-0 border-right-0 border-left-0 p-2"
                                                    name="endDate"
                                                    value={formData.endDate}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Upload Advertisement Image</label>
                                        <input
                                            type="file"
                                            className="form-control border-0 p-2"
                                            accept="image/*"
                                            name="image"
                                            onChange={handleOnchangeImg}
                                        />

                                        {selectedImage && (
                                            <div className="mt-3">
                                                <img src={selectedImage} alt="Selected Preview" className="img-thumbnail" style={{ maxWidth: "300px" }} />
                                            </div>
                                        )}
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
        </motion.div>
    );
};
