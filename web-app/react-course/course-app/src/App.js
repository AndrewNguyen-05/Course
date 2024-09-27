import './App.css';
import { Route, Routes } from 'react-router-dom';
import { PaymentSuccess } from './components/pages/PaymentSuccess';
import { HomePage } from './components/pages/HomePage';
import { LayoutWithoutHeaderFooter } from './components/UserComponents/LayoutWithoutHeaderFooter';
import { ProcessLoginOAuth2 } from './components/authentication/OAuth2';
import { Register } from './components/pages/RegisterPage';
import { LoginPage } from './components/pages/LoginPage';
import { CreatePassword } from './components/UserComponents/CreatePassword';
import { ChangePassword } from './components/UserComponents/ChangePassword';
import { Profile } from './components/UserComponents/Profile';
import FavoriteCourses from './components/UserComponents/Favorite';
import DepositPage from './components/pages/DepositPage';
import { Authorization } from './components/authorization/Authorization';
import { PrivateRoute } from './components/router/PrivateRoute';
import { ForgotPassword } from './components/pages/ForgotPasswordPage';
import { MyCourses } from './components/TeacherComponents/MyCourse';
import { RegisterTeacher } from './components/UserComponents/RegisterTeacher';
import { Dashboard } from './components/admin/components/Dashboard';
import { RegistrationList } from './components/admin/components/RegistrationList';
import { Accessdenied } from './components/error/Accessdenied';
import { About } from './components/pages/AboutPage';
import { Courses } from './components/pages/CoursesPage';
import { CourseDetail } from './components/pages/CourseDetailPage';
import { Contact } from './components/pages/ContactPage';
import { UploadCourse } from './components/TeacherComponents/UploadCourse';
import { PaymentFail } from './components/pages/PaymentFailed';
import { PaymentCancel } from './components/pages/PaymentCancel';
import { LearningPage } from './components/pages/LearningPage';
import { MainLayout } from './components/router/MainLayout';
import { NotFound } from './components/error/NotFound';

function App() {
  return (
    <div className="App">
      <Routes>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/course-detail/:id' element={<CourseDetail />} />
        </Route>

        <Route path='/lesson-detail/:id' element={<LearningPage />} />

        <Route path="/login" element={
          <LayoutWithoutHeaderFooter>
            <LoginPage />
          </LayoutWithoutHeaderFooter>
        } />

        <Route path="/authenticate" element={
          <LayoutWithoutHeaderFooter>
            <ProcessLoginOAuth2 />
          </LayoutWithoutHeaderFooter>
        } />

        <Route path="/register" element={
          <LayoutWithoutHeaderFooter>
            <Register />
          </LayoutWithoutHeaderFooter>
        } />

        <Route path="/logout" element={
          <LayoutWithoutHeaderFooter>
            <LoginPage />
          </LayoutWithoutHeaderFooter>
        } />

        <Route path="/create-password" element={
          <PrivateRoute>
            <LayoutWithoutHeaderFooter>
              <CreatePassword />
            </LayoutWithoutHeaderFooter>
          </PrivateRoute>
        } />

        <Route path="/forgot-password" element={
          <LayoutWithoutHeaderFooter>
            <ForgotPassword />
          </LayoutWithoutHeaderFooter>
        } />

        <Route path="/change-password" element={
          <PrivateRoute>
            <LayoutWithoutHeaderFooter>
              <ChangePassword />
            </LayoutWithoutHeaderFooter>
          </PrivateRoute>
        } />

        <Route path='/profile' element={
          <PrivateRoute>
            <LayoutWithoutHeaderFooter>
              <Profile />
            </LayoutWithoutHeaderFooter>
          </PrivateRoute>
        } />

        <Route path='/favorite' element={<FavoriteCourses />} />
        <Route path='/about' element={<About />} />
        <Route path='/courses' element={<Courses />} />

        <Route path='/contact' element={<Contact />} />
        <Route path='/deposit' element={<DepositPage />} />

        <Route path="/teacher-add-courses" element={
          <Authorization requiredRole={["TEACHER"]}>
            <LayoutWithoutHeaderFooter>
              <UploadCourse />
            </LayoutWithoutHeaderFooter>
          </Authorization>
        } />

        <Route path="/my-courses" element={
          <PrivateRoute>
            <LayoutWithoutHeaderFooter>
              <MyCourses />
            </LayoutWithoutHeaderFooter>
          </PrivateRoute>
        } />

        <Route path="/register-teacher" element={
          <Authorization requiredRole={["USER"]}>
            <LayoutWithoutHeaderFooter>
              <RegisterTeacher />
            </LayoutWithoutHeaderFooter>
          </Authorization>
        } />

        <Route path="/admin" element={
          <Authorization requiredRole={["ADMIN"]}>
            <LayoutWithoutHeaderFooter>
              <Dashboard />
            </LayoutWithoutHeaderFooter>
          </Authorization>
        } />

        <Route path="/admin/list-registes-teacher" element={
          <Authorization requiredRole={["ADMIN"]}>
            <LayoutWithoutHeaderFooter>
              <RegistrationList />
            </LayoutWithoutHeaderFooter>
          </Authorization>
        } />

        <Route path='/accessdenied' element={
          <LayoutWithoutHeaderFooter>
            <Accessdenied />
          </LayoutWithoutHeaderFooter>
        } />

        <Route path="*" element={<NotFound />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFail />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

      </Routes>
    </div>
  );
}

export default App;
