import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from "../layouts/Footer";
import { Search } from "../common/Search";
import Pagination from '../common/Pagination';

export const Courses = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [filterQuery, setFilterQuery] = useState('');

    useEffect(() => {
        document.title = 'Courses'
    })

    // Hàm lấy dữ liệu từ API
    const fetchCourses = async () => {
        setLoading(true);
        console.log(loading)
        try {
            let apiUrl = `http://localhost:8080/api/v1/courses?page=${currentPage}&size=${pageSize}`;
            if (filterQuery) {
                apiUrl += `&filter=${encodeURIComponent(filterQuery)}`;
                console.log("Filter Query:", filterQuery);
                console.log("API URL:", apiUrl);
            }

            const response = await fetch(apiUrl, { method: 'GET' });

            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            const result = await response.json();
            const { data, totalPages } = result.result;
            setTotalPages(totalPages);
            setCourses(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false); // Kết thúc trạng thái loading
        }
    };

    // Hàm thay đổi trang
    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Reset `currentPage` khi `filterQuery` thay đổi
    useEffect(() => {
        setCurrentPage(1); // Đặt lại về trang đầu tiên mỗi khi `filterQuery` thay đổi
    }, [filterQuery]);

    // Gọi `fetchCourses` mỗi khi `currentPage`, `pageSize` hoặc `filterQuery` thay đổi
    useEffect(() => {
        fetchCourses();
    }, [currentPage, pageSize, filterQuery]);

    return (
        <div>
            <Search onSearch={setFilterQuery} />
            <div className="container-fluid">
                <div className="container py-3">
                    <div className="row mx-0 justify-content-center">
                        <div className="col-lg-8">
                            <div className="section-title text-center position-relative mb-5">
                                <h1 className="display-4">Explore Our Latest Courses</h1>
                            </div>
                        </div>
                    </div>

                    {/* Lưới hiển thị khóa học */}
                    <div className="row">
                        {courses.map((course) => (
                            <div className="col-lg-4 col-md-6 pb-4" key={course.id}>
                                <Link className="courses-list-item" to={`/course-detail/${course.id}`}>
                                    <img className="img-fluid" src={course.thumbnail} alt="Course Thumbnail" />
                                    <div className="courses-info">
                                        <div className="courses-author">
                                            <span><i className="fa fa-user mr-2"></i>{course.author}</span>
                                        </div>
                                        <div className="courses-title">{course.title}</div>
                                        <div className="course-meta">
                                            <span><i className="fa fa-star mr-2"></i>4.5 (250)</span>
                                        </div>
                                        <div className="course-price mt-2">
                                            <strong>Price: </strong>
                                            <span className="course-price-value">${course.points}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Phân trang */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        changePage={changePage}
                    />
                    
                </div>
            </div>
            <Footer />
        </div>
    );
};
