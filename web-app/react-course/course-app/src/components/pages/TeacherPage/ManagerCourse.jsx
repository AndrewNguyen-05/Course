import { useEffect, useState } from "react";
import { deleteCourse, getCoursesByTeacher } from "../../../service/CourseService";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import Swal from "sweetalert2";

const ManagerCourse = () => {

    const token = localStorage.getItem('token');
    const [courses, setCourses] = useState([]);
    const [isLoadingCourse, setIsLoadingCourse] = useState(true);
    const [httpError, setHttpError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoursesByTeacher = async () => {
            try {
                const data = await getCoursesByTeacher();
                setCourses(data.result);
                setIsLoadingCourse(false);
            } catch (error) {
                console.log(error);
                setHttpError(error);
            } finally {
                setIsLoadingCourse(false);
            }
        }

        fetchCoursesByTeacher();
    }, [token]);

    const handleDetail = (id) => {
        navigate(`/manager-course/${id}`)
    }

    const handleDeleteCourse = async (courseId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this course?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete now!',
            cancelButtonText: 'No, cancel.'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteCourse(courseId);
                    if (response && response.code === 200) {
                        setCourses((prevCourses) => prevCourses.filter(course => course.id !== courseId));
                        Swal.fire('Deleted!', 'The course has been deleted.', 'success');
                    } else {
                        Swal.fire('Error!', 'Failed to delete the course.', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error!', 'An unexpected error occurred.', 'error');
                }
            }
        });
    }


    if (isLoadingCourse) {
        return (
            <LoadingSpinner />
        );
    }

    if (httpError) {
        return <div>{httpError}</div>;
    }

    return (
        <div className='mycousrse-page'>
            <div className="container-fluid my-course-container my-5">
                <div className="my-course-grid">
                    {courses.map(course => (
                        <div key={course.id} className="my-course-item">
                            <div className="card h-100 shadow-sm border-0 my-course-card">
                                {/* Hình ảnh khóa học */}
                                <div className="my-course-thumbnail-wrapper">
                                    <img
                                        src={course.thumbnail}
                                        className="card-img-top img-fluid my-course-thumbnail"
                                        alt={course.title}
                                    />
                                    {/* Nút "Học ngay" hiển thị khi hover */}
                                    <div className="my-course-hover-overlay">
                                        <button
                                            className="btn btn-primary my-course-start-learning-btn"
                                            onClick={() => handleDetail(course.id)}
                                        >
                                            Detail
                                        </button>

                                        <button
                                            className="btn btn-primary my-course-remove-learning-btn"
                                            onClick={() => handleDeleteCourse(course.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body">
                                    {/* Tiêu đề khóa học */}
                                    <h5 className="card-title text-primary font-weight-bold my-course-title">
                                        {course.title}
                                    </h5>

                                    {/* Tác giả khóa học */}
                                    <p className="card-text text-dark my-course-author">
                                        <strong>Author:</strong> {course.author}
                                    </p>

                                    {/* Level của khóa học */}
                                    <p className="card-text my-course-level">
                                        <span className="d-flex align-items-center">
                                            <i className="fa fa-signal text-success mr-2"></i>
                                            <strong>Level:</strong> {course.courseLevel}
                                        </span>
                                    </p>

                                    {/* Giá khóa học */}
                                    <p className="my-course-price text-dark">
                                        <span className="d-flex align-items-center">
                                            <i className="fa fa-coins text-warning mr-2"></i>
                                            <strong>Points:</strong>
                                            <span className="ml-1">{course.points}</span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ManagerCourse