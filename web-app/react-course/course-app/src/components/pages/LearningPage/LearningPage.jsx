import React, { useEffect, useState } from 'react';
import { TopBar } from '../../layouts/TopBar';
import { Header } from '../../layouts/Header';
import { useParams } from 'react-router-dom';

export const LearningPage = () => {
    useEffect(() => {
        document.title = 'Learning';
    });

    const { id } = useParams();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [chapters, setChapters] = useState([]);  // Danh sách các chương từ API
    const [currentLesson, setCurrentLesson] = useState(null);  // Bài học hiện tại
    const [openSections, setOpenSections] = useState({});  // Trạng thái mở của các chương

    // Lấy dữ liệu các chương và bài học
    useEffect(() => {
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
                console.log(data);
                setChapters(data.result.chapters || []);
                setLoading(false);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLessonByCourseId();
    }, [id, token]);

    // Đóng/mở chương học
    const toggleSection = (sectionId) => {
        setOpenSections(prevState => ({
            ...prevState,
            [sectionId]: !prevState[sectionId]
        }));
    };

    // Xử lý khi chọn bài học trong một chương
    const handleLessonClick = (lesson) => {
        if (lesson.videoUrl) {
            setCurrentLesson(lesson);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <TopBar />
            <Header />
            <div className='content-page'>
                <div className="lp-learning-container d-flex">
                    {/* Bên trái: Danh sách chương và bài học */}
                    <div className="lp-lesson-list">
                        <h3>Course Content</h3>
                        {chapters.map((chapter, index) => (
                            <div key={index} className="lesson-section">
                                {/* Tiêu đề chương */}
                                <div className="sections-title" onClick={() => toggleSection(chapter.chapterId)}>
                                    <h4>
                                        {chapter.chapterName}{" "}
                                        <span className="toggle-icon">
                                            {openSections[chapter.chapterId] ? (
                                                <i className="fas fa-chevron-down"></i>
                                            ) : (
                                                <i className="fas fa-chevron-right"></i>
                                            )}
                                        </span>
                                    </h4>
                                </div>

                                {/* Danh sách bài học trong chương */}
                                {openSections[chapter.chapterId] && chapter.lessonDto && (
                                    <ul className="lesson-list">
                                        {chapter.lessonDto.map((lesson, lessonIndex) => (
                                            <li
                                                key={lessonIndex}
                                                className="lesson-item"
                                                onClick={() => handleLessonClick(lesson)}
                                            >
                                                <i className="fa fa-file-video"></i>
                                                <span>{`Lesson: ${lesson.lessonName}`}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Bên phải: Video và mô tả bài học */}
                    <div className="lp-video-content">
                        {currentLesson ? (
                            <div>
                                <h3>{currentLesson.lessonName}</h3>
                                <video
                                    key={currentLesson.videoUrl}
                                    width="100%"
                                    height={750}
                                    controls
                                >
                                    <source src={currentLesson.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : (
                            <p>Chọn một bài học để xem nội dung</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPage;
