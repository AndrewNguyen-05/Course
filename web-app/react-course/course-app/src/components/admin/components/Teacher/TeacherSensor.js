import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import CIcon from "@coreui/icons-react";
import {
  cilSortAlphaDown,
  cilUser,
  cilEnvelopeClosed,
  cilCalendar,
  cilClipboard,
  cilCheckCircle,
  cilBan,
} from "@coreui/icons";
import {
  getTeacherApplications,
  approveTeacher,
  rejectTeacher,
} from "../../service/Admin_TeacherService";
import "../../css/UserManage.css"; // Common CSS
import "../../css/TeacherCensor.css"; // Specific CSS
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherCensor = () => {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState("name-asc");

  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchApplications = async (page, size) => {
    try {
      const response = await getTeacherApplications(page, size);
      setApplications(response.content);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Error fetching teacher applications:", error);
      toast.error("Failed to load teacher applications.");
    }
  };

  const handleSortChange = (e) => {
    const sortType = e.target.value;
    const sortedApplications = [...applications].sort((a, b) => {
      if (sortType === "name-asc") return a.name.localeCompare(b.name);
      if (sortType === "name-desc") return b.name.localeCompare(a.name);
      if (sortType === "date-asc")
        return new Date(a.createAt) - new Date(b.createAt);
      if (sortType === "date-desc")
        return new Date(b.createAt) - new Date(a.createAt);
      return 0;
    });
    setApplications(sortedApplications);
  };

  const handleCertificationClick = (id) => {
    navigate(`/admin/teachers/detail/${id}`);
  };

  const handleApproval = async (id, approved) => {
    try {
      if (approved) {
        await approveTeacher(id);
        toast.success(`Teacher application approved.`);
      } else {
        await rejectTeacher(id);
        toast.error(`Teacher application rejected.`, {
          className: "toast-error",
          icon: "❌",
        });
      }
      fetchApplications(page + 1, rowsPerPage);
    } catch (error) {
      console.error("Error updating teacher application status:", error);
      toast.error("Failed to update application status.");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  return (
    <div className="user-manage">
      <h2 className="user-manage-title">Teacher Application Censorship</h2>
      <div className="user-manage-controls">
        <div className="user-manage-sort">
          <select onChange={handleSortChange}>
            <option value="name-asc">Sort by Name (A-Z)</option>
            <option value="name-desc">Sort by Name (Z-A)</option>
            <option value="date-asc">Sort by Date (Oldest)</option>
            <option value="date-desc">Sort by Date (Newest)</option>
          </select>
          <CIcon icon={cilSortAlphaDown} className="sort-icon" />
        </div>
      </div>
      <div className="user-manage-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>
                <CIcon icon={cilCalendar} className="table-icon" /> Created At
              </th>
              <th>
                <CIcon icon={cilUser} className="table-icon" /> Name
              </th>
              <th>
                <CIcon icon={cilEnvelopeClosed} className="table-icon" /> Email
              </th>
              <th>
                <CIcon icon={cilClipboard} className="table-icon" /> Detail
              </th>
              <th>
                <CIcon icon={cilCheckCircle} className="table-icon" /> Action
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.id}>
                <td>{page * rowsPerPage + index + 1}</td>
                <td>{new Date(app.createAt).toLocaleDateString()}</td>
                <td>{app.name}</td>
                <td>{app.email}</td>
                <td
                  className="certification-link"
                  onClick={() => handleCertificationClick(app.id)}
                >
                  CV
                </td>
                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleApproval(app.id, true)}
                  >
                    <CIcon icon={cilCheckCircle} /> Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleApproval(app.id, false)}
                  >
                    <CIcon icon={cilBan} /> Reject
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
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[7, 14, 21]}
          className="custom-pagination"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count}`
          }
        />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TeacherCensor;
