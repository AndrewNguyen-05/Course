import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseDetails,
  banCourse,
  unbanCourse,
} from "../../service/Admin_CourseService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/CourseDetail.css";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await getCourseDetails(courseId);
      setCourse(response);
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBanStatus = async () => {
    try {
      if (course.enabled) {
        await banCourse(course.id);
        toast.error(`Course "${course.title}" has been banned.`);
      } else {
        await unbanCourse(course.id);
        toast.success(`Course "${course.title}" has been unbanned.`);
      }
      setCourse({ ...course, enabled: !course.enabled });
    } catch (error) {
      console.error("Error toggling course status:", error);
      toast.error("Failed to change course status.");
    }
  };

  const handleAuthorClick = (authorId) => {
    if (authorId) {
      navigate(`/admin/users/detail/${authorId}`);
    } else {
      toast.error("Author ID is missing.");
    }
  };

  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (!course) {
    return <div className="error-message">No course found.</div>;
  }

  return (
    <div className="course-detail-container">
      <ToastContainer />
      <div className="course-header">
        <h1 className="course-title">{course.title}</h1>
        <button
          className={`status-toggle-button ${
            course.enabled ? "enabled" : "disabled"
          }`}
          onClick={handleToggleBanStatus}
        >
          {course.enabled ? "Ban Course" : "Unban Course"}
        </button>
      </div>

      <div className="course-detail-content">
        {/* Thumbnail Section */}
        <div className="course-thumbnail">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt="Course Thumbnail"
              className="thumbnail-image"
            />
          ) : (
            <p>No image available</p>
          )}
        </div>

        {/* Information Section */}
        <div className="course-info-section">
          <h2>Course Information</h2>
          <p>
            <strong>Description:</strong> {course.description}
          </p>
          <p>
            <strong>Author:</strong>{" "}
            {course.authorName && course.authorId ? (
              <span
                className="author-link"
                onClick={() => handleAuthorClick(course.authorId)}
              >
                {course.authorName}
              </span>
            ) : (
              "Unknown"
            )}
          </p>
          <p>
            <strong>Language:</strong> {course.language}
          </p>
          <p>
            <strong>Level:</strong> {course.level}
          </p>
          <p>
            <strong>Duration:</strong> {course.duration} hours
          </p>
          <p>
            <strong>Points:</strong> {course.points}
          </p>
        </div>
      </div>

      <div className="course-status-section">
        <h2>Status</h2>
        <p>
          <strong>Enabled:</strong> {course.enabled ? "Yes" : "No"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {course.createdAt
            ? new Date(course.createdAt).toLocaleString()
            : "N/A"}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {course.updatedAt
            ? new Date(course.updatedAt).toLocaleString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default CourseDetail;
