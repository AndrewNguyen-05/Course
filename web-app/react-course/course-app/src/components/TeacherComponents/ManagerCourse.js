import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../layouts/Sidebar';
import { Footer } from '../layouts/Footer';
import { Navbar } from '../layouts/Navbar';
import { UseAuth } from '../authentication/UseAuth';
import { HandleLogout } from '../authentication/HandleLogout';

export const MyCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const mockCourses = [
            {
                id: 1,
                title: 'Web Development Bootcamp',
                description: 'Learn HTML, CSS, JavaScript and more.',
                category: 'Web Development',
                price: '99',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy0RpTcb76Wj88-ROkvu-0OvhffPG726yzmw&s',
            },
            {
                id: 2,
                title: 'Data Science Mastery',
                description: 'Become a data scientist with hands-on projects.',
                category: 'Data Science',
                price: '149',
                image: 'https://1.bp.blogspot.com/-BJ0ypjIR_Ac/XSnlAKli8iI/AAAAAAAAU8Q/RL09szlPNJoOAUhx6Md2Qr38m4nHVu8NACLcBGAs/s640/c-uses-and-applications-2x-12.png',
            },
            {
                id: 3,
                title: 'UI/UX Design Fundamentals',
                description: 'Master the principles of user interface and experience design.',
                category: 'Design',
                price: '129',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStA6IkRwrMKfclpFZaB1uN31cnQsnTqrbMNA&s',
            },
            {
                id: 4,
                title: 'Marketing Strategy Essentials',
                description: 'Learn the fundamentals of marketing strategies.',
                category: 'Marketing',
                price: '119',
                image: 'https://r2s.edu.vn/wp-content/uploads/2023/07/1.ngon-ngu-lap-trinh-c-tim-hieu-tu-a-den-z.png',
            },
            {
                id: 5,
                title: 'Business Development 101',
                description: 'A comprehensive guide to business development.',
                category: 'Business',
                price: '199',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7CkdQB54nLULr43jWzPPAf512lAAtHiq3vQ&s',
            },
            {
                id: 6,
                title: 'Advanced Python Programming',
                description: 'Deep dive into advanced Python programming.',
                category: 'Web Development',
                price: '129',
                image: 'https://letscode.edu.vn/wp-content/uploads/2023/11/angular-la-gi-tong-quan-ve-framework-angular.png',
            },
            {
                id: 7,
                title: 'Machine Learning with Python',
                description: 'Hands-on machine learning projects with Python.',
                category: 'Data Science',
                price: '159',
                image: 'https://r2s.edu.vn/wp-content/uploads/2024/06/khoa-hoc-kotlin-tu-a-den-z-lap-trinh-android-de-dang.png',
            },
            {
                id: 8,
                title: 'Graphic Design Masterclass',
                description: 'Master the tools and techniques of graphic design.',
                category: 'Design',
                price: '139',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgkC_QejQzKxd8orD74kLkcNgVG4ogHju6Ig&s',
            },
        ];
        setCourses(mockCourses);
    }, []);

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="content-wrapper w-100">
                <Navbar />
                <div className="container-fluid my-courses-container my-5">
                    <div className="row justify-content-center">
                        {courses.map(course => (
                            <div key={course.id} className="col-lg-3 col-md-6 mb-4">
                                <div className="card h-100 shadow-sm border-0">
                                    <img src={course.image} className="card-img-top" alt={course.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{course.title}</h5>
                                        <p className="card-text">{course.description}</p>
                                        <p className="card-text"><strong>Category:</strong> {course.category}</p>
                                        <p className="card-text"><strong>Price:</strong> ${course.price}</p>
                                    </div>
                                    <div className="card-footer d-flex justify-content-between">
                                        <button className="btn btn-outline-primary btn-sm">
                                            <FaEdit className="me-1" /> Edit
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm">
                                            <FaTrash className="me-1" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

