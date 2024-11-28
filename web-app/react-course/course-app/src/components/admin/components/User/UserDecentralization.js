import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  searchUsers,
  changeUserRole,
  banUser,
  unbanUser,
} from "../../service/Admin_UserService"; // Import các dịch vụ API
import "../../css/UserManage.css"; // Import CSS căn chỉnh
import "../../css/UserDecentralization.css"; // Import CSS phân quyền
import TablePagination from "@mui/material/TablePagination";
import CIcon from "@coreui/icons-react";
import { FaTimesCircle } from "react-icons/fa"; // Biểu tượng dấu X

import {
  cilUser,
  cilEnvelopeClosed,
  cilShieldAlt,
  cilSearch,
  cilSettings,
  cilUserFemale,
} from "@coreui/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDecentralization = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState("name,asc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers(page + 1, rowsPerPage, sort);
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
      toast.error("Failed to fetch user list.");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page change
  };

  const handleChangeRole = async (userId, currentRole) => {
    const newRole =
      currentRole === "USER"
        ? "TEACHER"
        : currentRole === "TEACHER"
        ? "ADMIN"
        : "USER";

    try {
      await changeUserRole(userId, newRole);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success(`Updated to ${newRole} successfully.`);
    } catch (error) {
      console.error(`Error changing user role ${userId}:`, error);
      toast.error("Failed to change user role.");
    }
  };

  const handleToggleBanStatus = async (userId, isEnabled) => {
    try {
      const user = users.find((user) => user.id === userId); // Lấy thông tin user dựa trên userId

      if (isEnabled) {
        await banUser(userId);
        toast.error(
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaTimesCircle style={{ color: "#d9534f", marginRight: "10px" }} />
            <span>User {user.name} has been banned.</span>
          </div>,
          {
            autoClose: 5000, // Tự động đóng sau 5 giây
          }
        );
      } else {
        await unbanUser(userId);
        toast.success(`User ${user.name} has been unbanned.`, {
          autoClose: 3000,
        });
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, enabled: !isEnabled } : user
        )
      );
    } catch (error) {
      console.error(`Error toggling ban status for user ${userId}:`, error);
      toast.error("Failed to change user status.");
    }
  };

  return (
    <div className="user-manage">
      <h2 className="user-manage-title">User Decentralization</h2>
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
                fetchUsers(1, rowsPerPage, sort, searchTerm);
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
        </div>
      </div>
      <div className="user-manage-table">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>
                <CIcon icon={cilUser} className="table-icon" /> Name
              </th>
              <th>
                <CIcon icon={cilEnvelopeClosed} className="table-icon" /> Email
              </th>
              <th>
                <CIcon icon={cilShieldAlt} className="table-icon" /> Role
              </th>
              <th>
                <CIcon icon={cilSettings} className="table-icon" /> Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{page * rowsPerPage + index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <div
                    className={`role-button ${user.role.toLowerCase()}`}
                    onClick={() => handleChangeRole(user.id, user.role)}
                  >
                    <CIcon
                      icon={
                        user.role === "USER"
                          ? cilUser
                          : user.role === "TEACHER"
                          ? cilUserFemale
                          : cilShieldAlt
                      }
                      className="role-icon"
                    />
                    {user.role}
                  </div>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={user.enabled}
                      onChange={() =>
                        handleToggleBanStatus(user.id, user.enabled)
                      }
                    />
                    <span className="slider round">
                      {user.enabled ? "Unban" : "Ban"}
                    </span>
                  </label>
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

export default UserDecentralization;
