import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng
import TablePagination from "@mui/material/TablePagination";
import {
  getAllCourses,
  getActiveCourses,
  getBannedCourses,
  searchCourses,
} from "../../service/Admin_CourseService"; // Import dịch vụ API
import CIcon from "@coreui/icons-react";
import "../../css/CourseManage.css"; // Import CSS
import {
  cilSearch,
  cilSortAlphaDown,
  cilLibrary,
  cilUser,
  cilCalendar,
} from "@coreui/icons";

const CourseManage = () => {
  const [courses, setCourses] = useState([]); // State lưu danh sách khóa học
  const [page, setPage] = useState(0); // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(7); // Số dòng mỗi trang
  const [totalItems, setTotalItems] = useState(0); // Tổng số khóa học
  const [sort, setSort] = useState("title,asc"); // Thứ tự sắp xếp
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [currentFilter, setCurrentFilter] = useState("ALL"); // Bộ lọc khóa học (All, Active, Banned)
  const navigate = useNavigate(); // Hook điều hướng

  // Fetch danh sách khóa học khi các state thay đổi
  useEffect(() => {
    fetchCourses();
  }, [page, rowsPerPage, sort, currentFilter]);

  // Hàm gọi API để lấy danh sách khóa học
  const fetchCourses = async () => {
    try {
      let response;
      if (currentFilter === "ALL") {
        response = await getAllCourses(page + 1, rowsPerPage, sort);
      } else if (currentFilter === "ACTIVE") {
        response = await getActiveCourses(page + 1, rowsPerPage, sort);
      } else if (currentFilter === "BANNED") {
        response = await getBannedCourses(page + 1, rowsPerPage, sort);
      }

      // Nếu có từ khóa tìm kiếm
      if (searchTerm.trim() !== "") {
        response = await searchCourses(
          page + 1,
          rowsPerPage,
          sort,
          currentFilter !== "ALL" ? currentFilter === "ACTIVE" : null,
          searchTerm
        );
      }

      console.log("Courses Data:", response.content);
      setCourses(response.content); // Lưu danh sách khóa học
      setTotalItems(response.totalElements); // Lưu tổng số khóa học
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Xử lý sự kiện tìm kiếm
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchCourses();
    }
  };

  // Thay đổi bộ lọc
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setPage(0); // Reset về trang đầu
  };

  // Điều hướng đến trang chi tiết khóa học
  const handleRowClick = (id) => {
    navigate(`/admin/course/detail/${id}`); // Chuyển hướng tới đúng URL
  };

  return (
    <div className="course-manage">
      <h2 className="course-manage-title">Course Management</h2>
      <div className="course-manage-controls">
        <div className="course-manage-search">
          <input
            type="text"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <CIcon icon={cilSearch} className="search-icon" />
        </div>
        <div className="course-manage-sort">
          <select onChange={(e) => setSort(e.target.value)}>
            <option value="title,asc">Sort by Title (A-Z)</option>
            <option value="title,desc">Sort by Title (Z-A)</option>
            <option value="createdAt,asc">Sort by Date (Oldest)</option>
            <option value="createdAt,desc">Sort by Date (Newest)</option>
          </select>
          <CIcon icon={cilSortAlphaDown} className="sort-icon" />
        </div>
        <div className="course-manage-filters">
          <button
            className={`filter-button ${
              currentFilter === "ALL" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("ALL")}
          >
            All Courses
          </button>
          <button
            className={`filter-button ${
              currentFilter === "ACTIVE" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("ACTIVE")}
          >
            Active Courses
          </button>
          <button
            className={`filter-button ${
              currentFilter === "BANNED" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("BANNED")}
          >
            Banned Courses
          </button>
        </div>
      </div>
      <div className="course-manage-table">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>
                <CIcon icon={cilLibrary} className="table-icon" /> Title
              </th>
              <th>
                <CIcon icon={cilUser} className="table-icon" /> Author
              </th>
              <th>
                <CIcon icon={cilCalendar} className="table-icon" /> Created At
              </th>
              <th>
                <CIcon icon={cilCalendar} className="table-icon" /> Updated At
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr
                key={course.id}
                onClick={() => handleRowClick(course.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{page * rowsPerPage + index + 1}</td>
                <td>{course.title}</td>
                <td>{course.authorName || "Unknown"}</td>
                <td>
                  {course.createdAt
                    ? new Date(course.createdAt).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  {course.updatedAt
                    ? new Date(course.updatedAt).toLocaleString()
                    : "N/A"}
                </td>
                <td>{course.enabled ? "Active" : "Banned"}</td>
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
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count}`
          }
        />
      </div>
    </div>
  );
};

export default CourseManage;
