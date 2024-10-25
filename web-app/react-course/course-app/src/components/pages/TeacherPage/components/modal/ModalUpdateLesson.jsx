import { motion } from "framer-motion";
import { FaFileAlt, FaTimes, FaVideo } from "react-icons/fa";

const ModalUpdateLesson = ({
    isEditMode,
    handleCloseUpdateLesson,
    lessonName,
    setLessonName,
    descriptionLesson,
    setDescriptionLesson,
    handleVideoChange,
    loadingUpdateLesson,
    handleUpdateLesson,
    video
}) => {
    if (!isEditMode) return null;

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
                    <h2>Edit Lesson</h2>
                    <button className="create-lesson-close-button" onClick={handleCloseUpdateLesson}>
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
                        <label htmlFor="video"><FaVideo color="#28a745" /> Edit Video</label>
                        <input
                            type="file"
                            id="video"
                            accept="video/*"
                            onChange={handleVideoChange}
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
                            onClick={handleUpdateLesson}
                        >
                            {loadingUpdateLesson ? "Updating..." : "Update"}
                        </motion.button>
                        <button
                            type="button"
                            className="create-lesson-cancel-button"
                            onClick={handleCloseUpdateLesson}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ModalUpdateLesson;
