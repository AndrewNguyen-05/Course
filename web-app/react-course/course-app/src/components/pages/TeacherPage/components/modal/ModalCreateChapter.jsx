import { motion } from "framer-motion";

const ModalCreateChapter = (props) => {

    const {
        chapterName,
        setChapterName,
        description,
        setDescriptionChapter,
        onClose,
        handleCreateChapter,
        isLoadingCreateChapter
    } = props;

    const buttonVariants = {
        animate: {
            opacity: [1, 0.7, 1],
            transition: {
                repeat: Infinity,
                duration: 1,
            },
        },
    };

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

    return (
        <div className="create-chapter-modal">
            <div className="create-chapter-modal-content">
                <span className="create-chapter-modal-close" onClick={onClose}>&times;</span>
                <h2>Create New Chapter</h2>
                <form>
                    <div className="create-chapter-input-group">
                        <label>Chapter Name:</label>
                        <input
                            type="text"
                            value={chapterName}
                            onChange={(e) => setChapterName(e.target.value)}
                            placeholder="Enter chapter name"
                            required
                        />
                    </div>
                    <div className="create-chapter-input-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescriptionChapter(e.target.value)}
                            placeholder="Enter chapter description"
                            required
                        ></textarea>
                    </div>
                    <div className="create-chapter-actions">
                        <button type="button" className="create-chapter-btn-cancel" onClick={onClose}>Cancel</button>
                        <motion.button
                            type="button"
                            className="create-chapter-btn-save"
                            onClick={handleCreateChapter}
                            disabled={isLoadingCreateChapter}
                            variants={buttonVariants}
                            animate={isLoadingCreateChapter ? "animate" : ""}
                        >
                            {isLoadingCreateChapter && (
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
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalCreateChapter;
