import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "./Dashboard";
import { NotFound } from "../../error/NotFound";
import UserManage from "../components/User/UserManage";
import UserDetail from "../components/User/UserDetail";
import UserDecentralization from "../components/User/UserDecentralization";
import TeacherManage from "../components/Teacher/TeacherManage";
import TeacherSensor from "../components/Teacher/TeacherSensor";
import TeacherInforDetail from "../components/Teacher/TeacherInforDetail";
import CourseManage from "../components/Course/CourseManage";

import "../css/style.scss";
import CourseDetail from "../components/Course/CourseDetail";

const AdminApp = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Các route bên trong AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManage />} />
          <Route path="users/detail/:id" element={<UserDetail />} />
          <Route
            path="users/decentralization"
            element={<UserDecentralization />}
          />
          <Route path="teachers" element={<TeacherManage />} />
          <Route path="teachers/censor" element={<TeacherSensor />} />
          <Route
            path="teachers/detail/:id"
            element={<TeacherInforDetail />}
          />{" "}
          {/* Thêm route này */}
          <Route path="course/manage" element={<CourseManage />} />
          <Route path="course/detail/:courseId" element={<CourseDetail />} />
        </Route>
        {/* Route riêng cho NotFound */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AdminApp;
