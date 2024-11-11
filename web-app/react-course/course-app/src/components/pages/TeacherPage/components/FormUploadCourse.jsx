import { FaBook, FaClock, FaDollarSign, FaFileAlt, FaImage, FaLanguage, FaSpinner, FaTags, FaUpload, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";

const FormUploadCourse = (props) => {
    const {
        handleSubmit,
        courseData,
        handleChange,
        loading
    } = props;

    return (
        <form onSubmit={handleSubmit} className="create-course-form">
            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="courseTitle" className="create-course-label">
                        <FaBook className="me-2" /> Course Title
                    </label>
                    <input
                        type="text"
                        className="form-control create-course-input"
                        id="courseTitle"
                        placeholder="Enter the course title"
                        value={courseData.courseTitle}
                        onChange={(e) => handleChange('courseTitle', e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="level" className="create-course-label">
                        <FaTags className="me-2" /> Level
                    </label>
                    <select
                        className="form-select create-course-input"
                        id="level"
                        value={courseData.level}
                        onChange={(e) => handleChange('level', e.target.value)}
                        required
                    >
                        <option value="" disabled>Choose a Level</option>
                        <option value="BEGINNER">BEGINNER</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                        <option value="EXPERT">EXPERT</option>
                    </select>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="language" className="create-course-label">
                        <FaLanguage className="me-2" /> Language
                    </label>
                    <input
                        type="text"
                        className="form-control create-course-input"
                        id="language"
                        placeholder="Enter the language"
                        value={courseData.language}
                        onChange={(e) => handleChange('language', e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="courseDuration" className="create-course-label">
                        <FaClock className="me-2" /> Duration (hours)
                    </label>
                    <input
                        type="number"
                        className="form-control create-course-input"
                        id="courseDuration"
                        placeholder="Enter the duration"
                        value={courseData.duration}
                        onChange={(e) => handleChange('duration', e.target.value)}
                        min="0"
                        required
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="coursePrice" className="create-course-label">
                        <FaDollarSign className="me-2" /> Points (1000 VND = 10 Points)
                    </label>
                    <input
                        type="number"
                        className="form-control create-course-input"
                        id="coursePrice"
                        placeholder="Enter the price"
                        value={courseData.coursePrice}
                        onChange={(e) => handleChange('coursePrice', e.target.value)}
                        min="0"
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="instructorName" className="create-course-label">
                        <FaUserTie className="me-2" /> Instructor Name
                    </label>
                    <input
                        type="text"
                        className="form-control create-course-input"
                        id="instructorName"
                        placeholder="Enter the instructor's name"
                        // value={courseData.instructorName}
                        readOnly
                        required
                    />
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="courseDescription" className="create-course-label">
                    <FaFileAlt className="me-2" /> Course Description
                </label>
                <textarea
                    className="form-control create-course-input"
                    id="courseDescription"
                    rows="4"
                    placeholder="Enter the description"
                    value={courseData.courseDescription}
                    onChange={(e) => handleChange('courseDescription', e.target.value)}
                    required
                ></textarea>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="courseThumbnail" className="create-course-label">
                        <FaImage className="me-2" /> Upload Thumbnail
                    </label>
                    <input
                        className="form-control create-course-input"
                        type="file"
                        id="courseThumbnail"
                        onChange={(e) => handleChange('courseThumbnail', (e.target.files[0]))}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="courseFile" className="create-course-label">
                        <FaFileAlt className="me-2" /> Upload Course File
                    </label>
                    <input
                        className="form-control create-course-input"
                        type="file"
                        id="courseFile"
                        onChange={(e) => handleChange('courseFile', (e.target.files[0]))}
                        required
                    />
                </div>
            </div>

            <div className="d-grid">
                <motion.button
                    type="submit"
                    className="btn create-course-button"
                    disabled={loading}
                    initial={{ scale: 1 }}
                    animate={loading ? { scale: 0.95 } : { scale: 1 }}
                    whileHover={!loading ? { scale: 1.03 } : {}}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    {loading ? (
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            style={{ display: "inline-block" }}
                        >
                            <FaSpinner className="me-2" />
                        </motion.span>
                    ) : (
                        <>
                            <FaUpload className="me-2" /> Upload Course
                        </>
                    )}
                </motion.button>
            </div>
        </form>
    );
}

export default FormUploadCourse;
