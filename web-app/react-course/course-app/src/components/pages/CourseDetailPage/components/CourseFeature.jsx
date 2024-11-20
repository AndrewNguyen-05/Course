import { useNavigate } from "react-router-dom";

export const CourseFeature = ({ course, handleEnrollNow, isPurchase, id, relatedCourses }) => {
    const navigate = useNavigate();
    if (!course) {
        return <div>Course data is not available</div>;
    }


    const handleCourseDetail = (courseId) => {
        navigate(`/course-detail/${courseId}`); // Chuyển hướng đến đúng URL chi tiết
    };


    return (
        <div className="col-lg-4 mt-5 mt-lg-0">
            {/* Container chính của Course Features */}
            <div className="course-features-container mb-5 py-4 px-4 shadow-lg">
                <h3 className="course-features-title text-white py-3 px-4 m-0">
                    Course Features
                </h3>

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
                    <h6 className="text-white my-2">{course.averageRating} <small>(250)</small></h6>
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

                {/* Price */}
                <h5 className="course-price text-white py-3 px-4 m-0">
                    <i className="fa fa-money mr-2 text-warning"></i>
                    Course Price: {course.points}
                    <span className="currency">
                        <i className="fa-solid fa-coins coins-course"></i>
                    </span>
                </h5>

                {/* Enroll Now Button */}
                <div className="py-3 px-4">
                    <button
                        className="btn enroll-now-btn btn-block py-3 px-5"
                        onClick={() => {
                            if (isPurchase) {
                                window.location.href = `http://localhost:3000/lesson-detail/${id}`;
                            } else {
                                handleEnrollNow();
                            }
                        }}
                    >
                        {isPurchase ? "Learn Now" : "Enroll Now"}
                    </button>
                </div>
            </div>

            {/* Related Courses */}
            <div className="related-courses-container mt-4">
                <h4 className="text-white mb-3">Related Courses</h4>
                <div className="related-courses-list">
                    {relatedCourses && relatedCourses.length > 0 ? (
                        relatedCourses.map((related) => (
                            <div
                                key={related.id}
                                onClick={() => handleCourseDetail(related.id)}
                                className="related-course-item d-flex align-items-center mb-3 p-3 bg-dark text-white rounded shadow-sm"
                            >
                                <img
                                    src={related.thumbnail}
                                    alt={related.title}
                                    className="related-course-thumbnail rounded"
                                    style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                />
                                <div className="related-course-info ml-3">
                                    <h6 className="course-title mb-1">{related.title}</h6>
                                    <p className="course-author text-muted mb-1">By {related.author}</p>
                                    <span className="course-points badge badge-primary">
                                        {related.points} Points
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">No related courses available</p>
                    )}
                </div>
            </div>
        </div>
    );
};
