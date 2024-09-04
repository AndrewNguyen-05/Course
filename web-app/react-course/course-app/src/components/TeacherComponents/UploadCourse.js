import React, { useState } from 'react';
import { FaUpload, FaBook, FaTags, FaDollarSign, FaFileAlt } from 'react-icons/fa';
import { Footer } from '../layouts/Footer';
import { Navbar } from '../layouts/Navbar';

export const UploadCourse = () => {
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseCategory, setCourseCategory] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [courseFile, setCourseFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ courseTitle, courseDescription, courseCategory, coursePrice, courseFile });
    };

    return (
        <div>
            <Navbar />
            <div className="container upload-container my-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card shadow-lg border-0 rounded-3">
                            <div className="card-body p-4">
                                <h2 className="card-title text-center mb-4 text-primary">
                                    <FaUpload className="me-2" /> Upload New Course
                                </h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="courseTitle" className="form-label">
                                            <FaBook className="me-2 text-primary" /> Course Title
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm rounded-pill"
                                            id="courseTitle"
                                            placeholder="Enter the title of the course"
                                            value={courseTitle}
                                            onChange={(e) => setCourseTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="courseDescription" className="form-label">
                                            <FaFileAlt className="me-2 text-primary" /> Course Description
                                        </label>
                                        <textarea
                                            className="form-control form-control-sm rounded"
                                            id="courseDescription"
                                            rows="3"
                                            placeholder="Enter the description of the course"
                                            value={courseDescription}
                                            onChange={(e) => setCourseDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="courseCategory" className="form-label">
                                            <FaTags className="me-2 text-primary" /> Category
                                        </label>
                                        <select
                                            className="form-select form-select-sm rounded-pill"
                                            id="courseCategory"
                                            value={courseCategory}
                                            onChange={(e) => setCourseCategory(e.target.value)}
                                        >
                                            <option value="" disabled>
                                                Choose a category
                                            </option>
                                            <option value="Web Development">Web Development</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Design">Design</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Business">Business</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="coursePrice" className="form-label">
                                            <FaDollarSign className="me-2 text-primary" /> Price (USD)
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm rounded-pill"
                                            id="coursePrice"
                                            placeholder="Enter the price of the course"
                                            value={coursePrice}
                                            onChange={(e) => setCoursePrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="courseFile" className="form-label">
                                            <FaFileAlt className="me-2 text-primary" /> Upload Course File
                                        </label>
                                        <input
                                            className="form-control form-control-sm rounded-pill"
                                            type="file"
                                            id="courseFile"
                                            onChange={(e) => setCourseFile(e.target.files[0])}
                                        />
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary btn-sm rounded-pill">
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

