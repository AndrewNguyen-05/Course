import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


import aboutImage from './../../img/about.jpg';
import featureImage from './../../img/feature.jpg';

import instructor1Image from './../../img/duc.jpg';
import instructor2Image from './../../img/duc1.jpg';
import instructor3Image from './../../img/vu.jpg';
import instructor4Image from './../../img/nam.jpg';
import testimonial1Image from './../../img/testimonial-1.jpg';
import testimonial2Image from './../../img/testimonial-2.jpg';
import { ToastContainer } from 'react-toastify';


export const HomePage = () => {

    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);  // State để hiển thị loading
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(4);
    const [hasMore, setHasMore] = useState(true); // Trạng thái có còn dữ liệu không


    const handleChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    useEffect(() => {
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

                // Nếu là trang đầu tiên thì không cần nối thêm dữ liệu
                if (currentPage === 1) {
                    setCourses(data);
                } else {
                    setCourses(prevCourses => {
                        // Kiểm tra xem các khóa học mới có khác với các khóa học hiện tại không
                        const newCourses = data.filter(course => !prevCourses.some(prev => prev.id === course.id));
                        return [...prevCourses, ...newCourses];
                    });
                }

                if (currentPage >= totalPages) {
                    setHasMore(false); // Nếu đã tải hết các trang, không còn dữ liệu nữa
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [currentPage, pageSize]); // useEffect chạy lại mỗi khi currentPage hoặc pageSize thay đổi


    const loadMoreCourses = () => {
        if (hasMore) {
            setCurrentPage(prevPage => prevPage + 1); // Tăng trang hiện tại để tải thêm dữ liệu
        }
    };

    if (loading && currentPage === 1) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const addToFavorites = (courseId) => {
        if (!token) {
            navigate('/login');
            return;
        }
    
        fetch(`http://localhost:8080/api/v1/save-favorite?id=${courseId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to add to favorites');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 201) {
                toast.success('Course added to favorites successfully!');
            } else {
                throw new Error('Failed to add to favorites');
            }
        })
        .catch(error => {
            console.log(error)
            toast.error('Course is already in the favorites list.');
        });
    };

    return (
        <div>
            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="row">

                        {/* <div className="col-lg-5 mb-5 mb-lg-0" style={{ minHeight: '500px' }}>
                            <div className="position-relative h-100">
                                <video
                                    className="position-absolute w-100 h-100"
                                    style={{ objectFit: 'cover' }}
                                    src={videoSource}
                                    autoPlay
                                    loop
                                    controls
                                    playsInline
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div> */}

                        <div className="col-lg-5 mb-5 mb-lg-0" style={{ minHeight: '500px' }}>
                            <div className="position-relative h-100">
                                <img className="position-absolute w-100 h-100" src={aboutImage} style={{ objectFit: 'cover' }} alt="About Us" />
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="section-title position-relative mb-4">
                                <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">About Us</h6>
                                <h1 className="display-4">First Choice For Online Education Anywhere</h1>
                            </div>
                            <p>Tempor erat elitr at rebum at at clita aliquyam consetetur. Diam dolor diam ipsum et, tempor voluptua sit consetetur sit. Aliquyam diam amet diam et eos sadipscing labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor consetetur takimata eirmod, dolores takimata consetetur invidunt magna dolores aliquyam dolores dolore. Amet erat amet et magna</p>
                            <div className="row pt-3 mx-0">
                                <div className="col-3 px-0">
                                    <div className="bg-success text-center p-4">
                                        <h1 className="text-white">123</h1>
                                        <h6 className="text-uppercase text-white">Available<span className="d-block">Subjects</span></h6>
                                    </div>
                                </div>
                                <div className="col-3 px-0">
                                    <div className="bg-primary text-center p-4">
                                        <h1 className="text-white">1234</h1>
                                        <h6 className="text-uppercase text-white">Online<span className="d-block">Courses</span></h6>
                                    </div>
                                </div>
                                <div className="col-3 px-0">
                                    <div className="bg-secondary text-center p-4">
                                        <h1 className="text-white">123</h1>
                                        <h6 className="text-uppercase text-white">Skilled<span className="d-block">Instructors</span></h6>
                                    </div>
                                </div>
                                <div className="col-3 px-0">
                                    <div className="bg-warning text-center p-4">
                                        <h1 className="text-white">1234</h1>
                                        <h6 className="text-uppercase text-white">Happy<span className="d-block">Students</span></h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid bg-image" style={{ margin: '90px 0' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 my-5 pt-5 pb-lg-5">
                            <div className="section-title position-relative mb-4">
                                <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Why Choose Us?</h6>
                                <h1 className="display-4">Why You Should Start Learning with Us?</h1>
                            </div>
                            <p className="mb-4 pb-2">Aliquyam accusam clita nonumy ipsum sit sea clita ipsum clita, ipsum dolores amet voluptua duo dolores et sit ipsum rebum, sadipscing et erat eirmod diam kasd labore clita est. Diam sanctus gubergren sit rebum clita amet.</p>
                            <div className="d-flex mb-3">
                                <div className="btn-icon bg-primary mr-4">
                                    <i className="fa fa-2x fa-graduation-cap text-white"></i>
                                </div>
                                <div className="mt-n1">
                                    <h4>Skilled Instructors</h4>
                                    <p>Labore rebum duo est Sit dolore eos sit tempor eos stet, vero vero clita magna kasd no nonumy et eos dolor magna ipsum.</p>
                                </div>
                            </div>
                            <div className="d-flex mb-3">
                                <div className="btn-icon bg-secondary mr-4">
                                    <i className="fa fa-2x fa-certificate text-white"></i>
                                </div>
                                <div className="mt-n1">
                                    <h4>International Certificate</h4>
                                    <p>Labore rebum duo est Sit dolore eos sit tempor eos stet, vero vero clita magna kasd no nonumy et eos dolor magna ipsum.</p>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="btn-icon bg-warning mr-4">
                                    <i className="fa fa-2x fa-book-reader text-white"></i>
                                </div>
                                <div className="mt-n1">
                                    <h4>Online Classes</h4>
                                    <p className="m-0">Labore rebum duo est Sit dolore eos sit tempor eos stet, vero vero clita magna kasd no nonumy et eos dolor magna ipsum.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5" style={{ minHeight: '500px' }}>
                            <div className="position-relative h-100">
                                <img className="position-absolute w-100 h-100" src={featureImage} style={{ objectFit: 'cover' }} alt="Features" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid px-0 py-5">
                <div className="row mx-0 justify-content-center pt-5">
                    <div className="col-lg-6">
                        <div className="section-title text-center position-relative mb-4">
                            <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Our Courses</h6>
                            <h1 className="display-4">Checkout New Releases Of Our Courses</h1>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {courses.map((course) => (
                        <div className="col-lg-3 col-md-6 mb-4" key={course.id}>
                            <div className="course-card-custom-design-container shadow-sm">
                                {/* Ảnh bìa */}
                                <div className="course-card-custom-image-container">
                                    <img className="course-card-custom-image" src={course.thumbnail} alt={course.title} />
                                </div>

                                {/* Nội dung khóa học */}
                                <div className="course-card-custom-body text-center">
                                    {/* Tiêu đề khóa học */}
                                    <h5 className="course-card-custom-title">{course.title}</h5>

                                    {/* Tác giả khóa học */}
                                    <p className="course-card-custom-author">
                                        <i className="fa fa-user mr-2"></i>{course.author}
                                    </p>
                                </div>

                                {/* Nút "Course Detail" và "Thêm vào khóa học yêu thích" */}
                                <div className="course-card-custom-footer text-center">
                                    <Link className="course-card-custom-btn" to={`/course-detail/${course.id}`}>
                                        Course Detail
                                    </Link>

                                    {/* Nút thêm vào khóa học yêu thích với icon trái tim */}
                                    <button
                                        className="course-card-custom-btn-favorite mt-2"
                                        onClick={() => addToFavorites(course.id)}
                                    >
                                        <i className="fas fa-heart mr-2"></i>Add to Favorite
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>


                {/* Xem thêm */}
                <div className="row justify-content-center mt-4">
                    {hasMore ? (
                        <button className="btn btn-primary" style={{ width: '150px' }} onClick={loadMoreCourses}>
                            Xem thêm
                        </button>
                    ) : (
                        <p className="text-center">Đã tải hết các khóa học</p>
                    )}
                </div>
            </div>

            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="section-title text-center position-relative mb-5">
                        <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Instructors</h6>
                        <h1 className="display-4">Meet Our Instructors</h1>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-item">
                                <img className="img-fluid w-100" src={instructor1Image} alt="Instructor 1" />
                                <div className="bg-light text-center p-4">
                                    <h5 className="mb-3">Instructor Name</h5>
                                    <p className="mb-2">Web Design & Development</p>
                                    <div className="d-flex justify-content-center">
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-twitter"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-linkedin-in"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-instagram"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-youtube"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-item">
                                <img className="img-fluid w-100" src={instructor2Image} alt="Instructor 2" />
                                <div className="bg-light text-center p-4">
                                    <h5 className="mb-3">Instructor Name</h5>
                                    <p className="mb-2">Web Design & Development</p>
                                    <div className="d-flex justify-content-center">
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-twitter"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-linkedin-in"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-instagram"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-youtube"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-item">
                                <img className="img-fluid w-100" src={instructor3Image} alt="Instructor 3" />
                                <div className="bg-light text-center p-4">
                                    <h5 className="mb-3">Instructor Name</h5>
                                    <p className="mb-2">Web Design & Development</p>
                                    <div className="d-flex justify-content-center">
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-twitter"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-linkedin-in"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-instagram"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-youtube"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-item">
                                <img className="img-fluid w-100" src={instructor4Image} alt="Instructor 4" />
                                <div className="bg-light text-center p-4">
                                    <h5 className="mb-3">Instructor Name</h5>
                                    <p className="mb-2">Web Design & Development</p>
                                    <div className="d-flex justify-content-center">
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-twitter"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-linkedin-in"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-instagram"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-youtube"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid bg-image py-5" style={{ margin: '90px 0' }}>
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-5 mb-5 mb-lg-0">
                            <div className="section-title position-relative mb-4">
                                <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Testimonial</h6>
                                <h1 className="display-4">What Say Our Students</h1>
                            </div>
                            <p className="m-0">Dolor est dolores et nonumy sit labore dolores est sed rebum amet, justo duo ipsum sanctus dolore magna rebum sit et. Diam lorem ea sea at. Nonumy et at at sed justo est nonumy tempor. Vero sea ea eirmod, elitr ea amet diam ipsum at amet. Erat sed stet eos ipsum diam</p>
                        </div>
                        <div className="col-lg-7">
                            <div className="owl-carousel testimonial-carousel">
                                <div className="bg-white p-5">
                                    <i className="fa fa-3x fa-quote-left text-primary mb-4"></i>
                                    <p>Sed et elitr ipsum labore dolor diam, ipsum duo vero sed sit est est ipsum eos clita est ipsum. Est nonumy tempor at kasd. Sed at dolor duo ut dolor, et justo erat dolor magna sed stet amet elitr duo lorem</p>
                                    <div className="d-flex flex-shrink-0 align-items-center mt-4">
                                        <img className="img-fluid mr-4" src={testimonial1Image} alt="Student 1" />
                                        <div>
                                            <h5>Student Name</h5>
                                            <span>Web Design</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-5">
                                    <i className="fa fa-3x fa-quote-left text-primary mb-4"></i>
                                    <p>Sed et elitr ipsum labore dolor diam, ipsum duo vero sed sit est est ipsum eos clita est ipsum. Est nonumy tempor at kasd. Sed at dolor duo ut dolor, et justo erat dolor magna sed stet amet elitr duo lorem</p>
                                    <div className="d-flex flex-shrink-0 align-items-center mt-4">
                                        <img className="img-fluid mr-4" src={testimonial2Image} alt="Student 2" />
                                        <div>
                                            <h5>Student Name</h5>
                                            <span>Web Design</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-5 mb-5 mb-lg-0">
                            <div className="bg-light d-flex flex-column justify-content-center px-5" style={{ height: '450px' }}>
                                <div className="d-flex align-items-center mb-5">
                                    <div className="btn-icon bg-primary mr-4">
                                        <i className="fa fa-2x fa-map-marker-alt text-white"></i>
                                    </div>
                                    <div className="mt-n1">
                                        <h4>Our Location</h4>
                                        <p className="m-0">123 Street, New York, USA</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-5">
                                    <div className="btn-icon bg-secondary mr-4">
                                        <i className="fa fa-2x fa-phone-alt text-white"></i>
                                    </div>
                                    <div className="mt-n1">
                                        <h4>Call Us</h4>
                                        <p className="m-0">+012 345 6789</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="btn-icon bg-warning mr-4">
                                        <i className="fa fa-2x fa-envelope text-white"></i>
                                    </div>
                                    <div className="mt-n1">
                                        <h4>Email Us</h4>
                                        <p className="m-0">info@example.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="section-title position-relative mb-4">
                                <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Need Help?</h6>
                                <h1 className="display-4">Send Us A Message</h1>
                            </div>
                            <div className="contact-form">
                                <form>
                                    <div className="row">
                                        <div className="col-6 form-group">
                                            <input type="text" className="form-control border-top-0 border-right-0 border-left-0 p-0" placeholder="Your Name" required="required" />
                                        </div>
                                        <div className="col-6 form-group">
                                            <input type="email" className="form-control border-top-0 border-right-0 border-left-0 p-0" placeholder="Your Email" required="required" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control border-top-0 border-right-0 border-left-0 p-0" placeholder="Subject" required="required" />
                                    </div>
                                    <div className="form-group">
                                        <textarea className="form-control border-top-0 border-right-0 border-left-0 p-0" rows="5" placeholder="Message" required="required"></textarea>
                                    </div>
                                    <div>
                                        <button className="btn btn-primary py-3 px-5" type="submit">Send Message</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                className="custom-toast-container"
            />

        </div>
    );
};
