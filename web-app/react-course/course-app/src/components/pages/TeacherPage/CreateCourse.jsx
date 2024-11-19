import React, { useEffect, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import FormUploadCourse from './components/FormUploadCourse';
import axios from '../../../utils/CustomizeAxios';
import { toast, ToastContainer } from 'react-toastify';
import { getMyInfo } from '../../../service/UserService';

export const CreateCourse = () => {
    const [instructorName, setInstructorName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = 'Create a Course';
    }, []);

    const [courseData, setCourseData] = useState({
        courseTitle: '',
        courseDescription: '',
        level: '',
        duration: '',
        coursePrice: 0,
        language: '',
        instructorName: '',
        courseThumbnail: null,
        courseFile: null,
    });

    useEffect(() => {
        getMyInfo()
            .then((response) => {
                setInstructorName(response.result.firstName + ' ' + response.result.lastName);
            })
            .catch((error) => console.log(error));
    })

    const handleChange = (key, value) => {
        setCourseData(prevData => ({
            ...prevData,
            [key]: value
        }));
    };

    const handleUploadCourse = async (event) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData();

        const dataCourse = new Blob([JSON.stringify({
            title: courseData.courseTitle,
            description: courseData.courseDescription,
            points: courseData.coursePrice,
            duration: courseData.duration,
            language: courseData.language,
            courseLevel: courseData.level
        })], { type: 'application/json' });

        formData.append('courseRequest', dataCourse);
        formData.append('thumbnail', courseData.courseThumbnail);
        if (courseData.courseFile !== null) {
            formData.append('video', courseData.courseFile);
        }

        try {
            const response = await axios.post(`api/v1/create-course`, formData);
            console.log(response.data);

            if (response && response.data && response.data.code === 201) {
                toast.success('Created Course Successfully');
            } else {
                toast.error('Created Course Error');
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

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
                                        handleSubmit={handleUploadCourse}
                                        courseData={courseData}
                                        handleChange={handleChange}
                                        loading={loading}
                                        instructorName={instructorName}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                className="custom-toast-container"
            />
        </div>

    );
};
