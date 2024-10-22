import './App.css'
import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './components/router/PrivateRoute';
import { RegisterTeacher } from './components/pages/RegisterPage/RegisterTeacher';
import { Dashboard } from './components/admin/components/Dashboard';
import { RegistrationList } from './components/admin/components/RegistrationList';
import { LearningPage } from './components/pages/LearningPage/LearningPage';
import { MainLayout } from './components/router/MainLayout';
import { HeaderAndFooterRouter } from './components/router/HeaderAndFooterRouter';
import { HomePage } from './components/pages/HomePage/HomePage';
import { LoginPage } from './components/pages/LoginPage/LoginPage';
import { ContactPage } from './components/pages/ContactPage/ContactPage';
import { Courses } from './components/pages/CoursesPage/CoursesPage';
import { About } from './components/pages/AboutPage/AboutPage';
import DepositPage from './components/pages/DepositPage/DepositPage';
import ProfilePage from './components/pages/MyAccountPage/MyAccount';
import { Profile } from './components/pages/ProfilePage/ProfilePage';
import { PaymentSuccess } from './components/pages/PaymentPage/PaymentSuccess';
import { PaymentFail } from './components/pages/PaymentPage/PaymentFailed';
import { PaymentCancel } from './components/pages/PaymentPage/PaymentCancel';
import { Register } from './components/pages/RegisterPage/RegisterPage';
import Community from './components/pages/CommunityPage/Community';
import { CreatePassword } from './components/pages/ModifyPasswordPage/CreatePassword';
import { CourseDetail } from './components/pages/CourseDetailPage/CourseDetailPage';
import { ForgotPassword } from './components/pages/ModifyPasswordPage/ForgotPasswordPage';
import { ChangePassword } from './components/pages/ModifyPasswordPage/ChangePassword';
import FavoriteCourses from './components/pages/FavoritePage/Favorite';
import { AdsPage } from './components/pages/AdsPage/Ads';
import AdsDetail from './components/pages/AdsPage/components/DetailAds';
import { UploadCourse } from './components/pages/TeacherPage/UploadCourse';
import { MyCourses } from './components/pages/HomePage/components/MyCourse';
import ManagerCourse from './components/pages/TeacherPage/ManagerCourse';
import ManagerCourseDetail from './components/pages/TeacherPage/ManagerCourseDetail';
import { Accessdenied } from './components/pages/ErrorPage/Accessdenied';
import { NotFound } from './components/pages/ErrorPage/NotFound';
import { ProcessLoginOAuth2 } from './service/Oauth2/OAuth2';
import { Authorization } from './service/Security/Authorization';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path='/course-detail/:id' element={<CourseDetail />} />
        </Route>

        <Route path='/manager-course/:id' element={<ManagerCourseDetail />} />

        <Route element={<HeaderAndFooterRouter />}>
          <Route path='/my-ads' element={<AdsPage />} />
          <Route path='/favorite' element={<FavoriteCourses />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path='/favorite' element={<FavoriteCourses />} />
          <Route path='/deposit' element={<DepositPage />} />
          <Route path='/courses' element={<Courses />}></Route>
          <Route path="/comunity" element={
            <PrivateRoute>
              <Community />
            </PrivateRoute>} />

          <Route path="/create-password" element={
            <PrivateRoute>
              <CreatePassword />
            </PrivateRoute>} />

          <Route path="/change-password" element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          } />

          <Route path='/profile' element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          <Route path="/my-courses" element={
            <PrivateRoute>
              <MyCourses />
            </PrivateRoute>
          } />

          <Route path="/manager-courses" element={
            <Authorization requiredRole={["TEACHER"]}>
              <ManagerCourse />
            </Authorization>
          } />

          <Route path="/register-teacher" element={
            <Authorization requiredRole={["USER"]}>
              <RegisterTeacher />
            </Authorization>
          } />

          <Route path="/forgot-password" element={
            <ForgotPassword />
          } />

          <Route path="/teacher-add-courses" element={
            <Authorization requiredRole={["TEACHER"]}>
              <UploadCourse />
            </Authorization>
          } />
        </Route>

        <Route path="/admin" element={
          <Authorization requiredRole={["ADMIN"]}>
            <Dashboard />
          </Authorization>
        } />

        <Route path="/admin/list-registes-teacher" element={
          <Authorization requiredRole={["ADMIN"]}>
            <RegistrationList />
          </Authorization>
        } />

        <Route path="/my-account" element={<ProfilePage />} />
        <Route path="/detail-ads" element={<AdsDetail />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/lesson-detail/:id' element={<LearningPage />} />
        <Route path="/oauth2/callback/:clientCode" element={<ProcessLoginOAuth2 />} />
        <Route path='/accessdenied' element={<Accessdenied />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFail />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

      </Routes>
    </div>
  );
}

export default App;
