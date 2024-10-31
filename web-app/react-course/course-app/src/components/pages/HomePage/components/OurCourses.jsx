import { Link, useNavigate } from "react-router-dom";

export const OurCourses = (props) => {

  const { courses, handleAddToFavorites, hasMore, loadMoreCourses } = props;
  const navigate = useNavigate();
  const hanleDetailCourse = (id) => {
    navigate(`/course-detail/${id}`)
  }
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
            <div className="course-card-custom-design-container shadow-sm">
              {/* Ảnh bìa */}
              <div className="course-card-custom-image-container" onClick={() => hanleDetailCourse(course.id)}>
                <img
                  className="course-card-custom-image"
                  src={course.thumbnail}
                  alt={course.title}
                />
              </div>

              {/* Nội dung khóa học */}
              <div className="course-card-custom-body text-center">
                {/* Tiêu đề khóa học */}
                <h5 className="course-card-custom-title">{course.title}</h5>

                {/* Tác giả khóa học */}
                <p className="course-card-custom-author">
                  <i className="fa fa-user mr-2"></i>
                  {course.author}
                </p>
              </div>
              {/* Nút "Course Detail" và "Thêm vào khóa học yêu thích" */}
              <div className="course-card-custom-footer text-center">
                <Link
                  className="course-card-custom-btn"
                  to={`/course-detail/${course.id}`}
                >
                  Course Detail
                </Link>
                {/* Nút thêm vào khóa học yêu thích với icon trái tim */}
                <button
                  className="course-card-custom-btn-favorite mt-2"
                  onClick={() => handleAddToFavorites(course.id)}
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
          <button
            className="btn btn-primary"
            style={{ width: "150px" }}
            onClick={loadMoreCourses}
          >
            Xem thêm
          </button>
        ) : (
          <p className="text-center">Đã tải hết các khóa học</p>
        )}
      </div>
    </div>
  );
};
