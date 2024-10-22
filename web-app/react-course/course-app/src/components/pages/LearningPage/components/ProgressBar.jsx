import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProgressBar = (props) => {
    const currentLesson = 6;
    const totalLessons = 172;

    const progressPercentage = totalLessons > 0 ? Math.round((currentLesson / totalLessons) * 100) : 0;

    // Tính toán strokeDashoffset để đảm bảo không bị NaN
    const strokeDashoffset = !isNaN(progressPercentage) ? 88 - (progressPercentage * 88 / 100) : 88;

    const navigate = useNavigate();

    const handleClickToHome = () => {
        navigate("/")
    }

    return (
        <div className="progress-bar-container">
            <div className="progress-bar-course-info">
                <div className="progress-bar-back-button">
                    <button className="circle-back-button" onClick={handleClickToHome}>
                        <FaChevronLeft />
                    </button>
                </div>
                <div className="progress-bar-course-title">
                    {props.courseTitle}
                </div>
                <div className="progress-bar-right-section">
                    <div className="progress-bar-progress-details">
                        <div className="progress-bar-circle-percentage">
                            <svg width="30" height="30">
                                <circle
                                    cx="15"
                                    cy="15"
                                    r="14"
                                    stroke="#e0e0e0"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <circle
                                    cx="15"
                                    cy="15"
                                    r="14"
                                    stroke="#4caf50"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray="88"
                                    strokeDashoffset={strokeDashoffset}
                                    transform="rotate(-90 15 15)"
                                />
                            </svg>
                            <span className="progress-bar-percentage-text">
                                {progressPercentage}%
                            </span>
                        </div>
                        <div className="progress-bar-lesson-info">
                            {currentLesson}/{totalLessons} Lesson
                        </div>
                    </div>
                    <div className="progress-bar-extra-options">
                        <span className="progress-bar-note-icon">📝 Note</span>
                        <span className="progress-bar-help-icon">❓ Instruct</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
