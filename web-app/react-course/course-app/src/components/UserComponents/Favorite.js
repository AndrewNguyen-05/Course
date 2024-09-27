import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Footer } from '../layouts/Footer';
import Pagination from '../common/Pagination';
import { TopBar } from '../layouts/TopBar';
import { Header } from '../layouts/Header';
import { getFavorite, removeFavorite } from '../../service/FavoriteService';
import { toast, ToastContainer } from 'react-toastify';

// Import icons từ react-icons
import { FaTrashAlt } from 'react-icons/fa';  // Biểu tượng thùng rác
import { MdOutlineDescription } from 'react-icons/md';  // Biểu tượng chi tiết

const FavoriteCourses = () => {
    const token = localStorage.getItem('token');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Favorite';
    });

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getFavorite(currentPage, token);
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

    const handleDeleteFavorite = async (favoriteId) => {
        try {
            await removeFavorite(token, favoriteId);
            setFavorites((prevFavorites) => prevFavorites.filter(favorite => favorite.favoriteId !== favoriteId));
            toast.success('Deleted favorite successfully');
        } catch (error) {
            console.error('Error deleting favorite:', error);
            toast.error('Failed to delete favorite');
        }
    };

    return (
        <div>
            <TopBar />
            <Header />
            <div className="container">
                <h2 className='vip-title'>Your Favorite Courses</h2><br />

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
                                <div className="col-lg-4 col-md-6 pb-4" key={favorite.favoriteId}>
                                    <div className="courses-list-item">
                                        <Link to={`/course-detail/${favorite.courseId}`}>
                                            <img className="img-fluid" src={favorite.thumbnail || 'default-thumbnail.jpg'} alt="Course Thumbnail" />
                                        </Link>
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
                                                <span className="course-price-value">{favorite.points} <i className="fa-solid fa-coins coins-course-favorite"></i></span>
                                            </div>

                                            {/* Thêm hàng chứa 2 nút (Course Detail và Remove Favorite) */}
                                            <div className="d-flex justify-content-between mt-3">
                                                {/* Nút Course Detail */}
                                                <Link to={`/course-detail/${favorite.courseId}`} className="btn btn-outline-primary">
                                                    <MdOutlineDescription className="mr-2" />
                                                    Detail
                                                </Link>

                                                {/* Nút Remove Favorite */}
                                                <button className="btn btn-outline-danger" onClick={() => handleDeleteFavorite(favorite.favoriteId)}>
                                                    <FaTrashAlt className="mr-2" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
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
            <ToastContainer
                position="top-right"
                autoClose={3000}
                className="custom-toast-container"
            />

            <Footer />
        </div>
    );
};

export default FavoriteCourses;
