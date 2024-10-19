import React, { useEffect, useState } from 'react';
import { TopBar } from '../../layouts/TopBar';
import { Header } from '../../layouts/Header';
import { getAvatar } from '../../../service/ProfileService';
import { deletePost, getPostByUserLogin } from '../../../service/PostService';
import Swal from 'sweetalert2';
import { getMyInfo } from '../../../service/UserService';
import CoverPhotoSection from './components/CoverPhotoSection';
import UserProfileInfo from './components/UserProfileInfo';
import NavigationMenu from './components/NavigationMenu';
import AboutSection from './components/AboutSection';
import PostUser from './components/PostUser';

const ProfilePage = () => {
  const token = localStorage.getItem('token');
  const [avatar, setAvatar] = useState('https://bootdey.com/img/Content/avatar/avatar7.png');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    firstName: '',
    lastName: '',
  });


  // Lấy ảnh đại diện từ API
  useEffect(() => {
    if (!token) {
      return;
    }
    getAvatar()
      .then((data) => {
        setAvatar(data.result);
      })
      .catch((error) => console.log(error));
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }
    getMyInfo()
      .then((data) => {
        setInfo(data.result);
      })
      .catch((error) => console.log(error))
  })

  useEffect(() => {
    const fetchPostByUserLogin = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const data = await getPostByUserLogin(currentPage);
        if (data.result && data.result.data) {
          setPosts(data.result.data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostByUserLogin();
  }, [token, currentPage]);

  const handleDeletePost = async (postId) => {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'Do you want to delete this post ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete now',
      cancelButtonText: "No, cancel",
      width: "370px",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deletePost(postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            Swal.fire({
              title: 'Deleted!',
              text: 'Your post has been deleted.',
              icon: 'success',
              width: "370px",
            });
          } catch (error) {
            Swal.fire({
              title: 'Error!',
              text: error.message || 'Đã xảy ra lỗi trong quá trình mua khóa học. Vui lòng thử lại sau.',
              icon: 'error'
            });
            console.error(error);
          }
        }
      })
  }

  return (
    <div>
      <TopBar />
      <Header />
      <div className='content-page'>
        <div className="my-account-container">
          <CoverPhotoSection />
          <UserProfileInfo avatar={avatar} info={info} />
          <NavigationMenu />

          <div className="my-account-content">
            <AboutSection />

            <PostUser
              posts={posts}
              loading={loading}
              handleDeletePost={handleDeletePost}
              avatar={avatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
