export const CourseFeatur = ({course, handleEnrollNow, isPurchase, id}) => {
    if (!course) {
        return <div>Course data is not available</div>;
    }
    return (
        <div className="col-lg-4 mt-5 mt-lg-0">
            <div className="course-features-container mb-5 py-4 px-4 shadow-lg">
                <h3 className="course-features-title text-white py-3 px-4 m-0">Course Features</h3>

                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                    <h6 className="text-white my-2">
                        <i className="fa fa-user mr-2 text-info"></i> Instructor
                    </h6>
                    <h6 className="text-white my-2">{course.author}</h6>
                </div>

                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                    <h6 className="text-white my-2">
                        <i className="fa fa-star mr-2 text-warning"></i> Rating
                    </h6>
                    <h6 className="text-white my-2">4.5 <small>(250)</small></h6>
                </div>

                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                    <h6 className="text-white my-2">
                        <i className="fa fa-book mr-2 text-success"></i> Lectures
                    </h6>
                    <h6 className="text-white my-2">15</h6>
                </div>

                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                    <h6 className="text-white my-2">
                        <i className="fa fa-clock mr-2 text-danger"></i> Duration
                    </h6>
                    <h6 className="text-white my-2">{course.duration} hours</h6>
                </div>

                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                    <h6 className="text-white my-2">
                        <i className="fa fa-signal mr-2 text-warning"></i> Skill level
                    </h6>
                    <h6 className="text-white my-2">{course.courseLevel}</h6>
                </div>

                <div className="course-feature-item d-flex justify-content-between px-4 py-2">
                    <h6 className="text-white my-2">
                        <i className="fa fa-language mr-2 text-purple"></i> Language
                    </h6>
                    <h6 className="text-white my-2">{course.language}</h6>
                </div>

                <h5 className="course-price text-white py-3 px-4 m-0">
                    <i className="fa fa-money mr-2 text-warning"></i>
                    Course Price: {course.points}
                    <span className="currency"><i className="fa-solid fa-coins coins-course"></i></span>
                </h5>

                <div className="py-3 px-4">
                    <button
                        className="btn enroll-now-btn btn-block py-3 px-5"
                        onClick={() => {
                            if(isPurchase){
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
        </div>
    );
}