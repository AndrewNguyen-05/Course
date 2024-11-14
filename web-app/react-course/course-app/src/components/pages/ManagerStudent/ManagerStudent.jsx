import { useCallback, useEffect, useState } from "react";
import FormDataStudent from "./FormDataStudent";
import { fetchStudents } from "../../../service/TeacherService";

const ManagerStudent = () => {

    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(null);

    const fetchStudent = useCallback(async () => {
        try {
            const data = await fetchStudents(currentPage);
            if (data && data.code === 200 && data.result && data.result.data) {
                setStudents(data.result.data);
                setTotalPage(data.result.totalPages)
            } else {
                setStudents([]);
                setTotalPage(1);
            }
        } catch (error) {
            console.log(error);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchStudent();
    }, [fetchStudent]);

    const handleClick = (data) => {
        setCurrentPage(data.selected + 1);
    }

    return (
        <div className="revenue-content-page">
            <FormDataStudent students={students}
                currentPage={currentPage}
                totalPages={totalPage}
                handlePageClick={handleClick}
            />
        </div>
    );
}

export default ManagerStudent;