import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/layouts/Header';
import { Footer } from './components/layouts/Footer';
import { LoginPage } from './components/myComponents/LoginPage';
import { HomePage } from './components/pages/HomePage';
import { LayoutWithoutHeaderFooter } from './components/myComponents/LayoutWithoutHeaderFooter';
import { About } from './components/myComponents/About';
import { Courses } from './components/myComponents/Courses';
import { CourseDetail } from './components/myComponents/CourseDetail';
import { Contact } from './components/myComponents/Contact';
import { Profile } from './components/myComponents/Profile';
import { PrivateRoute } from './components/router/PrivateRoute';
import { ChangePassword } from './components/myComponents/ChangePassword';

function App() {
  return (
    <Router>

      <div className="App">
        <Routes>

          <Route path="/" element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          } />

          <Route path="/home" element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          } />

          <Route path="/login" element={
            <LayoutWithoutHeaderFooter>
              <LoginPage />
            </LayoutWithoutHeaderFooter>
          } />

          <Route path="/logout" element={
            <LayoutWithoutHeaderFooter>
              <LoginPage />
            </LayoutWithoutHeaderFooter>
          } />

          <Route path="/change-password" element={
            <PrivateRoute>
              <LayoutWithoutHeaderFooter>
                <ChangePassword />
              </LayoutWithoutHeaderFooter>
            </PrivateRoute>
          } />

          <Route path='/about' element={
            <>
              <Header />
              <About />
              <Footer />
            </>
          } />

          <Route path='/courses' element={
            <>
              <Header />
              <Courses />
              <Footer />
            </>
          } />

          <Route path='/course-detail' element={
            <>
              <Header />
              <CourseDetail />
              <Footer />
            </>
          } />

          <Route path='/contact' element={
            <>
              <Header />
              <Contact />
              <Footer />
            </>
          } />

          <Route path='/profile' element={
            <>
              <PrivateRoute>
                <LayoutWithoutHeaderFooter>
                  <Profile />
                </LayoutWithoutHeaderFooter>
              </PrivateRoute>
            </>
          } />

        </Routes>
      </div>

    </Router>
  );
}

export default App;
