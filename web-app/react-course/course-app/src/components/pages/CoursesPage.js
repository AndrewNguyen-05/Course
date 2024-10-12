import React, { useState, useEffect } from 'react';
import { Search } from "../common/Search";
import { SearchService } from '../../service/CourseService';
import { Pagination } from '../common/Pagination';
import { ViewCouses } from '../AppComponents/ViewCourses';
import { motion } from 'framer-motion';

export const Courses = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [filterQuery, setFilterQuery] = useState('');

    useEffect(() => {
        document.title = 'Courses'
    })

    // Get Course and Search Filter 

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const result = await SearchService(currentPage, pageSize, filterQuery);
            if (result && result.result) {
                setCourses(result.result.data);
                setTotalPages(result.result.totalPages);
            } else {
                setCourses([]);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Hàm thay đổi trang
    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        setCurrentPage(1); 
    }, [filterQuery]);

    
    useEffect(() => {
        fetchCourses();
    }, [currentPage, pageSize, filterQuery]);

    return (
        <motion.div
                key={filterQuery || currentPage}  
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
            >
            <Search onSearch={setFilterQuery} />
            <div className="container-fluid">
                <div className="container py-3">
                    <div className="row mx-0 justify-content-center">
                        <div className="col-lg-8">
                            <div className="section-title text-center position-relative mb-5">
                                <h1 className="display-4">Explore Our Latest Courses</h1>
                            </div>
                        </div>
                    </div>
                    <ViewCouses courses={courses} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        changePage={changePage}
                    />
                </div>
            </div>
        </motion.div>
    );
};
