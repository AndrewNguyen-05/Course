import './App.css';
import { Route, Routes } from 'react-router-dom';
import { PaymentSuccess } from './components/pages/PaymentSuccess';
import { HomePage } from './components/pages/HomePage';
import { ProcessLoginOAuth2 } from './components/authentication/OAuth2';
import { Register } from './components/pages/RegisterPage';
import { LoginPage } from './components/pages/LoginPage';
import { CreatePassword } from './components/AppComponents/CreatePassword';
import { ChangePassword } from './components/AppComponents/ChangePassword';
import { Profile } from './components/AppComponents/Profile';
import FavoriteCourses from './components/AppComponents/Favorite';
import DepositPage from './components/pages/DepositPage';
import { Authorization } from './components/authorization/Authorization';
import { PrivateRoute } from './components/router/PrivateRoute';
import { ForgotPassword } from './components/pages/ForgotPasswordPage';
import { MyCourses } from './components/TeacherComponents/MyCourse';
import { RegisterTeacher } from './components/AppComponents/RegisterTeacher';
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
import { HeaderAndFooterRouter } from './components/router/HeaderAndFooterRouter';
import { Community } from './components/pages/Community';
import ProfilePage from './components/pages/MyAccount';
import { AdsPage } from './components/AppComponents/AdsModal/Ads';
import AdsDetail from './components/AppComponents/AdsModal/DetailAds';

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

        <Route element={<HeaderAndFooterRouter />}>
          <Route path='/my-ads' element={<AdsPage />} />
          <Route path='/favorite' element={<FavoriteCourses />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path='/favorite' element={<FavoriteCourses />} />
          <Route path='/deposit' element={<DepositPage />} />
          <Route path='/courses'element={<Courses/>}></Route>
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
