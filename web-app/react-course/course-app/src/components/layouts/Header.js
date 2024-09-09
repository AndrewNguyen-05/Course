import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UseAuth } from '../authentication/UseAuth.js';
import { HandleLogout } from '../authentication/HandleLogout.js';

export const Header = () => {


    const { isTokenValid } = UseAuth();
    const { handleLogout } = HandleLogout();

    const location = useLocation();
    const underlineRef = useRef(null);
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        if (!role && !token) {
            setLoading(false);
            return;
        }

        if (token && !role) {
            fetch(`http://localhost:8080/api/v1/auth/introspect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token })
            }).then((response) => response.json()
            ).then(data => {
                console.log(data)
                localStorage.setItem('role', data.result.scope);
            }).catch(error => console.log(error))
        }
    }, [token])

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8080/api/v1/get-avatar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json()
        ).then(data => {
            console.log(data.result);
            const urlAvatar = data.result;
            setAvatar(urlAvatar);
        }).catch(error => console.log(error))
    }, [token]);

    useEffect(() => {
        const activeLink = document.querySelector(`.nav-item.active`);
        if (activeLink && underlineRef.current) {
            underlineRef.current.style.left = `${activeLink.offsetLeft}px`;
            underlineRef.current.style.width = `${activeLink.offsetWidth}px`;
        }
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    return (
        <div>
            <div className="container-fluid bg-dark">
                <div className="row py-2 px-lg-5">
                    <div className="col-lg-6 text-center text-lg-left mb-2 mb-lg-0">
                        <div className="d-inline-flex align-items-center text-white">
                            <small><i className="fa fa-phone-alt mr-2"></i>+012 345 6789</small>
                            <small className="px-3">|</small>
                            <small><i className="fa fa-envelope mr-2"></i>ducdeptrai@gmail.com</small>
                        </div>
                    </div>
                    <div className="col-lg-6 text-center text-lg-right">
                        <div className="d-inline-flex align-items-center">
                            <a className="text-white px-2" href="#">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a className="text-white px-2" href="#">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a className="text-white px-2" href="#">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a className="text-white px-2" href="#">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a className="text-white pl-2" href="#">
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navbar Start */}
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
                        <div className="navbar-nav mx-auto py-0 position-relative">
                            <Link to="/home" className={`nav-item nav-link rounded ${isActive('/home') ? 'active' : ''}`}>Home</Link>
                            <Link to="/about" className={`nav-item nav-link rounded ${isActive('/about') ? 'active' : ''}`}>About</Link>
                            <Link to="/courses" className={`nav-item nav-link rounded ${isActive('/courses') ? 'active' : ''}`}>Courses</Link>
                            <div className="nav-item dropdown rounded">
                                <a href="#" className="nav-link dropdown-toggle rounded" data-bs-toggle="dropdown">Pages</a>
                                <div className="dropdown-menu m-0 rounded">
                                    <Link to="/course-detail" className={`dropdown-item rounded ${isActive('/course-detail') ? 'active' : ''}`}>Course Detail</Link>
                                    <Link to="/our-feature" className={`dropdown-item rounded ${isActive('/our-feature') ? 'active' : ''}`}>Our Features</Link>
                                    <Link to="/instructor" className={`dropdown-item rounded ${isActive('/instructor') ? 'active' : ''}`}>Instructors</Link>
                                    <Link to="/testimonial" className={`dropdown-item rounded ${isActive('/testimonial') ? 'active' : ''}`}>Testimonial</Link>
                                </div>
                            </div>
                            <Link to="/contact" className={`nav-item nav-link rounded ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
                            <div className="underline" ref={underlineRef}></div>
                        </div>

                        <div className="navbar-nav ml-auto d-flex align-items-center">
                            {/* Nút thông báo */}
                            <div className="nav-item dropdown mx-2">
                                <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} data-bs-toggle="dropdown">
                                    <i className="fa-solid fa-bell"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end p-3" style={{ minWidth: '300px', maxWidth: '350px' }}>
                                    <li className="dropdown-item d-flex align-items-start">
                                        <img src="https://via.placeholder.com/50" alt="Notification 1" className="rounded me-2" style={{ width: '50px', height: '50px' }} />
                                        <div>
                                            <h6 className="mb-0">New Assignment Posted</h6>
                                            <small className="text-muted">10 minutes ago</small>
                                        </div>
                                    </li>
                                    <li className="dropdown-item d-flex align-items-start">
                                        <img src="https://via.placeholder.com/50" alt="Notification 2" className="rounded me-2" style={{ width: '50px', height: '50px' }} />
                                        <div>
                                            <h6 className="mb-0">Course Updated</h6>
                                            <small className="text-muted">30 minutes ago</small>
                                        </div>
                                    </li>
                                    <li className="dropdown-item d-flex align-items-start">
                                        <img src="https://via.placeholder.com/50" alt="Notification 3" className="rounded me-2" style={{ width: '50px', height: '50px' }} />
                                        <div>
                                            <h6 className="mb-0">Your Certificate is Ready</h6>
                                            <small className="text-muted">1 hour ago</small>
                                        </div>
                                    </li>
                                    <li className="dropdown-item text-center">
                                        <Link to="/notifications" className="text-primary">View All Notifications</Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Nút giỏ hàng */}
                            <div className="nav-item dropdown mx-2">
                                <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} data-bs-toggle="dropdown">
                                    <i className="fa-solid fa-shopping-cart"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li className="dropdown-item">Item 1 in Cart</li>
                                    <li className="dropdown-item">Item 2 in Cart</li>
                                    <li className="dropdown-item">Item 3 in Cart</li>
                                    <li className="dropdown-item text-center">
                                        <Link to="/cart" className="text-primary">Go to Cart</Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Nút tin nhắn */}
                            <div className="nav-item dropdown mx-2">
                                <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} data-bs-toggle="dropdown">
                                    <i className="fa-solid fa-envelope"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li className="dropdown-item">Message from Admin</li>
                                    <li className="dropdown-item">New Course Alert</li>
                                    <li className="dropdown-item text-center">
                                        <Link to="/messages" className="text-primary">View All Messages</Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Nút khóa học ưu thích */}
                            <div className="nav-item dropdown mx-2">
                                <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} data-bs-toggle="dropdown">
                                    <i className="fa-solid fa-heart"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li className="dropdown-item">Favorited Course 1</li>
                                    <li className="dropdown-item">Favorited Course 2</li>
                                    <li className="dropdown-item text-center">
                                        <Link to="/favorite-courses" className="text-primary">View All Favorites</Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Nút Profile */}

                            <div className="nav-item dropdown mx-2">
                                <button className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: '50px', height: '50px', overflow: 'hidden' }} data-bs-toggle="dropdown" aria-expanded="false">
                                    {avatar ? (
                                        <img src={avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    ) : (
                                        <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    )}
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end text-start" style={{ transform: 'translateX(-50%)', left: '50%' }}>
                                    {isTokenValid === null ? (
                                        <li></li> // Hiển thị khi đang kiểm tra token, không hiện gì

                                    ) : isTokenValid ? ( // nếu token đúng
                                        <>
                                            <li><Link to="/profile" className="dropdown-item d-flex align-items-center"><i className="fa-solid fa-address-card me-2"></i>Profile</Link></li>
                                            {role === 'TEACHER' && (
                                                <li><Link to="/manager-courses" className="dropdown-item d-flex align-items-center"><i className="fa-solid fa-book me-2"></i>My Course</Link></li>
                                            )}

                                            {role === 'USER' && (
                                                <li><Link to="/register-teacher" className="dropdown-item d-flex align-items-center"><i className="fa-solid fa-user-graduate me-2"></i>
                                                    Teach Now</Link></li>
                                            )}

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
                    </div>
                </nav>
            </div>
            {/* Navbar End */}

            {/* Header Start */}
            <div className="jumbotron jumbotron-fluid position-relative overlay-bottom" style={{ marginBottom: '90px' }}>
                <div className="container text-center my-5 py-5">
                    <h1 className="text-white mt-4 mb-4">Learn From Home</h1>
                    <h1 className="text-white display-1 mb-5">Education Courses</h1>
                    <div className="mx-auto mb-5" style={{ width: '100%', maxWidth: '600px' }}>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <button className="btn btn-outline-light bg-white text-body px-4 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Courses
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#">Courses 1</a>
                                    <a className="dropdown-item" href="#">Courses 2</a>
                                    <a className="dropdown-item" href="#">Courses 3</a>
                                </div>
                            </div>
                            <input type="text" className="form-control border-light" style={{ padding: '30px 25px' }} placeholder="Keyword" />
                            <div className="input-group-append">
                                <button style={{ backgroundColor: '#F14D5D', borderColor: '#F14D5D', color: '#FFFFFF' }} className="btn btn-secondary px-4 px-lg-5">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Header End */}
        </div>
    );
};
