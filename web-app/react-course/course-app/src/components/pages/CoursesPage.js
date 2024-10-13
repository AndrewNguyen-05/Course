import React, { useState, useEffect } from 'react';
import { Search } from "../common/Search";
import { SearchService } from '../../service/CourseService';
import { ViewCouses } from '../AppComponents/ViewCourses';
import { motion } from 'framer-motion';
import ReactPaginate from 'react-paginate';

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

    useEffect(() => {
        setCurrentPage(1);
    }, [filterQuery]);

    useEffect(() => {
        fetchCourses();
    }, [currentPage, pageSize, filterQuery]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    }

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
                    <ReactPaginate
                        previousLabel={'«'}
                        nextLabel={'»'}
                        breakLabel={'...'}
                        pageCount={totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        forcePage={currentPage - 1} 
                        containerClassName={'pagination pagination-lg justify-content-center'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                        activeClassName={'active'}
                    />
                </div>
            </div>
        </motion.div>
    );
};
