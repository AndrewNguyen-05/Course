import React, { useEffect, useRef, useState } from "react";
import { UseAuth } from "../authentication/UseAuth";
import { HandleLogout } from "../authentication/HandleLogout";
import { useLocation, Link } from "react-router-dom";
import { TopBar } from "./TopBar";
import { NavigationMenu } from "./NavigationMenu";
import { NotificationDropdown } from "./NotificationDropdown";
import { Card } from "./Cart";
import { Message } from "./Message";
import { Favorites } from "./Favorites";
import { ProfileDropdown } from "./ProfileDropdown";

export const Search = ({ onSearch }) => {
    const [loggedOut, setLoggedOut] = useState(false);
    const { isTokenValid } = UseAuth({ loggedOut });
    const { handleLogout } = HandleLogout({ setLoggedOut });

    const location = useLocation();
    const underlineRef = useRef(null);
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const activeLink = document.querySelector(`.nav-item.active`);
        if (activeLink && underlineRef.current) {
            underlineRef.current.style.left = `${activeLink.offsetLeft}px`;
            underlineRef.current.style.width = `${activeLink.offsetWidth}px`;
        }
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

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
    }, [token]);

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
        }).catch(error => console.log(error));
    }, [token]);


    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [courseLevel, setCourseLevel] = useState('');
    const [language, setLanguage] = useState('');

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');



    const handleSearch = () => {
        let filterQuery = '';

        if (title) {
            filterQuery += `title~~'*${title}*'`;
        }
        if (author) {
            filterQuery += (filterQuery ? ' and ' : '') + `author.name~~'*${author}*'`;
        }
        if (courseLevel) {
            filterQuery += (filterQuery ? ' and ' : '') + `courseLevel~~'*${courseLevel}*'`;
        }
        if (language) {
            filterQuery += (filterQuery ? ' and ' : '') + `language~~'*${language}*'`;
        }
        if (minPrice) {
            filterQuery += (filterQuery ? ' and ' : '') + `price>:${minPrice}`;
        }
        if (maxPrice) {
            filterQuery += (filterQuery ? ' and ' : '') + `price<:${maxPrice}`;
        }

        if (filterQuery) {
            onSearch(filterQuery);  // Gọi hàm tìm kiếm với query filter
            console.log(courseLevel);

        } else {
            alert('Please enter at least one search criterion.');
        }
    };

    // Components Search này chỉ có nhiệm vụ: thu thập giá trị mà người dùng nhập vào sau đó truyền lên component Courses thông qua hàm OnSearch
    // Khi người dùng nhấn nút Search, dữ liệu này sẽ được truyền ngược lên Courses thông qua hàm onSearch.

    return (
        <div>
            <TopBar />
            <div className="container-fluid p-0">
                <nav className="navbar navbar-expand-lg bg-white navbar-light py-3 py-lg-0 px-lg-5">
                    <Link to="/home" className="navbar-brand ml-lg-3">
                        <h1 className="m-0 text-uppercase text-primary rounded">
                            <i className="fa fa-book-reader mr-3"></i>D-LEARNING
                        </h1>
                    </Link>
                    <button type="button" className="navbar-toggler rounded" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between px-lg-3" id="navbarCollapse">
                        <NavigationMenu isActive={isActive} underlineRef={underlineRef} />

                        <div className="navbar-nav ml-auto d-flex align-items-center">
                            <NotificationDropdown />
                            <Card />
                            <Message />
                            <Favorites />
                            <ProfileDropdown
                                avatar={avatar}
                                isTokenValid={isTokenValid}
                                role={role}
                                handleLogout={handleLogout}
                            />
                        </div>

                    </div>
                </nav>
            </div>
            <div className="container-fluid mb-5">
                <div className="search-bar p-4 rounded shadow-sm custom-search-bar">
                    <div className="row justify-content-center align-items-center">

                        {/* Title Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <input
                                type="text"
                                className="form-control search-input custom-input"
                                placeholder="Search by Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Author Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <input
                                type="text"
                                className="form-control search-input custom-input"
                                placeholder="Search by Author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </div>

                        {/* Course Level Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <select
                                className="form-control search-input custom-input"
                                value={courseLevel}
                                onChange={(e) => setCourseLevel(e.target.value)}
                            >
                                <option value="">All Levels</option>
                                <option value="BEGINNER">BEGINNER</option>
                                <option value="INTERMEDIATE">INTERMEDIATE</option>
                                <option value="ADVANCED">ADVANCED</option>
                                <option value="EXPERT">EXPERT</option>
                            </select>
                        </div>

                        {/* Language Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <select
                                className="form-control search-input custom-input"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="">All Languages</option>
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                            </select>
                        </div>

                        {/* Min Price Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <input
                                type="number"
                                className="form-control search-input custom-input"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </div>

                        {/* Max Price Search */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <input
                                type="number"
                                className="form-control search-input custom-input"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>

                        {/* Search Button */}
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <button className="btn btn-primary btn-block custom-btn" onClick={handleSearch}>
                                Search
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}
