import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng
import TablePagination from "@mui/material/TablePagination";
import { getAllUsers, searchUsers } from "../../service/Admin_UserService"; // Import dịch vụ lấy dữ liệu người dùng
import "../../css/UserManage.css"; // Import CSS cho căn chỉnh

import {
  cilSearch,
  cilSortAlphaDown,
  cilUser,
  cilEnvelopeClosed,
  cilCalendar,
  cilUserFemale,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState("name,asc");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    fetchUsers(page + 1, rowsPerPage, sort); // Gọi API với trang bắt đầu từ 1
  }, [page, rowsPerPage, sort]);

  const fetchUsers = async (page, size, sort, keywords = "") => {
    try {
      let response;
      if (keywords) {
        response = await searchUsers(page, size, sort, keywords);
      } else {
        response = await getAllUsers(page, size, sort);
      }
      setUsers(response.content);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setPage(0);
      fetchUsers(1, rowsPerPage, sort, searchTerm);
    }
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (id) => {
    navigate(`/admin/users/detail/${id}`); // Điều hướng đến trang chi tiết người dùng
  };

  return (
    <div className="user-manage">
      <h2 className="user-manage-title">User Management</h2>
      <div className="user-manage-controls">
        <div className="user-manage-search">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
          <CIcon icon={cilSearch} className="search-icon" />
        </div>
        <div className="user-manage-sort">
          <select onChange={handleSortChange}>
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
              <th>STT</th>
              <th>
                <CIcon icon={cilCalendar} className="table-icon" /> Create_At
              </th>
              <th>
                <CIcon icon={cilUser} className="table-icon" /> Name
              </th>
              <th>
                <CIcon icon={cilEnvelopeClosed} className="table-icon" /> Email
              </th>
              <th>
                <CIcon icon={cilUserFemale} className="table-icon" /> Gender
              </th>
              <th>
                <CIcon icon={cilUser} className="table-icon" /> Role
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{page * rowsPerPage + index + 1}</td>
                <td>{new Date(user.createAt).toLocaleDateString()}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.gender || "N/A"}</td>
                <td>{user.role}</td>
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
    </div>
  );
};

export default UserManage;
