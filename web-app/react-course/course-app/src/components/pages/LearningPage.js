import React, { useEffect, useState } from 'react';
import { TopBar } from '../layouts/TopBar';
import { Header } from '../layouts/Header';
import { useParams } from 'react-router-dom';

export const LearningPage = () => {
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);  // Bài học hiện tại
    const [openSections, setOpenSections] = useState({});  // Trạng thái mở của các chương

    const fetchLessonByCourseId = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/v1/info-course/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch lessons');
            }
            const data = await response.json();
            console.log(data)
            setLessons(data.result.lessons || []);
            setLoading(false);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLessonByCourseId();
    }, [id]);

    const toggleSection = (sectionId) => {
        setOpenSections(prevState => ({
            ...prevState,
            [sectionId]: !prevState[sectionId]
        }));
    };

    const handleLessonClick = (lesson) => {
        if (lesson.lessonContentDto && lesson.lessonContentDto.length > 0) {
            const videoContent = lesson.lessonContentDto.find(content => content.contentType === "video"); 
            if (videoContent) {
                setCurrentLesson(videoContent); 
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <TopBar />
            <Header />
            <div className="lp-learning-container">

                {/* Bên trái: Danh sách phần và bài học */}
                <div className="lp-lesson-list">
                    <h3>Course content</h3>
                    {lessons.map((lesson, index) => (
                        <div key={index} className="lesson-section">
                            <div className="sections-title" onClick={() => toggleSection(index)}>
                                <h4>
                                    {lesson.lessonName} <span className="toggle-icon">
                                        {openSections[index] ? <i className="fas fa-chevron-down"></i> : <i className="fas fa-chevron-right"></i>}
                                    </span>
                                </h4>
                            </div>

                            {openSections[index] && (
                                <ul className="lesson-list">
                                    <li key={lesson.lessonId} className="lesson-item" onClick={() => handleLessonClick(lesson)}>
                                        <i className="fa fa-file"></i>
                                        {/* Display the lesson description */}
                                        <span>{lesson.lessonDescription}</span>
                                    </li>
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bên phải: Video và mô tả */}
                <div className="lp-video-content">
                    {currentLesson ? (
                        <div>
                            <h3>{currentLesson.contentDescription}</h3>
                            <video key={currentLesson.contentUrl} width="100%" height={750} controls>
                                <source src={currentLesson.contentUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <p>Chọn một bài học để xem nội dung</p>
                    )}  
                </div>
            </div>
        </div>
    );
};
