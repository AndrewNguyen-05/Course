import React, { useEffect, useState } from 'react';
import { TopBar } from '../layouts/TopBar';
import { Header } from '../layouts/Header';
import { FaCamera, FaCameraRetro, FaSmile, FaVideo } from 'react-icons/fa';
import { getAvatar } from '../../service/ProfileService';

const ProfilePage = () => {

    const token = localStorage.getItem('token');
    const [avatar, setAvatar] = useState('https://bootdey.com/img/Content/avatar/avatar7.png');

    useEffect(() => {
        if(!token){
            return;
        }
        getAvatar(token)
        .then(data => {
            setAvatar(data.result);
        }).catch(error => console.log(error))
    })
    return (
        <div>
            <TopBar />
            <Header />
            <div className="my-account-container">
                {/* Ảnh bìa dùng thẻ img */}
                <div className="my-account-cover-photo">
                    <img
                        src="https://inkythuatso.com/uploads/thumbnails/800/2022/04/anh-bia-facebook-lien-quan-den-hoc-hanh-va-thi-cu-an-tuong-26-12-15-20-06.jpg"
                        alt="Ảnh bìa"
                        className="my-account-cover-img"
                    />
                    <div className="my-account-cover-overlay">
                        <button className="my-account-cover-button"><FaCamera /> Thêm ảnh bìa</button>
                    </div>
                </div>

                {/* Thông tin cá nhân */}
                <div className="my-account-profile-section">
                    <div className="my-account-avatar-section">
                        <img
                            src={avatar}
                            alt="Avatar"
                            className="my-account-avatar"
                        />
                        <button className="my-account-edit-photo"><i className="fa-solid fa-camera"></i></button>
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
                        <h3><i className="fa-solid fa-info-circle"></i> Giới thiệu</h3>
                        <button className="about-button">
                            <i className="fa-solid fa-user-plus"></i> Thêm tiểu sử
                        </button>
                        <button className="about-button">
                            <i className="fa-solid fa-pen"></i> Chỉnh sửa chi tiết
                        </button>
                    </div>

                    <div className="my-account-post-section">
                        <div className="create-post">
                            <textarea placeholder="Bạn đang nghĩ gì?"></textarea>
                            <div className="post-options">
                                <button className="post-option"><FaVideo className='video-icons' /> Video trực tiếp</button>
                                <button className="post-option"><FaCameraRetro className='video-images' /> Ảnh/video</button>
                                <button className="post-option"> <FaSmile className='fasmile' /> Cảm xúc/hoạt động</button>
                            </div>
                        </div>

                        {/* Bài đăng thứ nhất */}
                        <div className="my-account-post">
                            <div className="post-header">
                                <p>
                                    <img
                                        src={avatar}
                                        alt="Avatar nhỏ"
                                        className="my-account-avatar-post"
                                    />
                                    <strong>Lê Khánh Đức</strong> - 20 giờ trước <i className="fa-solid fa-globe"></i>
                                </p>
                                <button className="delete-post-button">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                            <p>
                                "Một trong các thành phần quan trọng trong thiết kế của Slack đó chính là các Cron Job.
                                Các Cron job sẽ đảm nhiệm thực thi các tác vụ quan trọng tại Slack như..."
                                <a href="#"> Xem thêm</a>
                            </p>
                            <img
                                src="https://media.geeksforgeeks.org/wp-content/uploads/20190822182410/Spring-Boot-flow-architecture.jpg"
                                alt="Bài đăng hình ảnh"
                                className="post-image"
                            />
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

                        {/* Bài đăng thứ hai */}
                        <div className="my-account-post">
                            <div className="post-header">
                                <p>
                                    <img
                                        src="https://bootdey.com/img/Content/avatar/avatar7.png"
                                        alt="Avatar nhỏ"
                                        width={40}
                                        height={40}
                                        className="my-account-avatar-post"
                                    />
                                    <strong>Lê Khánh Đức</strong> - 2 ngày trước <i className="fa-solid fa-globe"></i>
                                </p>
                                <button className="delete-post-button">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                            <p>
                                "Hôm nay là một ngày thật tuyệt vời khi mình đã hoàn thành xong dự án React đầu tiên!"
                            </p>
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

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;