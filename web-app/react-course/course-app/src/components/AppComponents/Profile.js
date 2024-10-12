import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProfileInfo, removeAvatar, updateAvatar, updateProfile } from "../../service/ProfileService";

export const Profile = () => {

    const token = localStorage.getItem('token');
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
    const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        phone: '',
        dob: '',
        address: '',
        description: '',
        courseLevel: '',
    });

    useEffect(() => {
        document.title = 'Frofile'
    })

    useEffect(() => {
        getProfileInfo()
            .then(data => {
                if (data.result) {
                    setProfileData({
                        avatar: data.result.avatar || '',
                        firstName: data.result.firstName || '',
                        lastName: data.result.lastName || '',
                        gender: data.result.gender || '',
                        phone: data.result.phone || '',
                        dob: data.result.dob || '',
                        address: data.result.address || '',
                        description: data.result.description || '',
                        courseLevel: data.result.courseLevel || '',
                    });
                    setSelectedImage(data.result.avatar || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg");
                }
            })
            .catch(error => {
                console.log('Get Info User Fail ', error);
            });
    }, []);

    const handleUpdateAvatar = (event) => {
        event.preventDefault();

        const fileInput = document.getElementById("url-update-avatar");
        const file = fileInput.files[0];

        if (!file) {
            toast.error('Please select an image first');
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setIsUpdatingAvatar(true);

        updateAvatar(formData)
            .then(response => {
                if (response && response.message === "Profile updated successfully") {
                    toast.success(response.message);
                } else {
                    toast.error('Avatar update failed');
                }
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to update avatar');
            })
            .finally(() => {
                setIsUpdatingAvatar(false);
            });
    };


    const handleRemoveAvatar = () => {
        setIsRemovingAvatar(true);

        removeAvatar()
            .then(() => {
                setSelectedImage("https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"); 
                toast.success('Avatar removed successfully!');
            })
            .catch(error => {
                toast.error('Failed to remove avatar');
                console.error(error);
            })
            .finally(() => {
                setIsRemovingAvatar(false);
            });
    };


    const handleUpdateProfile = () => {
        const filteredData = {};
        Object.keys(profileData).forEach(key => {
            if (profileData[key] !== null && profileData[key] !== "") {
                filteredData[key] = profileData[key];
            }
        });

        updateProfile(filteredData)
            .then(() => {
                toast.success("Profile updated successfully");
            })
            .catch(error => {
                toast.error('Error updating profile');
                console.error(error);
            })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleOnChangeAvatar = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="content-profile">
            {/* FORM INFO AND UPDATE PROFILE */}
            <div className="container">
                <div className="row gutters">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="account-settings">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <div className="user-avatar">
                                            <img
                                                src={selectedImage}
                                                alt="User Avatar"
                                                id="avatar-preview"
                                                className="rounded-circle"
                                                style={{ width: "150px", height: "150px", objectFit: "cover", border: "3px solid #007bff", cursor: "pointer" }}
                                                onClick={() => document.getElementById("url-update-avatar").click()} // Kích hoạt input ẩn khi nhấp vào ảnh
                                            />
                                        </div>
                                        <div className="account-title mt-3">
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="url-update-avatar"
                                                name="file"
                                                accept="image/*"
                                                hidden
                                                onChange={handleOnChangeAvatar}
                                            />
                                        </div>
                                        <br />
                                        <div className="d-flex mt-2">
                                            {/* Nút Update Avatar hoặc Spinner */}
                                            {isUpdatingAvatar ? (
                                                <button className="btn btn-primary btn-sm me-2" disabled>
                                                    <i className="fas fa-spinner fa-spin me-1"></i> Updating...
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm me-2"
                                                    onClick={handleUpdateAvatar}
                                                >
                                                    <i className="fas fa-upload me-1"></i> Update
                                                </button>
                                            )}

                                            {/* Nút Remove Avatar hoặc Spinner */}
                                            {isRemovingAvatar ? (
                                                <button className="btn btn-danger btn-sm" disabled>
                                                    <i className="fas fa-spinner fa-spin me-1"></i> Removing...
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={handleRemoveAvatar}
                                                >
                                                    <i className="fas fa-trash-alt me-1"></i> Remove
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="row gutters">
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="firstname" style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>First Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="firstname"
                                                name="firstName"
                                                placeholder="Enter FirstName"
                                                value={profileData.firstName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="lastname" style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>Last Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="lastname"
                                                name="lastName"
                                                placeholder="Enter LastName"
                                                value={profileData.lastName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="gender" className="form-label" style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>Gender:</label>
                                            <select
                                                className="form-control"
                                                id="gender"
                                                name="gender"
                                                value={profileData.gender}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Choice</option>
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="phone" style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>Phone</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="phone"
                                                name="phone"
                                                placeholder="Enter phone number"
                                                value={profileData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="birthday" style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>Date Of Birth</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="birthday"
                                                name="dob"
                                                placeholder="Date Of Birth"
                                                value={profileData.dob}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="skillLevel" style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>Current Skill Level</label>
                                            <select
                                                className="form-control"
                                                id="skillLevel"
                                                name="courseLevel"
                                                value={profileData.courseLevel}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select your skill level</option>
                                                <option value="BEGINNER">Beginner</option>
                                                <option value="INTERMEDIATE">Intermediate</option>
                                                <option value="ADVANCED">Advanced</option>
                                                <option value="EXPERT">Expert</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="Street" style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Street"
                                                name="address"
                                                placeholder="Enter Address"
                                                value={profileData.address}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="ciTy" style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>Description</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="ciTy"
                                                name="description"
                                                placeholder="Enter Description"
                                                value={profileData.description}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="row gutters">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <div className="text-right">
                                            <button type="button" name="submit" className="btn btn-secondary" style={{ marginRight: "10px", padding: "10px 20px", borderRadius: "5px" }}>Cancel</button>
                                            <button type="button" name="submit" className="btn btn-primary" style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: "#007bff", borderColor: "#007bff" }} onClick={handleUpdateProfile}>Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
        </div>
    );
};
