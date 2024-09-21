import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Footer } from '../layouts/Footer';
import Pagination from '../common/Pagination'; // Import component Pagination
import { TopBar } from '../layouts/TopBar';
import { Header } from '../layouts/Header';

const FavoriteCourses = () => {
    const token = localStorage.getItem('token');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:8080/api/v1/fetch-all-favorites?page=${currentPage}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch favorite courses');
                }

                const data = await response.json();

                if (data.result && Array.isArray(data.result.data)) {
                    setFavorites(data.result.data);
                    setTotalPages(data.result.totalPages || 1);
                } else {
                    setFavorites([]);
                    setTotalPages(0);
                }
            } catch (error) {
                console.error('Error fetching favorite courses:', error);
                setFavorites([]);
                setTotalPages(0);
                setError('Failed to load favorite courses');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [token, currentPage]);

    // Chuyển đổi trang
    const changePage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div>
            <TopBar />
            <Header />
            <div className="container">
                <h2>Your Favorite Courses</h2><br />

                {/* Hiển thị danh sách khóa học */}
                <div className="row">
                    {loading ? (
                        <div className="col-12 text-center">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        favorites && favorites.length > 0 ? (
                            favorites.map((favorite) => (
                                <div className="col-lg-4 col-md-6 pb-4" key={favorite.courseId}>
                                    <Link className="courses-list-item" to={`/course-detail/${favorite.courseId}`}>
                                        <img className="img-fluid" src={favorite.thumbnail || 'default-thumbnail.jpg'} alt="Course Thumbnail" />
                                        <div className="courses-info">
                                            <div className="courses-author">
                                                <span><i className="fa fa-user mr-2"></i>{favorite.author || 'Unknown Author'}</span>
                                            </div>
                                            <div className="courses-title">
                                                {favorite.title || 'No Title Available'}
                                            </div>
                                            <div className="course-meta">
                                                <span><i className="fa fa-star mr-2"></i>4.5 (250)</span>
                                            </div>

                                            <div className="course-price mt-2">
                                                <strong>Price: </strong>
                                                <span className="course-price-value">{favorite.points} <i class="fa-solid fa-coins coins-course-favorite"></i></span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <p>No favorite courses available.</p>
                            </div>
                        )
                    )}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    changePage={changePage}
                />
            </div>
            <Footer />
        </div>
    );
};

export default FavoriteCourses;
