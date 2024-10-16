import { Link } from "react-router-dom";

export const ViewCouses = ({ courses }) => {
    return (
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
                                <span><i className="fa fa-star mr-2"></i>{course.averageRating} (250)</span>
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
    );
}