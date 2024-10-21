import { FaBook, FaClock, FaDollarSign, FaFileAlt, FaImage, FaLanguage, FaTags, FaUpload, FaUserTie } from "react-icons/fa";

const FormUploadCourse = (props) => {
    const {
        handleSubmit,
        courseTitle,
        setCourseTitle,
        level,
        setLevel,
        language,
        setLanguage,
        duration, 
        setDuration,
        coursePrice,
        setCoursePrice,
        instructorName,
        setInstructorName,
        courseDescription,
        setCourseDescription,
        setCourseFile,
        setCourseThumbnail
    } = props;

    return(
        <form onSubmit={handleSubmit}>
            <div className="row mb-4">
                <div className="col-lg-4 col-md-6">
                    <label htmlFor="courseTitle" className="form-label fs-5 text-dark fw-semibold">
                        <FaBook className="me-2 text-primary" /> Course Title
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm"
                        id="courseTitle"
                        placeholder="Enter the title of the course"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                    />
                </div>
                <div className="col-lg-4 col-md-6">
                    <label htmlFor="courseCategory" className="form-label fs-5 text-dark fw-semibold">
                        <FaTags className="me-2 text-primary" /> Level
                    </label>
                    <select
                        className="form-select rounded-pill shadow-sm"
                        id="courseCategory"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        <option value="" disabled>
                            Choose a Level
                        </option>
                        <option value="BEGINNER">BEGINNER</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                        <option value="EXPERT">EXPERT</option>
                    </select>
                </div>
                <div className="col-lg-4 col-md-6">
                    <label htmlFor="language" className="form-label fs-5 text-dark fw-semibold">
                        <FaLanguage className="me-2 text-primary" /> Language
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm"
                        id="language"
                        placeholder="Enter the language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-lg-4 col-md-6">
                    <label htmlFor="courseDuration" className="form-label fs-5 text-dark fw-semibold">
                        <FaClock className="me-2 text-primary" /> Duration (hours)
                    </label>
                    <input
                        type="number"
                        className="form-control rounded-pill shadow-sm"
                        id="courseDuration"
                        placeholder="Enter the duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        min="0"
                    />
                </div>
                <div className="col-lg-4 col-md-6">
                    <label htmlFor="coursePrice" className="form-label fs-5 text-dark fw-semibold">
                        <FaDollarSign className="me-2 text-primary" /> Point (1 VND = 10 Points)
                    </label>
                    <input
                        type="number"
                        className="form-control rounded-pill shadow-sm"
                        id="coursePrice"
                        placeholder="Enter the price"
                        value={coursePrice}
                        onChange={(e) => setCoursePrice(e.target.value)}
                        min="0"
                    />
                </div>
                <div className="col-lg-4 col-md-6">
                    <label htmlFor="instructorName" className="form-label fs-5 text-dark fw-semibold">
                        <FaUserTie className="me-2 text-primary" /> Instructor Name
                    </label>
                    <input
                        type="text"
                        className="form-control rounded-pill shadow-sm"
                        id="instructorName"
                        placeholder="Enter the instructor's name"
                        value={instructorName}
                        readOnly
                        onChange={(e) => setInstructorName(e.target.value)}
                    />
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="courseDescription" className="form-label fs-5 text-dark fw-semibold">
                    <FaFileAlt className="me-2 text-primary" /> Course Description
                </label>
                <textarea
                    className="form-control rounded shadow-sm"
                    id="courseDescription"
                    rows="5"
                    placeholder="Enter the description"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                ></textarea>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="courseThumbnail" className="form-label fs-5 text-dark fw-semibold">
                        <FaImage className="me-2 text-primary" /> Upload Thumbnail
                    </label>
                    <input
                        className="form-control rounded-pill shadow-sm"
                        type="file"
                        id="courseThumbnail"
                        onChange={(e) => setCourseThumbnail(e.target.files[0])}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="courseFile" className="form-label fs-5 text-dark fw-semibold">
                        <FaFileAlt className="me-2 text-primary" /> Upload Course File
                    </label>
                    <input
                        className="form-control rounded-pill shadow-sm"
                        type="file"
                        id="courseFile"
                        onChange={(e) => setCourseFile(e.target.files[0])}
                    />
                </div>
            </div>

            <div className="d-grid">
                <button type="submit" className="btn btn-success btn-lg rounded-pill shadow-sm upload-btn">
                    <FaUpload className="me-2" /> Upload Course
                </button>
            </div>
        </form>
    );
}

export default FormUploadCourse;