import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaClock, FaCommentDots, FaHeart, FaReply } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CourseDetail = () => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    const { id } = useParams(); // Lấy course ID từ URL
    const [course, setCourse] = useState(null); // Trạng thái lưu thông tin khóa học
    const [loading, setLoading] = useState(true); // Trạng thái tải trang
    const [comments, setComments] = useState([]); // Trạng thái lưu bình luận và phản hồi
    const [newComment, setNewComment] = useState(""); // Trạng thái lưu bình luận mới
    const [replyContent, setReplyContent] = useState({}); // Trạng thái lưu nội dung phản hồi theo comment ID
    
     // Lấy dữ liệu chi tiết khóa học từ API
     useEffect(() => {
        fetch(`http://localhost:8080/api/v1/course/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json()
        ).then(data => {
            setCourse(data.result);
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    }, [id]);


     // Lấy dữ liệu bình luận từ API
     useEffect(() => {
        fetch(`http://localhost:8080/api/v1/courses-comment/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()
        ).then(data => {
            // Đảm bảo rằng mỗi bình luận có trường 'replying' và 'replies'
            const updatedComments = data.result.map(comment => ({
                ...comment,
                replying: false, // Khởi tạo thuộc tính 'replying' nếu chưa có
                replies: comment.replies || [] 
            }));
            setComments(updatedComments);
        }).catch(error => console.log(error));
    }, [id]);


    if (loading) return <div>Loading...</div>

   
    // Thêm bình luận mới (Không phải phản hồi)
    const handleAddComment = () => {
        if (!newComment || newComment.trim() === "") {
            toast.error('Please enter a comment');
            return;
        }

        const commentData = {
            content: newComment.trim(),
            parentCommentId: null,
            courseId: id
        };

        fetch(`http://localhost:8080/api/v1/add-comment?id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.result) {
                    // Thêm bình luận mới vào đầu danh sách
                    setComments([{
                        ...data.result,
                        replying: false,
                        replies: []
                    }, ...comments]);
                    setNewComment("");
                    toast.success('Comment added successfully');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('Failed to add comment');
            });
    };

    // Thêm phản hồi cho một bình luận
    const handleAddReply = (commentId) => {
        const replyText = replyContent[commentId]; // Lấy nội dung reply cho comment cha có ID = commentId

        if (!replyText || replyText.trim() === "") {
            toast.error('Please enter a reply');
            return;
        }

        const commentData = {
            content: replyText.trim(),
            parentCommentId: commentId, 
            courseId: id  
        };

        fetch(`http://localhost:8080/api/v1/add-comment?id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(commentData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    const updatedComments = comments.map(comment => {
                        if (comment.id === commentId) {
                            return {
                                ...comment,
                                replies: [...comment.replies, { ...data.result, replying: false }] // Thêm phản hồi mới vào danh sách phản hồi
                            };
                        }
                        return comment;
                    });
                    setComments(updatedComments);
                    setReplyContent({ ...replyContent, [commentId]: '' }); // Xóa nội dung reply sau khi gửi
                    toast.success('Reply added successfully');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('Failed to add reply');
            });
    };

   
     // Toggle hiển thị form reply
     const handleReplyToggle = (commentId) => {
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, replying: !comment.replying }; // Toggle trạng thái reply
            }
            return comment;
        });
        setComments(updatedComments);
    };
   
    return (
        <div>
            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="mb-5">
                                <div className="section-title position-relative mb-5">
                                    <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Course Detail</h6>
                                    <h1 className="display-4">{course.title}</h1>
                                </div>
                                <img className="img-fluid rounded w-100 mb-4" src={course.thumbnail} alt="Course Detail" />
                                <p>{course.description}</p>
                            </div>

                            {/* Phần bình luận */}
                            <div className="comments-section mt-5">
                                <h2 className="mb-4 text-secondary"><FaCommentDots className="mr-2" /> Comments</h2>

                                {/* Form thêm bình luận */}
                                <div className="comment-form mb-5">
                                    <textarea
                                        className="form-control mb-3"
                                        rows="3"
                                        placeholder="Write your comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button className="btn btn-primary px-4" onClick={handleAddComment}>
                                        Submit Comment
                                    </button>
                                </div>

                                {/* Danh sách bình luận */}
                                <div className="comments-list">
                                    {comments.map((comment, index) => (
                                        <div key={index} className="comment-item mb-4 p-3 bg-light rounded shadow-sm">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={comment.avatar ? comment.avatar : 'default-avatar-url'}
                                                    alt="User Avatar"
                                                    className="rounded-circle mr-2"
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                />
                                                <h6 className="m-0">{comment.name}</h6>
                                            </div>

                                            <p className="mt-2">{comment.content}</p>

                                            {/* Phần hành động */}
                                            <div className="comment-actions d-flex justify-content-between">
                                                <button className="btn btn-sm btn-outline-danger">
                                                    <FaHeart className="mr-1" /> Like
                                                </button>

                                                <button className="btn btn-sm btn-outline-info" onClick={() => handleReplyToggle(comment.id)}>
                                                    <FaReply className="mr-1" /> Reply
                                                </button>
                                            </div>

                                            {/* Phần nhập phản hồi */}
                                            {comment.replying && (
                                                <div className="comment-reply-form mt-4">
                                                    <textarea
                                                        className="form-control mb-3"
                                                        rows="3"
                                                        placeholder="Write your reply..."
                                                        value={replyContent[comment.id] || ""}
                                                        onChange={(e) => setReplyContent({ ...replyContent, [comment.id]: e.target.value })}
                                                    />
                                                    <button className="btn btn-primary px-4" onClick={() => handleAddReply(comment.id)}>
                                                        Submit Reply
                                                    </button>
                                                </div>
                                            )}

                                            {/* Hiển thị danh sách phản hồi */}
                                            {comment.replies && comment.replies.length > 0 && (
                                                <div className="replies mt-3">
                                                    {comment.replies.map((reply, replyIndex) => (
                                                        <div key={replyIndex} className="reply-item mb-2 pl-3">
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    src={reply.avatar ? reply.avatar : 'default-avatar-url'}
                                                                    alt="User Avatar"
                                                                    className="rounded-circle mr-2"
                                                                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                                />
                                                                <h6 className="m-0">{reply.name}</h6>
                                                            </div>
                                                            <p className="mt-2">{reply.content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Các thông tin chi tiết khác về khóa học */}
                        <div className="col-lg-4 mt-5 mt-lg-0">
                            <div className="course-features-container mb-5 py-4 px-4 shadow-lg">
                                <h3 className="course-features-title text-white py-3 px-4 m-0">Course Features</h3>

                                {/* Instructor */}
                                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-user mr-2 text-info"></i> Instructor
                                    </h6>
                                    <h6 className="text-white my-2">{course.author}</h6>
                                </div>

                                {/* Rating */}
                                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-star mr-2 text-warning"></i> Rating
                                    </h6>
                                    <h6 className="text-white my-2">4.5 <small>(250)</small></h6>
                                </div>

                                {/* Lectures */}
                                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-book mr-2 text-success"></i> Lectures
                                    </h6>
                                    <h6 className="text-white my-2">15</h6>
                                </div>

                                {/* Duration */}
                                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-clock mr-2 text-danger"></i> Duration
                                    </h6>
                                    <h6 className="text-white my-2">{course.duration} hours</h6>
                                </div>

                                {/* Skill Level */}
                                <div className="course-feature-item d-flex justify-content-between border-bottom px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-signal mr-2 text-warning"></i> Skill level
                                    </h6>
                                    <h6 className="text-white my-2">{course.courseLevel}</h6>
                                </div>

                                {/* Language */}
                                <div className="course-feature-item d-flex justify-content-between px-4 py-2">
                                    <h6 className="text-white my-2">
                                        <i className="fa fa-language mr-2 text-purple"></i> Language
                                    </h6>
                                    <h6 className="text-white my-2">{course.language}</h6>
                                </div>

                                {/* Course Price */}
                                <h5 className="course-price text-white py-3 px-4 m-0">
                                    <i className="fa fa-money mr-2 text-warning"></i>
                                    Course Price: {new Intl.NumberFormat('vi-VN').format(course.price)}
                                    <span className="currency">₫</span>
                                </h5>

                                {/* Enroll Now Button */}
                                <div className="py-3 px-4">
                                    <a className="btn enroll-now-btn btn-block py-3 px-5" href="">Enroll Now</a>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h2 className="mb-3">Categories</h2>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <a href="" className="text-decoration-none h6 m-0">Web Design</a>
                                        <span className="badge badge-primary badge-pill">150</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <a href="" className="text-decoration-none h6 m-0">Web Development</a>
                                        <span className="badge badge-primary badge-pill">131</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <a href="" className="text-decoration-none h6 m-0">Online Marketing</a>
                                        <span className="badge badge-primary badge-pill">78</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <a href="" className="text-decoration-none h6 m-0">Keyword Research</a>
                                        <span className="badge badge-primary badge-pill">56</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <a href="" className="text-decoration-none h6 m-0">Email Marketing</a>
                                        <span className="badge badge-primary badge-pill">98</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mb-5">
                                <h2 className="mb-4">Recent Courses</h2>

                                <a className="d-flex align-items-center text-decoration-none mb-4" href="">
                                    <img className="img-fluid rounded" src={require('./../../img/courses-80x80.jpg')} alt="Recent Course 3" />
                                    <div className="pl-3">
                                        <h6>Web design & development courses for beginners</h6>
                                        <div className="d-flex">
                                            <small className="text-body mr-3"><i className="fa fa-user text-primary mr-2"></i>Jhon Doe</small>
                                            <small className="text-body"><i className="fa fa-star text-primary mr-2"></i>4.5 (250)</small>
                                        </div>
                                    </div>
                                </a>

                                <a className="d-flex align-items-center text-decoration-none" href="">
                                    <img className="img-fluid rounded" src={require('./../../img/courses-80x80.jpg')} alt="Recent Course 4" />
                                    <div className="pl-3">
                                        <h6>Web design & development courses for beginners</h6>
                                        <div className="d-flex">
                                            <small className="text-body mr-3"><i className="fa fa-user text-primary mr-2"></i>Jhon Doe</small>
                                            <small className="text-body"><i className="fa fa-star text-primary mr-2"></i>4.5 (250)</small>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    className="custom-toast-container"
                />
            </div>
        </div >
    );
};
