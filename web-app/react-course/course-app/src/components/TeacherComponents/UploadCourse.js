import React, { useState } from 'react';
import { FaUpload, FaBook, FaTags, FaDollarSign, FaFileAlt, FaClock } from 'react-icons/fa'; // Import thêm FaClock icon
import { Footer } from '../layouts/Footer';
import { Navbar } from '../layouts/Navbar';
import { TopBar } from '../layouts/TopBar';

export const UploadCourse = () => {
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [level, setLevel] = useState('');
    const [duration, setDuration] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [courseFile, setCourseFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ courseTitle, courseDescription, level, duration, coursePrice, courseFile });
    };

    return (
        <div className="upload-course-container">
            <TopBar/>
            <Navbar />
            <div className="container upload-container my-5">
                <div className="row justify-content-center">
                    <div className="col-lg-7 col-md-9">
                        <div className="card shadow-lg border-0 rounded-4 bg-light">
                            <div className="card-body p-5">
                                <h3 className="card-title text-center mb-4 text-dark fw-bold">
                                    <FaUpload className="me-2" /> Upload New Course
                                </h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
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
                                    <div className="mb-4">
                                        <label htmlFor="courseDescription" className="form-label fs-5 text-dark fw-semibold">
                                            <FaFileAlt className="me-2 text-primary" /> Course Description
                                        </label>
                                        <textarea
                                            className="form-control rounded shadow-sm"
                                            id="courseDescription"
                                            rows="4"
                                            placeholder="Enter the description of the course"
                                            value={courseDescription}
                                            onChange={(e) => setCourseDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mb-4">
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
                                    <div className="mb-4">
                                        <label htmlFor="courseDuration" className="form-label fs-5 text-dark fw-semibold">
                                            <FaClock className="me-2 text-primary" /> Duration (hours)
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control rounded-pill shadow-sm"
                                            id="courseDuration"
                                            placeholder="Enter the duration of the course"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="coursePrice" className="form-label fs-5 text-dark fw-semibold">
                                            <FaDollarSign className="me-2 text-primary" /> Price (USD)
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control rounded-pill shadow-sm"
                                            id="coursePrice"
                                            placeholder="Enter the price of the course"
                                            value={coursePrice}
                                            onChange={(e) => setCoursePrice(e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="mb-4">
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
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-success btn-lg rounded-pill shadow-sm upload-btn">
                                            <FaUpload className="me-2" /> Upload Course
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
