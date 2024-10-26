import React from 'react';
import { FaTimes, FaVideo, FaFileAlt, FaBookReader } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ModalCreateLesson = (props) => {
    const {
        isModalLessonOpen, 
        handleCloseModalLesson,
        handleCreateLesson,
        lessonName, 
        setLessonName,
        descriptionLesson, 
        setDescriptionLesson,
        setVideo, 
        video,
        loadingCreateLesson
    } = props;

    if (!isModalLessonOpen) return null;

    const spinnerVariants = {
        animate: {
            rotate: 360,
            transition: {
                repeat: Infinity,
                duration: 0.6,
                ease: "linear",
            },
        },
    };

    const buttonVariants = {
        animate: {
            opacity: [1, 0.7, 1],
            transition: {
                repeat: Infinity,
                duration: 1,
            },
        },
    };

    return (
        <div className="create-lesson-modal-overlay">
            <motion.div
                className="create-lesson-modal"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
            >
                <div className="create-lesson-modal-header">
                    <div className="logo-container">
                        <FaBookReader className="modal-logo" />
                        <h2>D-LEARNING</h2>
                    </div>
                    <button className="create-lesson-close-button" onClick={handleCloseModalLesson}>
                        <FaTimes />
                    </button>
                </div>
                <div className="create-lesson-modal-form">
                    <div className="create-lesson-form-group">
                        <label htmlFor="lessonName"><FaFileAlt color="#007bff" /> Lesson Name</label>
                        <input
                            type="text"
                            id="lessonName"
                            placeholder="Enter lesson name"
                            value={lessonName}
                            onChange={(e) => setLessonName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="create-lesson-form-group">
                        <label htmlFor="description"><FaFileAlt color="#007bff" /> Description</label>
                        <textarea
                            id="description"
                            placeholder="Enter lesson description"
                            value={descriptionLesson}
                            onChange={(e) => setDescriptionLesson(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="create-lesson-form-group">
                        <label htmlFor="video"><FaVideo color="#28a745" /> Upload Lesson Video</label>
                        <input
                            type="file"
                            id="video"
                            accept="video/*"
                            onChange={(e) => setVideo(e.target.files[0])}
                            required
                        />
                    </div>
                    {video && (
                        <div className="current-video-preview">
                            <label>Current Video:</label>
                            <video src={typeof video === 'string' ? video : URL.createObjectURL(video)} controls width="100%" />
                        </div>
                    )}
                    <div className="create-lesson-form-actions">
                        <motion.button
                            type="button"
                            className="create-lesson-submit-button"
                            onClick={handleCreateLesson}
                            disabled={loadingCreateLesson}
                            variants={buttonVariants}
                            animate={loadingCreateLesson ? "animate" : ""}
                        >
                            {loadingCreateLesson && (
                                <motion.div
                                    className="loading-spinner"
                                    variants={spinnerVariants}
                                    animate="animate"
                                    style={{
                                        width: 16,
                                        height: 16,
                                        border: "3px solid #f3f3f3",
                                        borderTop: "3px solid #007bff",
                                        borderRadius: "50%",
                                        display: "inline-block",
                                        marginRight: 8,
                                    }}
                                />
                            )}
                            Create
                        </motion.button>
                        <button
                            type="button"
                            className="create-lesson-cancel-button"
                            onClick={handleCloseModalLesson}
                            disabled={loadingCreateLesson}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ModalCreateLesson;
