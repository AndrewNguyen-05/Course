import React from "react";
import { FaRegClock } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const OurCourses = (props) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); // Số sao đầy đủ
    const hasHalfStar = rating - fullStars >= 0.5; // Có sao nửa không?
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Số sao trống

    // Thêm sao đầy đủ
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fa fa-star text-warning"></i>);
    }

    // Thêm sao nửa nếu có
    if (hasHalfStar) {
      stars.push(
        <i key="half" className="fa fa-star-half-alt text-warning"></i>
      );
    }

    // Thêm sao trống
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fa fa-star-o text-warning"></i>);
    }

    return stars;
  };

  const { courses, handleAddToFavorites, hasMore, loadMoreCourses } = props;
  const navigate = useNavigate();

  const handleDetailCourse = (id) => {
    navigate(`/course-detail/${id}`);
  };

  return (
    <div className="container-fluid px-0 py-5">
      <div className="row mx-0 justify-content-center pt-5">
        <div className="col-lg-6">
          <div className="section-title text-center position-relative mb-4">
            <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">
              Our Courses
            </h6>
            <h1 className="display-4">Checkout New Releases Of Our Courses</h1>
          </div>
        </div>
      </div>

      <div className="row">
        {courses.map((course) => (
          <div className="col-lg-3 col-md-6 mb-4" key={course.id}>
            <div className="course-card-custom-design-container">
              {/* Hình ảnh khóa học */}
              <div
                className="course-card-custom-image-container"
                onClick={() => handleDetailCourse(course.id)}
              >
                <img
                  className="course-card-custom-image"
                  src={course.thumbnail}
                  alt={course.title}
                />
              </div>

              {/* Nội dung khóa học */}
              <div className="course-card-custom-body text-center">
                <h5 className="course-card-custom-title">{course.title}</h5>

                <p className="course-card-custom-author">
                  {course.author}
                </p>

                <div className="course-meta-home">
                  <span className="d-block">
                    {renderStars(course.averageRating)} ({course.averageRating.toFixed(1)})
                  </span>
                </div>
              </div>

              <div className="course-card-custom-footer">
                <div className="course-card-footer-item">
                  <GiTeacher />
                  <span>{course.author}</span>
                </div>
                <div className="course-card-footer-item">
                  <FaRegClock />
                  <span>{course.duration} hrs</span>
                </div>
                <div className="course-card-footer-item" onClick={() => handleAddToFavorites(course.id)}>
                  <MdFavorite />
                  <span>Favorite</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <div className="row justify-content-center mt-4">
        {hasMore ? (
          <button
            className="btn btn-primary"
            style={{ width: "120px" }}
            onClick={loadMoreCourses}
          >
            Show more
          </button>
        ) : (
          <p className="text-center">All courses loaded</p>
        )}
      </div>
    </div>
  );
};
