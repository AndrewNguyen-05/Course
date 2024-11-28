import React, { useState, useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
import {
  getAllTeachers,
  searchTeachers,
  removeTeacherRole,
} from "../../service/Admin_TeacherService";
import ConfirmModal from "../ConfirmModal";
import "../../css/UserManage.css";
import {
  cilSearch,
  cilSortAlphaDown,
  cilUser,
  cilEnvelopeClosed,
  cilCalendar,
  cilTrash,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherManage = () => {
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState("createdAt,asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers(page + 1, rowsPerPage, sort);
  }, [page, rowsPerPage, sort]);

  const fetchTeachers = async (page, size, sort, keywords = "") => {
    try {
      let response;
      if (keywords) {
        response = await searchTeachers(page, size, sort, keywords);
      } else {
        response = await getAllTeachers(page, size, sort);
      }
      setTeachers(response.content);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to fetch teacher list.");
    }
  };

  const handleRemoveClick = (teacher) => {
    setSelectedTeacher(teacher);
    setModalShow(true);
  };

  const handleRemoveConfirm = async () => {
    if (selectedTeacher) {
      try {
        await removeTeacherRole(selectedTeacher.id);
        toast.success(
          `Teacher ${selectedTeacher.name} has been removed successfully.`
        );
        setModalShow(false);
        fetchTeachers(page + 1, rowsPerPage, sort);
      } catch (error) {
        console.error("Error removing teacher:", error);
        toast.error("Failed to remove teacher.");
      }
    }
  };

  return (
    <div className="user-manage">
      <h2 className="user-manage-title">Teacher Management</h2>
      <div className="user-manage-controls">
        <div className="user-manage-search">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(0);
                fetchTeachers(1, rowsPerPage, sort, searchTerm);
              }
            }}
          />
          <CIcon icon={cilSearch} className="search-icon" />
        </div>
        <div className="user-manage-sort">
          <select onChange={(e) => setSort(e.target.value)}>
            <option value="name,asc">Sort by Name (A-Z)</option>
            <option value="name,desc">Sort by Name (Z-A)</option>
            <option value="createdAt,asc">Sort by Date (Oldest)</option>
            <option value="createdAt,desc">Sort by Date (Newest)</option>
          </select>
          <CIcon icon={cilSortAlphaDown} className="sort-icon" />
        </div>
      </div>
      <div className="user-manage-table">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>
                <CIcon icon={cilCalendar} className="table-icon" /> Created At
              </th>
              <th>
                <CIcon icon={cilUser} className="table-icon" /> Name
              </th>
              <th>
                <CIcon icon={cilEnvelopeClosed} className="table-icon" /> Email
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher.id}>
                <td>{page * rowsPerPage + index + 1}</td>
                <td>
                  {teacher.createdAt
                    ? new Date(teacher.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>
                  <button
                    onClick={() => handleRemoveClick(teacher)}
                    style={{
                      backgroundColor: "#d9534f",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <CIcon icon={cilTrash} /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <TablePagination
          component="div"
          count={totalItems}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
          rowsPerPageOptions={[7, 14, 21]}
          className="custom-pagination"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count}`
          }
        />
      </div>
      <ConfirmModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onConfirm={handleRemoveConfirm}
        itemName={selectedTeacher ? selectedTeacher.name : ""}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TeacherManage;
