import { useEffect, useState } from "react";
import { deleteCourse, getCoursesByTeacher } from "../../../service/CourseService";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import Swal from "sweetalert2";
import { GiOpenBook } from "react-icons/gi";
import { getMyInfo } from "../../../service/UserService";
import axios from '../../../utils/CustomizeAxios';
import { toast, ToastContainer } from "react-toastify";
import { FaBook, FaClock, FaDollarSign, FaFileAlt, FaImage, FaLanguage, FaPlayCircle, FaTags, FaUpload, FaUserTie } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";

const ManagerCourse = () => {

    const token = localStorage.getItem('token');
    const [courses, setCourses] = useState([]);
    const [isLoadingCourse, setIsLoadingCourse] = useState(true);
    const [httpError, setHttpError] = useState('');
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null)
    const [showImageModal, setShowImageModal] = useState(false);
    const [instructorName, setInstructorName] = useState('');
    const [loading, setLoading] = useState(false);
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

    const handleCreateCourse = () => {
        setShowModalCreate(true);
    }

    const [courseData, setCourseData] = useState({
        courseTitle: '',
        courseDescription: '',
        level: '',
        duration: '',
        coursePrice: 0,
        language: '',
        instructorName: '',
        courseThumbnail: null,
        courseFile: null,
    });

    useEffect(() => {
        getMyInfo()
            .then((response) => {
                setInstructorName(response.result.firstName + ' ' + response.result.lastName);
            })
            .catch((error) => console.log(error));
    })

    const handleChange = (key, value) => {
        setCourseData(prevData => ({
            ...prevData,
            [key]: value
        }));
    };

    const handleUploadCourse = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData();
        const dataCourse = new Blob([JSON.stringify({
            title: courseData.courseTitle,
            description: courseData.courseDescription,
            points: courseData.coursePrice,
            duration: courseData.duration,
            language: courseData.language,
            courseLevel: courseData.level
        })], { type: 'application/json' });

        formData.append('courseRequest', dataCourse);
        formData.append('thumbnail', courseData.courseThumbnail);
        if (courseData.courseFile !== null) {
            formData.append('video', courseData.courseFile);
        }

        try {
            const response = await axios.post(`api/v1/create-course`, formData);
            if (response && response.data && response.data.code === 201) {
                toast.success('Created Course Successfully');
                const newCourse = {
                    id: response.data.result.id,
                    title: response.data.result.title,
                    description: response.data.result.description,
                    points: response.data.result.points,
                    duration: response.data.result.duration,
                    language: response.data.result.language,
                    courseLevel: response.data.result.courseLevel,
                    thumbnail: response.data.result.thumbnail,
                    instructorName: response.data.result.author || instructorName
                };
                console.log(newCourse);

                setCourses((prevCourses) => [...prevCourses, newCourse]);
                setCourseData({
                    courseTitle: '',
                    courseDescription: '',
                    level: '',
                    duration: '',
                    coursePrice: 0,
                    language: '',
                    instructorName: '',
                    courseThumbnail: null,
                    courseFile: null,
                });
                setPreviewUrl(null);
                setVideoPreviewUrl(null);
                setShowModalCreate(false);
            } else {
                toast.error('Created Course Error');
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
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
                <div className="d-flex justify-content-end mb-4">
                    <button
                        className="btn btn-create-course d-flex align-items-center justify-content-center"
                        onClick={handleCreateCourse}
                    >
                        <GiOpenBook size={20} className="mr-2" /> Create Course
                    </button>
                </div>
                {showModalCreate && (
                    <div
                        className="modal fade show"
                        style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
                        tabIndex="-1"
                        aria-labelledby="modalCreateCourseLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-xl modal-dialog-centered">
                            <div className="modal-content create-course-modal">
                                <div className="modal-header create-course-header">
                                    <h5 className="modal-title create-course-title" id="modalCreateCourseLabel">
                                        Create New Course
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModalCreate(false)}
                                    ></button>
                                </div>
                                <div className="modal-body create-course-body">
                                    <form className="create-course-form">
                                        {/* Row 1: Instructor và Course Title */}
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label htmlFor="instructorName" className="create-course-label">
                                                    <FaUserTie className="me-2" />Instructor Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control create-course-input"
                                                    id="author"
                                                    placeholder="Enter author name"
                                                    value={instructorName}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="courseTitle" className="create-course-label">
                                                    <FaBook className="me-2" />Course Title
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control create-course-input"
                                                    id="title"
                                                    value={courseData.courseTitle}
                                                    onChange={(e) => handleChange('courseTitle', e.target.value)}
                                                    placeholder="Enter course title"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {/* Row 2: Description */}
                                        <div className="row mb-3">
                                            <div className="col-12">
                                                <label htmlFor="courseDescription" className="create-course-label">
                                                    <FaFileAlt className="me-2" />Course Description
                                                </label>
                                                <textarea
                                                    className="form-control create-course-input"
                                                    id="description"
                                                    rows="3"
                                                    value={courseData.courseDescription}
                                                    onChange={(e) => handleChange('courseDescription', e.target.value)}
                                                    placeholder="Enter course description"
                                                ></textarea>
                                            </div>
                                        </div>
                                        {/* Row 3: Level, Duration, Price */}
                                        <div className="row mb-3">
                                            <div className="col-md-4">
                                                <label htmlFor="level" className="create-course-label">
                                                    <FaTags className="me-2" />Level
                                                </label>
                                                <select
                                                    className="form-select create-course-input"
                                                    id="level"
                                                    aria-label="Select course level"
                                                    required
                                                    value={courseData.level}
                                                    onChange={(e) => handleChange('level', e.target.value)}
                                                >
                                                    <option value="" disabled>Select level</option>
                                                    <option value="BEGINNER">Beginner</option>
                                                    <option value="INTERMEDIATE">Intermediate</option>
                                                    <option value="ADVANCED">Advanced</option>
                                                    <option value="EXPERT">Expert</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="courseDuration" className="create-course-label">
                                                    <FaClock className="me-2" />Duration (hours)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control create-course-input"
                                                    id="courseDuration"
                                                    placeholder="Enter the duration"
                                                    value={courseData.duration}
                                                    onChange={(e) => handleChange('duration', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="coursePrice" className="create-course-label">
                                                    <FaDollarSign className="me-2" />Points
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control create-course-input"
                                                    id="price"
                                                    placeholder="Enter course price"
                                                    value={courseData.coursePrice}
                                                    onChange={(e) => handleChange('coursePrice', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {/* Row 4: Language */}
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label htmlFor="language" className="create-course-label">
                                                    <FaLanguage className="me-2" />Language
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control create-course-input"
                                                    id="language"
                                                    placeholder="Enter the course language"
                                                    value={courseData.language}
                                                    onChange={(e) => handleChange('language', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {/* Row 5: Thumbnail và Video */}
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label htmlFor="courseThumbnail" className="create-course-label">
                                                    <FaImage className="me-2" />Thumbnail
                                                </label>
                                                <input
                                                    type="file"
                                                    className="form-control create-course-input"
                                                    accept="image/*"
                                                    id="courseThumbnail"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            handleChange('courseThumbnail', file);
                                                            setPreviewUrl(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                    required
                                                />
                                                {previewUrl && (
                                                    <div className="create-course-thumbnail-preview mt-2">
                                                        <img
                                                            src={previewUrl}
                                                            alt="Preview"
                                                            className="create-course-thumbnail-img"
                                                        />
                                                        <div className="create-course-thumbnail-overlay">
                                                            <button
                                                                type="button"
                                                                className="btn btn-light btn-sm create-course-overlay-btn"
                                                                onClick={() => setPreviewUrl("")}
                                                            >
                                                                <i className="fas fa-trash-alt"></i>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-light btn-sm create-course-overlay-btn"
                                                                onClick={() => setShowImageModal(true)}
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="courseFile" className="create-course-label">
                                                    <FaPlayCircle className="me-2" />Course Video
                                                </label>
                                                <input
                                                    type="file"
                                                    className="form-control create-course-input"
                                                    accept="video/*"
                                                    id="courseFile"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0]; // Lấy file video
                                                        if (file) {
                                                            handleChange('courseFile', file); // Lưu file vào state courseData
                                                            setVideoPreviewUrl(URL.createObjectURL(file)); // Tạo URL preview video
                                                        }
                                                    }}
                                                />
                                                {videoPreviewUrl && (
                                                    <div className="create-course-video-preview mt-2">
                                                        <video
                                                            src={videoPreviewUrl}
                                                            className="create-course-video"
                                                            controls
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer create-course-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary create-course-close-btn"
                                        onClick={() => setShowModalCreate(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary create-course-save-btn d-flex align-items-center justify-content-center"
                                        onClick={handleUploadCourse}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <TailSpin
                                                height="20"
                                                width="20"
                                                color="#ffffff"
                                                ariaLabel="loading-spinner"
                                            />
                                        ) : (
                                            <>
                                                <FaUpload className="me-2" /> Upload
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Modal Preview Image */}
                {showImageModal && (
                    <div
                        className="modal fade show"
                        style={{ display: "block", background: "rgba(0, 0, 0, 0.8)" }}
                        tabIndex="-1"
                        aria-labelledby="imagePreviewModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="imagePreviewModalLabel">
                                        Image Preview
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowImageModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body text-center">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="my-course-grid">
                    {courses.map(course => (
                        <div key={course.id} className="my-course-item">
                            <div className="card h-100 shadow-sm border-0 my-course-card">
                                <div className="my-course-thumbnail-wrapper">
                                    <img
                                        src={course.thumbnail}
                                        className="card-img-top img-fluid my-course-thumbnail"
                                        alt={course.title}
                                    />
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
                                    <h5 className="card-title text-primary font-weight-bold my-course-title">
                                        {course.title}
                                    </h5>

                                    <p className="card-text text-dark my-course-author">
                                        <strong>Author:</strong> {instructorName}
                                    </p>

                                    <p className="card-text my-course-level">
                                        <span className="d-flex align-items-center">
                                            <i className="fa fa-signal text-success mr-2"></i>
                                            <strong>Level:</strong> {course.courseLevel}
                                        </span>
                                    </p>

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
            <ToastContainer
                position="top-right"
                autoClose={3000}
                className="custom-toast-container"
            />
        </div>
    );
}

export default ManagerCourse