import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { MdOndemandVideo, MdOutlinePlayLesson } from "react-icons/md";

const CourseContent = ({ chapter }) => {
  // Quản lý trạng thái mở/đóng của các chương
  const chapters = chapter?.chapters || [];

  const [expandedLessons, setExpandedLessons] = useState({});

  // Xử lý mở/đóng các bài giảng trong mỗi chương
  const handleToggleLesson = (index) => {
    setExpandedLessons((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="course-content-container">
      <h2 className="course-content-header">Course content</h2>
      <p className="course-content-summary">
        {chapters.length} Chapter •{" "}
        {chapters.reduce((acc, chapter) => acc + (chapter.lessonDto?.length || 0), 0)} lessons
      </p>

      <div className="course-chapters">
        {chapters.map((chapter, index) => (
          <div key={chapter.chapterId} className="course-chapter">
            {/* Tiêu đề chương */}
            <div
              className="chapter-header"
              onClick={() => handleToggleLesson(index)}
            >
              <span>{chapter.chapterName}</span>
              <span className="chapter-info">
                {chapter.lessonDto?.length || 0} <MdOutlinePlayLesson className="lesson-number"/>{" "}
                {expandedLessons[index] ? (
                  <FaChevronDown className="chapter-icon open" />
                ) : (
                  <FaChevronRight className="chapter-icon" />
                )}
              </span>
            </div>

            {/* Danh sách bài giảng bên trong chương */}
            {expandedLessons[index] && (
              <div className="chapter-lectures">
                <ul>
                  {chapter.lessonDto.map((lesson, lessonIndex) => (
                    <li key={lesson.lessonId} className="lecture-item">
                      <MdOndemandVideo className="lecture-icon" />{" "}
                      {lesson.lessonName || "No Title"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;
