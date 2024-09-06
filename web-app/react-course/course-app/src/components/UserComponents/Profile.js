import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { UseAuth } from "../authentication/UseAuth";
import { Footer } from "../layouts/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Profile = () => {
    const { isTokenValid, handleLogout } = UseAuth();
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
        fetch(`http://localhost:8080/api/v1/info-user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then(response => response.json())
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
                    setSelectedImage(data.result.avatar || "https://bootdey.com/img/Content/avatar/avatar7.png");
                }
            })
            .catch(error => {
                console.log('Get Info User Fail ', error);
            });
    }, []);

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

    const handleUpdateAvatar = (event) => {
        event.preventDefault();

        if (!selectedImage) {
            toast.error('Please select an image first');
            return;
        }

        const formData = new FormData();
        formData.append("file", document.getElementById("url-update-avatar").files[0]);

        setIsUpdatingAvatar(true);

        fetch(`http://localhost:8080/api/v1/update-avatar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                toast.success('Avatar updated successfully!');
                return response.json();
            } else {
                throw new Error("Failed to update avatar");
            }
        }).then(data => {
            if (data && data.avatarUrl) {
                setSelectedImage(data.avatarUrl);
                toast.success('Avatar updated successfully!');
            }
        }).catch(error => {
            toast.error('Failed to update avatar');
            console.error(error);
        }).finally(() => {
            setIsUpdatingAvatar(false);
        });
    };

    const handleRemoveAvatar = () => {
        setIsRemovingAvatar(true);

        fetch(`http://localhost:8080/api/v1/remove-avatar`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => {
            if (response.ok) {
                setSelectedImage("https://bootdey.com/img/Content/avatar/avatar7.png");
                toast.success('Avatar removed successfully!');
            } else {
                throw new Error("Failed to remove avatar");
            }
        }).catch(error => {
            toast.error('Failed to remove avatar');
            console.error(error);
        }).finally(() => {
            setIsRemovingAvatar(false);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    
    const handleUpdateProfile = () => {
        const filteredData = {};
        Object.keys(profileData).forEach(key => {
            if (profileData[key] !== null && profileData[key] !== "") {
                filteredData[key] = profileData[key];
            }
        });

        fetch('http://localhost:8080/api/v1/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(filteredData)
        })
            .then(response => {
                if (response.ok) {
                    toast.success("Profile updated successfully");
                } else {
                    throw new Error("Failed to update profile");
                }
            })
            .catch(error => {
                toast.error('Error updating profile');
                console.error('Error updating profile:', error);
            });
    };

    return (
        <div>
            <div className="container-fluid bg-dark">
                <div className="row py-2 px-lg-5">
                    <div className="col-lg-6 text-center text-lg-left mb-2 mb-lg-0">
                        <div className="d-inline-flex align-items-center text-white">
                            <small><i className="fa fa-phone-alt mr-2"></i>+012 345 6789</small>
                            <small className="px-3">|</small>
                            <small><i className="fa fa-envelope mr-2"></i>info@example.com</small>
                        </div>
                    </div>
                    <div className="col-lg-6 text-center text-lg-right">
                        <div className="d-inline-flex align-items-center">
                            <a className="text-white px-2" href="">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a className="text-white px-2" href="">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a className="text-white px-2" href="">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a className="text-white px-2" href="">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a className="text-white pl-2" href="">
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid p-0">
                <nav className="navbar navbar-expand-lg bg-white navbar-light py-3 py-lg-0 px-lg-5">
                    <Link to="/home" className="navbar-brand ml-lg-3">
                        <h1 className="m-0 text-uppercase text-primary rounded">
                            <i className="fa fa-book-reader mr-3"></i>Edukate
                        </h1>
                    </Link>
                    <button type="button" className="navbar-toggler rounded" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between px-lg-3" id="navbarCollapse">
                        <div className="navbar-nav mx-auto py-0">
                            <Link to="/home" className="nav-item nav-link active rounded">Home</Link>
                            <Link to="/about" className="nav-item nav-link rounded">About</Link>
                            <Link to="/courses" className="nav-item nav-link rounded">Courses</Link>
                            <div className="nav-item dropdown rounded">
                                <Link to="#" className="nav-link dropdown-toggle rounded" data-bs-toggle="dropdown">Pages</Link>
                                <div className="dropdown-menu m-0 rounded">
                                    <Link to="/course-detail" className="dropdown-item rounded">Course Detail</Link>
                                    <Link to="/our-feature" className="dropdown-item rounded">Our Features</Link>
                                    <Link to="/instructor" className="dropdown-item rounded">Instructors</Link>
                                    <Link to="/testimonial" className="dropdown-item rounded">Testimonial</Link>
                                </div>
                            </div>
                            <Link to="/contact" className="nav-item nav-link rounded">Contact</Link>
                        </div>

                        <div className="nav-item dropdown">
                            <button className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }} data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa-solid fa-user-graduate"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end text-start" style={{ transform: 'translateX(-50%)', left: '50%' }}>
                                {isTokenValid === null ? (
                                    <li></li>) : isTokenValid ? (
                                        <>
                                            <li><Link to="/profile" className="dropdown-item d-flex align-items-center"><i className="fa-solid fa-address-card me-2"></i>Profile</Link></li>
                                            <li><Link to="/deposit" className="dropdown-item d-flex align-items-center"><i className="fa-brands fa-bitcoin me-2"></i>Deposit</Link></li>
                                            <li><Link to="/change-password" className="dropdown-item d-flex align-items-center"><i className="fa-solid fa-key me-2"></i>Password</Link></li>
                                            <li>
                                                <Link to="/logout" className="dropdown-item d-flex align-items-center" id="logout" onClick={handleLogout}>
                                                    <i className="fa-solid fa-sign-out-alt me-2"></i>Logout
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                    <li>
                                        <Link to="/login" className="dropdown-item d-flex align-items-center" id="login">
                                            <i className="fa-solid fa-sign-in-alt me-2"></i>Login
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

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
                                                style={{ width: "150px", height: "150px", objectFit: "cover", border: "3px solid #007bff" }}
                                            />
                                        </div>
                                        <div className="account-title mt-3">
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="url-update-avatar"
                                                name="file"
                                                accept="image/*"
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

            <Footer />
        </div>
    );
};
