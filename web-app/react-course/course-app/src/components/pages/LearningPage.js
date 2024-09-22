import React, { useState } from 'react';
import { TopBar } from '../layouts/TopBar';
import { Header } from '../layouts/Header';

export const LearningPage = () => {
    const [lessons, setLessons] = useState([
        { id: 1, title: 'Introduction to the Specialization', duration: 1, videoUrl: 'https://res.cloudinary.com/dznef2sae/video/upload/v1726715425/courses/fwylx2hnym7zpqgbuzp3.mp4', description: 'This is an introduction to the specialization.' },
        { id: 2, title: 'Introduction to the Course', duration: 2, videoUrl: 'https://res.cloudinary.com/dznef2sae/video/upload/v1726726234/courses/b15haqf71sae1vmw6phg.mp4', description: 'This video introduces the course.' },
        { id: 3, title: 'Meet Your Instructor', duration: 1, videoUrl: 'https://sample-videos.com/video123/mp4/480/asdasdas.mp4', description: 'Meet your instructor for the course.' },
        { id: 4, title: 'Syllabus Overview', duration: 15, videoUrl: 'https://sample-videos.com/video123/mp4/480/asdasdas.mp4', description: 'Here is the syllabus overview.' }
    ]);

    const [currentLesson, setCurrentLesson] = useState(lessons[0]);

    const handleLessonClick = (lesson) => {
        setCurrentLesson(lesson);  // Chuyển bài học khi nhấp vào
    };

    const handleNextLesson = () => {
        const currentIndex = lessons.findIndex((lesson) => lesson.id === currentLesson.id);
        if (currentIndex < lessons.length - 1) {
            setCurrentLesson(lessons[currentIndex + 1]);  // Chuyển đến bài học tiếp theo
        }
    };

    return (
        <div>
            <TopBar />
            <Header />
            <div className="lp-learning-container">
                {/* Bên trái: Danh sách bài học */}
                <div className="lp-lesson-list">
                    <h3>Lessons</h3>
                    <ul>
                        {lessons.map((lesson) => (
                            <li
                                key={lesson.id}
                                className={lesson.id === currentLesson?.id ? "active" : ""}
                                onClick={() => handleLessonClick(lesson)}  // Gọi hàm để cập nhật bài học khi click
                            >
                                <i className="fa fa-play-circle"></i>
                                <span>{lesson.title}</span>
                                <small>{lesson.duration} min</small>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bên phải: Video và mô tả */}
                <div className="lp-video-content">
                    <div className="lp-video-header">
                        <h3>{currentLesson?.title}</h3>
                        <button className="lp-next-button" onClick={handleNextLesson}>
                            Next
                        </button>
                    </div>
                    <div className="lp-video-player">
                        {currentLesson && (
                            <video key={currentLesson.videoUrl} width="100%" controls>
                                <source src={currentLesson.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                    <p className="lp-description">{currentLesson?.description}</p>
                </div>
            </div>

        </div>
    );
};
