import React from 'react';
import ReactPaginate from 'react-paginate';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const FormDataStudent = ({ students, currentPage, handlePageClick, totalPages }) => {


    const exportToExcel = (students) => {
        const worksheet = XLSX.utils.json_to_sheet(students.map(student => ({
            Name: student.name,
            Email: student.email,
            Avatar: student.avatar,
            "Course Name": student.courseName,
            "Created At": student.createAt,
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "students.xlsx");
    };

    return (
        <div className="student-card">
            <div className="student-card-body">
                <div className="student-table-responsive">
                    <div className="student-actions">
                        <button
                            className="btn btn-export"
                            onClick={() => exportToExcel(students)}
                        >
                            Export to Excel
                        </button>
                    </div>
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>
                                    <div className="form-check custom-checkbox checkbox-success check-lg me-3">
                                        <input type="checkbox" className="form-check-input" id="checkAll" />
                                        <label className="form-check-label" htmlFor="checkAll"></label>
                                    </div>
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Avatar</th>
                                <th>Course Name</th>
                                <th>Create At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index} className="student-table-row">
                                    <td>
                                        <div className="form-check custom-checkbox checkbox-success check-lg me-3">
                                            <input type="checkbox" className="form-check-input" id={`check${student.id}`} />
                                            <label className="form-check-label" htmlFor={`check${student.id}`}></label>
                                        </div>
                                    </td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        <img src={student.avatar} alt={student.name} className="student-avatar-img" />
                                    </td>
                                    <td>{student.courseName}</td>
                                    <td>{student.createAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
        </div>
    );
}

export default FormDataStudent;
