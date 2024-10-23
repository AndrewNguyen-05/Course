import React, { useState, useEffect, useCallback } from 'react';
import { Search } from './components/Search';
import { SearchService } from '../../../service/CourseService';
import { ViewCouses } from './components/ViewCourses';
import { motion } from 'framer-motion';
import ReactPaginate from 'react-paginate';
import LoadingSpinner from '../../../utils/LoadingSpinner';

export const Courses = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [filterQuery, setFilterQuery] = useState('');

    useEffect(() => {
        document.title = 'Courses'
    })

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const result = await SearchService(currentPage, pageSize, filterQuery);
            if (result && result.result) {
                setCourses(result.result.data);
                setTotalPages(result.result.totalPages >= 1 ? result.result.totalPages : 1); 
            } else {
                setCourses([]);
                setTotalPages(1); 
            }
        } catch (err) {
            console.log(err);
            setCourses([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, filterQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterQuery]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    }

    if(loading){
        return (
            <LoadingSpinner />
        );
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
