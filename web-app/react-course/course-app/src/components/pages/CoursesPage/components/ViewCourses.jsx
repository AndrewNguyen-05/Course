import { Link } from "react-router-dom";

export const ViewCourses = ({ courses }) => {
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating); // Số lượng sao đầy đủ
        const hasHalfStar = rating - fullStars >= 0.5; // Kiểm tra có sao nửa hay không
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Số lượng sao trống

        // Thêm sao đầy đủ
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`full-${i}`} className="fa fa-star text-warning"></i>);
        }

        // Thêm sao nửa nếu có
        if (hasHalfStar) {
            stars.push(<i key="half" className="fa fa-star-half-alt text-warning"></i>);
        }

        // Thêm sao trống
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="fa fa-star-o text-warning"></i>);
        }

        return stars;
    };

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
                                <span>
                                    {renderStars(course.averageRating)}
                                </span>
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
};
