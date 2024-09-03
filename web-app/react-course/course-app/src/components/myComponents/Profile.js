import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { UseAuth } from "../authentication/UseAuth";

export const Profile = () => {

    const { isTokenValid, handleLogout } = UseAuth();
    const navigate = useNavigate();

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

    // Xử lý thay đổi hình đại diện
    const handleOnChangeAvatar = (event) => {
        const file = event.target.files[0];
    
        // Upload file lên dịch vụ lưu trữ và nhận đường dẫn
        uploadAvatar(file).then(url => {
            setProfileData({
                ...profileData,
                avatar: url // Lưu đường dẫn ảnh vào profileData
            });
            setSelectedImage(url); // Hiển thị ảnh đã upload
        });
    };

    const uploadAvatar = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "upload"); 
    
        const response = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
            method: "POST",
            body: formData
        });
    
        const data = await response.json();
        return data.secure_url; // Đường dẫn của ảnh đã upload
    };

    // Xử lý thay đổi dữ liệu trong form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    // Lấy dữ liệu người dùng khi component được mount
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
                setSelectedImage(data.result.avatar || '');
            }
        })
        .catch(error => {
            console.log('Get Info User Fail ', error);
        });
    }, []);

    // Cập nhật thông tin người dùng
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
                alert("Profile updated successfully");
                navigate('/profile');
            } else {
                throw new Error("Failed to update profile");
            }
        })
        .catch(error => console.error('Error updating profile:', error));
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
                                    <li></li>) // Hiển thị khi đang kiểm tra token, không hiện gì

                                    : isTokenValid ? ( // nếu token đúng
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
                                    ) : ( // token sai thì hiện Login
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
            <hr /><br />

            {/* FORM INFO AND UPDATE PROFILE */}

            <div className="container">
                <div className="row gutters">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="account-settings">
                                    <div className="user-profile">
                                        <div className="user-avatar">
                                            <img src={selectedImage || "https://bootdey.com/img/Content/avatar/avatar7.png"}
                                                alt="User Avatar"
                                                id="avatar-preview" />
                                        </div>
                                        <div className="account-title">
                                            <div className="button-container">
                                                <input type="file"
                                                    className="form-control"
                                                    id="url-update-avatar"
                                                    name="file"
                                                    accept="image/*"
                                                    onChange={handleOnChangeAvatar} // upload avatar
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="about">
                                        <h5 className="text-primary mb-2">Biography</h5>
                                        <textarea
                                            className="form-control form-control-sm"
                                            rows="2"
                                            placeholder="Enter My Biography"
                                            style={{ width: '100%', maxWidth: '300px', resize: 'none', textAlign: 'center' }}
                                            name="description"
                                            value={profileData.description}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="row gutters">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <h6 className="mb-2 text-primary">Personal Details</h6>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="firstname">First Name</label>
                                            <input type="text"
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
                                            <label htmlFor="lastname">Last Name</label>
                                            <input type="text"
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
                                            <label htmlFor="gender" className="form-label">Gender:</label>
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
                                            <label htmlFor="phone">Phone</label>
                                            <input type="text"
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
                                            <label htmlFor="birthday">Date Of Birth</label>
                                            <input type="date"
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
                                            <label htmlFor="skillLevel">Current Skill Level</label>
                                            <select
                                                className="form-control"
                                                id="skillLevel"
                                                name="courseLevel"
                                                value={profileData.courseLevel}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select your skill level</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="Street">Address</label>
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
                                            <label htmlFor="ciTy">Description</label>
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
        </div>
    );
}
