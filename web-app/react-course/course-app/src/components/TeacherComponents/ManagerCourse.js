import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../layouts/Sidebar';
import { Footer } from '../layouts/Footer';
import { Navbar } from '../layouts/Navbar';
import { UseAuth } from '../authentication/UseAuth';
import { HandleLogout } from '../authentication/HandleLogout';

export const MyCourses = () => {

    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);


    const token = localStorage.getItem('token');

    useEffect(() => {

        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8080/api/v1/my-courses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then((response) => response.json()
        ).then(data => {
            setCourses(data.result);
        }).catch(error => console.log(error));

    }, []);

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="content-wrapper w-100">
                <Navbar />
                <div className="container-fluid my-courses-container my-5">
                    <div className="row justify-content-center">
                        {courses.map(course => (
                            <div key={course.id} className="col-lg-3 col-md-6 mb-4">
                                <div className="card h-100 shadow-sm border-0">
                                    {/* Hình ảnh khóa học */}
                                    <img src={course.thumbnail} className="card-img-top" alt={course.title} />

                                    <div className="card-body">
                                        {/* Tiêu đề khóa học */}
                                        <h5 className="card-title text-primary">
                                            <span className="icon-text">
                                                <i className="fa fa-book text-warning"></i> {course.title}
                                            </span>
                                        </h5>

                                        {/* Mô tả khóa học */}
                                        <p className="card-text text-muted">
                                            <span className="icon-text">
                                                <i className="fa fa-info-circle text-info"></i> {course.description}
                                            </span>
                                        </p>

                                        {/* Level của khóa học */}
                                        <p className="card-text">
                                            <span className="icon-text">
                                                <i className="fa fa-level-up-alt text-success"></i>
                                                <strong> Level:</strong> {course.courseLevel}
                                            </span>
                                        </p>

                                        {/* Giá khóa học */}
                                        <p className="course-price">
                                            <span className="d-flex align-items-center">
                                                <i className="fa fa-money-bill-wave text-success mr-2"></i>
                                                <strong className="text-dark">Price:</strong>
                                                <span className="ml-1 text-muted">
                                                    {new Intl.NumberFormat('vi-VN').format(course.price)}
                                                    <span> ₫</span>
                                                </span>
                                            </span>
                                        </p>

                                    </div>

                                    {/* Các nút chức năng */}
                                    <div className="card-footer d-flex justify-content-between align-items-center bg-light border-0">
                                        <button className="btn btn-outline-primary btn-sm">
                                            <i className="fa fa-edit me-1"></i> Edit
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm">
                                            <i className="fa fa-trash me-1"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

