import React, { useEffect, useState } from 'react';
import { TopBar } from '../layouts/TopBar';
import { Header } from '../layouts/Header';
import { FaCamera, FaCameraRetro, FaSmile, FaVideo } from 'react-icons/fa';
import { getAvatar } from '../../service/ProfileService';
import { deletePost, getPostByUserLogin } from '../../service/PostService';
import Swal from 'sweetalert2';

const ProfilePage = () => {
  const token = localStorage.getItem('token');
  const [avatar, setAvatar] = useState('https://bootdey.com/img/Content/avatar/avatar7.png');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy ảnh đại diện từ API
  useEffect(() => {
    if (!token) {
      return;
    }
    getAvatar(token)
      .then((data) => {
        setAvatar(data.result);
      })
      .catch((error) => console.log(error));
  }, [token]);

  // Lấy danh sách bài viết từ API
  useEffect(() => {
    const fetchPostByUserLogin = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const data = await getPostByUserLogin(token, currentPage);
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
            await deletePost(token, postId);
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
          {/* Ảnh bìa dùng thẻ img */}
          <div className="my-account-cover-photo">
            <img
              src="https://inkythuatso.com/uploads/thumbnails/800/2022/04/anh-bia-facebook-lien-quan-den-hoc-hanh-va-thi-cu-an-tuong-26-12-15-20-06.jpg"
              alt="Ảnh bìa"
              className="my-account-cover-img"
            />
            <div className="my-account-cover-overlay">
              <button className="my-account-cover-button">
                <FaCamera /> Thêm ảnh bìa
              </button>
            </div>
          </div>

          {/* Thông tin cá nhân */}
          <div className="my-account-profile-section">
            <div className="my-account-avatar-section">
              <img src={avatar || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"} className="my-account-avatar" />
              <button className="my-account-edit-photo">
                <i className="fa-solid fa-camera"></i>
              </button>
            </div>

            <div className="my-account-info">
              <h2 className="my-account-name">Lê Khánh Đức</h2>
              <p className="my-account-friends-count">576 người bạn</p>
              <button className="my-account-edit-profile-btn">Chỉnh sửa trang cá nhân</button>
            </div>
          </div>

          {/* Menu điều hướng */}
          <div className="my-account-menu">
            <button className="menu-item">Bài viết</button>
            <button className="menu-item">Giới thiệu</button>
            <button className="menu-item">Bạn bè</button>
            <button className="menu-item">Ảnh</button>
            <button className="menu-item">Video</button>
            <button className="menu-item">Check in</button>
            <button className="menu-item">Xem thêm</button>
          </div>

          {/* Nội dung trang cá nhân */}
          <div className="my-account-content">
            <div className="my-account-about">
              <h3>
                <i className="fa-solid fa-info-circle"></i> Giới thiệu
              </h3>
              <button className="about-button">
                <i className="fa-solid fa-user-plus"></i> Thêm tiểu sử
              </button>
              <button className="about-button">
                <i className="fa-solid fa-pen"></i> Chỉnh sửa chi tiết
              </button>
            </div>

            {/* Phần hiển thị bài viết từ API */}
            <div className="my-account-post-section">
              <div className="create-post">
                <textarea placeholder="Bạn đang nghĩ gì?"></textarea>
                <div className="post-options">
                  <button className="post-option">
                    <FaVideo className="video-icons" /> Video trực tiếp
                  </button>
                  <button className="post-option">
                    <FaCameraRetro className="video-images" /> Ảnh/video
                  </button>
                  <button className="post-option">
                    <FaSmile className="fasmile" /> Cảm xúc/hoạt động
                  </button>
                </div>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="my-account-post">
                    <div className="post-header">
                      <p>
                        <img
                          src={post.avatar || avatar}
                          alt="Avatar nhỏ"
                          className="my-account-avatar-post"
                        />
                        <strong>{post.name}</strong> - {post.createdAt}{' '}
                        <i className="fa-solid fa-globe"></i>
                      </p>
                      <button className="delete-post-button"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <i className="fa-solid fa-trash"></i>

                      </button>
                    </div>
                    <p>{post.content}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Bài đăng hình ảnh"
                        className="post-image"
                      />
                    )}
                    <div className="post-interactions">
                      <button className="interaction-button">
                        <i className="fa-solid fa-thumbs-up"></i> Thích
                      </button>
                      <button className="interaction-button">
                        <i className="fa-solid fa-comment"></i> Bình luận
                      </button>
                      <button className="interaction-button">
                        <i className="fa-solid fa-share"></i> Chia sẻ
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
