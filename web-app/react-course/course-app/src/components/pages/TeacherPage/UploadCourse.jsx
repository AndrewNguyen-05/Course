import React, { useEffect, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import FormUploadCourse from './components/FormUploadCourse';

export const UploadCourse = () => {
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [level, setLevel] = useState('');
    const [duration, setDuration] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [courseThumbnail, setCourseThumbnail] = useState(null);
    const [courseFile, setCourseFile] = useState(null);
    const [language, setLanguage] = useState('');
    const [instructorName, setInstructorName] = useState('');

    useEffect(() => {
        document.title = 'Create a Course';
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            courseTitle,
            courseDescription,
            level,
            duration,
            coursePrice,
            language,
            instructorName,
            courseThumbnail,
            courseFile
        });
    };

    return (
        <div className='content-page'>
            <div className="upload-course-container">
                <div className="container upload-container my-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-11">
                            <div className="card rounded-4">
                                <div className="card-body p-5">
                                    <h3 className="card-title text-center mb-4 text-dark fw-bold">
                                        <FaUpload className="me-2" /> Upload New Course
                                    </h3>
                                    <FormUploadCourse
                                        handleSubmit={handleSubmit}
                                        courseTitle={courseTitle}
                                        setCourseTitle={setCourseTitle}
                                        level={level}
                                        setLevel={setLevel}
                                        language={language}
                                        setLanguage={setLanguage}
                                        duration={duration}
                                        setDuration={setDuration}
                                        coursePrice={coursePrice}
                                        setCoursePrice={setCoursePrice}
                                        instructorName={instructorName}
                                        setInstructorName={setInstructorName}
                                        courseDescription={courseDescription}
                                        setCourseDescription={setCourseDescription}
                                        setCourseFile={setCourseFile}
                                        setCourseThumbnail={setCourseThumbnail}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
