import React, { useEffect, useState } from "react";
import { Carousel } from 'react-bootstrap';
import { useParams } from "react-router-dom";

export const CourseDetail = () => {

    const { id } = useParams(); // Lấy id từ url 
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`http://localhost:8080/api/v1/course/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json()
        ).then(data => {
            console.log(data);
            setCourse(data.result);
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div>Loading...</div>

    return (
        <div>
            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="mb-5">
                                <div className="section-title position-relative mb-5">
                                    <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Course Detail</h6>
                                    <h1 className="display-4">{course.title}</h1>
                                </div>
                                <img className="img-fluid rounded w-100 mb-4" src={course.thumbnail} alt="Course Detail" />
                                <p>{course.description}</p>
                            </div>

                            {/* Khóa học liên quan */}
                            <h2 className="mb-3">Related Courses</h2>
                            <Carousel>
                                <Carousel.Item>
                                    <a className="courses-list-item position-relative d-block overflow-hidden mb-2" href="detail.html">
                                        <img className="img-fluid" src={require('./../../img/courses-1.jpg')} alt="Course 1" />
                                        <div className="courses-text">
                                            <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                            <div className="border-top w-100 mt-3">
                                                <div className="d-flex justify-content-between p-4">
                                                    <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                                    <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </Carousel.Item>

                                <Carousel.Item>
                                    <div className="courses-list-item position-relative d-block overflow-hidden mb-2">
                                        <img className="img-fluid" src={require('./../../img/courses-1.jpg')} alt="Course 1" />
                                        <div className="courses-text">
                                            <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                            <div className="border-top w-100 mt-3">
                                                <div className="d-flex justify-content-between p-4">
                                                    <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                                    <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Carousel.Item>

                            </Carousel>
                        </div>


                        <div className="col-lg-4 mt-5 mt-lg-0">
                            <div className="course-features-container mb-5 py-4 px-4 shadow-lg">
                                <h3 className="course-features-title text-white py-3 px-4 m-0">Course Features</h3>

                                {/* Instructor */}
                                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-user mr-2 text-info"></i> Instructor
                                    </h6>
                                    <h6 className="text-white my-2">{course.author}</h6>
                                </div>

                                {/* Rating */}
                                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-star mr-2 text-warning"></i> Rating
                                    </h6>
                                    <h6 className="text-white my-2">4.5 <small>(250)</small></h6>
                                </div>

                                {/* Lectures */}
                                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-book mr-2 text-success"></i> Lectures
                                    </h6>
                                    <h6 className="text-white my-2">15</h6>
                                </div>

                                {/* Duration */}
                                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-clock mr-2 text-danger"></i> Duration
                                    </h6>
                                    <h6 className="text-white my-2">{course.duration} hours</h6>
                                </div>

                                {/* Skill Level */}
                                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-signal mr-2 text-warning"></i> Skill level
                                    </h6>
                                    <h6 className="text-white my-2">{course.courseLevel}</h6>
                                </div>

                                {/* Language */}
                                <div className="course-feature-item d-flex justify-content-between px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-language mr-2 text-purple"></i> Language
                                    </h6>
                                    <h6 className="text-white my-2">{course.language}</h6>
                                </div>

                                {/* Course Price */}
                                <h5 className="course-price text-white py-3 px-4 m-0">
                                    <i className="fa fa-money mr-2 text-warning"></i>
                                    Course Price: {new Intl.NumberFormat('vi-VN').format(course.price)}
                                    <span className="currency">₫</span>
                                </h5>

                                {/* Enroll Now Button */}
                                <div className="py-3 px-4">
                                    <a className="btn enroll-now-btn btn-block py-3 px-5" href="">Enroll Now</a>
                                </div>
                            </div>



                            <div className="mb-5">
                                <h2 className="mb-3">Categories</h2>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <a href="" className="text-decoration-none h6 m-0">Web Design</a>
                                        <span className="badge badge-primary badge-pill">150</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <a href="" className="text-decoration-none h6 m-0">Web Development</a>
                                        <span className="badge badge-primary badge-pill">131</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <a href="" className="text-decoration-none h6 m-0">Online Marketing</a>
                                        <span className="badge badge-primary badge-pill">78</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <a href="" className="text-decoration-none h6 m-0">Keyword Research</a>
                                        <span className="badge badge-primary badge-pill">56</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <a href="" className="text-decoration-none h6 m-0">Email Marketing</a>
                                        <span className="badge badge-primary badge-pill">98</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mb-5">
                                <h2 className="mb-4">Recent Courses</h2>
                              
                               
                                <a className="d-flex align-items-center text-decoration-none mb-4" href="">
                                    <img className="img-fluid rounded" src={require('./../../img/courses-80x80.jpg')} alt="Recent Course 3" />
                                    <div className="pl-3">
                                        <h6>Web design & development courses for beginners</h6>
                                        <div className="d-flex">
                                            <small className="text-body mr-3"><i className="fa fa-user text-primary mr-2"></i>Jhon Doe</small>
                                            <small className="text-body"><i className="fa fa-star text-primary mr-2"></i>4.5 (250)</small>
                                        </div>
                                    </div>
                                </a>
                                <a className="d-flex align-items-center text-decoration-none" href="">
                                    <img className="img-fluid rounded" src={require('./../../img/courses-80x80.jpg')} alt="Recent Course 4" />
                                    <div className="pl-3">
                                        <h6>Web design & development courses for beginners</h6>
                                        <div className="d-flex">
                                            <small className="text-body mr-3"><i className="fa fa-user text-primary mr-2"></i>Jhon Doe</small>
                                            <small className="text-body"><i className="fa fa-star text-primary mr-2"></i>4.5 (250)</small>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
