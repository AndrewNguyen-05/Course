import React from "react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";

export const Courses = () => {

    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(0);

    const fetchCourses = async () => {

        try {
            const response = await fetch(`http://localhost:8080/api/v1/courses?page=${currentPage}&size=${pageSize}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            const result = await response.json();
            const { data, totalPages } = result.result;
            setTotalPages(totalPages);

            if (currentPage === 1) {
                setCourses(data);
            } else {
                setCourses(prevCourses => {
                    const newCourse = data.filter(course => !prevCourses.some(prev => prev.id === course.id))
                    return [...newCourse];
                })
            }

        } catch (err) {
            console.log(err);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCourses();
    }, [currentPage, pageSize]);

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);  // Cập nhật trang hiện tại
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <div className="row mx-0 justify-content-center">
                    <div className="col-lg-8">
                        <div className="section-title text-center position-relative mb-5">
                            <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Our Courses</h6>
                            <h1 className="display-4">Checkout New Releases Of Our Courses</h1>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {courses.map((course) => (
                        <div className="col-lg-4 col-md-6 pb-4" key={course.id}>
                            <Link className="courses-list-item" to={`/course-detail/${course.id}`}>
                                <img className="img-fluid" src={course.thumbnail} alt="Course Thumbnail" />
                                <div className="courses-info">
                                    <div className="courses-author">
                                        <span><i className="fa fa-user mr-2"></i>{course.author}</span>
                                    </div>
                                    <div className="courses-title">
                                        {course.title}
                                    </div>
                                    <div className="course-meta">
                                        <span><i className="fa fa-star mr-2"></i>4.5 (250)</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>


                <div className="col-12">
                    <nav aria-label="Page navigation">
                        <ul className="pagination pagination-lg justify-content-center mb-0">
                            {/* Previous button */}
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link rounded-0" onClick={() => changePage(currentPage - 1)} aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </button>
                            </li>

                            {/* Render dynamic page numbers */}
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => changePage(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}

                            {/* Next button */}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link rounded-0" onClick={() => changePage(currentPage + 1)} aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
        </div>

    );
}

