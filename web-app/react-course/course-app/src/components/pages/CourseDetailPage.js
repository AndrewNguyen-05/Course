import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCommentDots, FaReply, FaTrash, FaStar, FaBook } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { buyCourse, getCommentByCourseId, getCourseById } from "../../service/CourseService";
import { addComment, addReplyComment, deleteComment, editComment } from "../../service/ReviewService";

export const CourseDetail = () => {
    const token = localStorage.getItem('token');
    const { id } = useParams();
    const [course, setCourse] = useState(null);  // thông tin chi tiết về khóa học
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]); // list comment
    const [newComment, setNewComment] = useState(""); // add comment
    const [replyContent, setReplyContent] = useState({}); // update nội dung cmt
    const [editContent, setEditContent] = useState({}); // cập nhật nội dung chỉnh sửa của bình luận.
    const [editingCommentId, setEditingCommentId] = useState(null); // lưu ID của bình luận đang được chỉnh sửa
    const [newRating, setNewRating] = useState(0);

    useEffect(() => {
        document.title = 'Courses Detail'
    })

    // Fetch course details
    useEffect(() => {
        getCourseById(id)
            .then(data => {
                console.log(data)
                setCourse(data.result);
                setLoading(false);
            }).catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    // Fetch comments
    useEffect(() => {
        getCommentByCourseId(id)
            .then(data => {
                const updatedComments = data.result.map(comment => ({
                    ...comment,
                    replying: false,
                    replies: comment.replies || []
                }));
                setComments(updatedComments);
            }).catch(error => console.log(error));
    }, [id]);

    if (loading) return <div>Loading...</div>;


    // Add a new comment
    const handleAddComment = async () => {
        if (!newComment.trim() && newRating === 0) {
            toast.error('Please enter a comment or select a rating');
            return;
        }

        const commentData = {
            content: newComment.trim(),
            rating: newRating,
            parentCommentId: null,
            courseId: id
        };

        try {
            const result = await addComment(commentData, token, id);
            setComments([{
                ...result, // sao chép toàn bộ thuộc tính trong result:  bình luận mới được trả về từ server.
                replying: false,
                replies: []
            }, ...comments]);  // sao chép toàn bộ các comment trước đó và bao gồm cả comment mới được thêm vào đầu danh sách

            setNewComment("");
            setNewRating(0);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle adding a reply
    const handleAddReply = async (commentId) => {
        const replyText = replyContent[commentId];

        if (!replyText.trim()) {
            toast.error('Please enter a reply');
            return;
        }

        const replyData = {
            content: replyText.trim(),
            parentCommentId: commentId,
            courseId: id
        };

        try {
            const result = await addReplyComment(replyData, token, id);

            if (result) {
                // Cập nhật lại danh sách comments với reply mới
                const updatedComments = comments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: [...comment.replies, { ...result, replying: false }]
                        };
                    }
                    return comment;
                });
                setComments(updatedComments);
                setReplyContent({ ...replyContent, [commentId]: '' });
            }
        } catch (error) {
            console.error('Error in component:', error);
        }
    };


    // Edit comment
    const handleEditComment = async (commentId) => {
        const updatedContent = (editContent[commentId] || "").trim();
    
        if (!updatedContent) {
            toast.error('Please enter new content');
            return;
        }
        try {
            const result = await editComment(commentId, updatedContent, token);
    
            if (result) {
                setComments((prevComments) => {
                    const updatedComments = prevComments.map(comment => {
                        // Cập nhật comment cha nếu cần
                        if (comment.id === commentId) {
                            return { ...comment, content: result.content };
                        }
                        // Cập nhật replies nếu comment là trả lời
                        const updatedReplies = comment.replies.map(reply => {
                            if (reply.id === commentId) {
                                return { ...reply, content: result.content };
                            }
                            return reply;
                        });
                        return { ...comment, replies: updatedReplies };
                    });
                    return [...updatedComments]; 
                });
    
                setEditingCommentId(null); // Thoát khỏi chế độ chỉnh sửa
            }
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };
    

    // Delete comment
    const handleDeleteComment = async (commentId) => {
        try {
            const result = await deleteComment(commentId, token);
            if (result) {
                // Cập nhật lại danh sách comments sau khi xóa thành công
                setComments((prevComments) => {
                    const updatedComments = prevComments
                        .filter(comment => comment.id !== commentId)  // Loại bỏ bình luận cha đã bị xoá
                        .map(comment => ({
                            ...comment,
                            replies: comment.replies.filter(reply => reply.id !== commentId)  // Loại bỏ cả các replies nếu có
                        }));
    
                    return updatedComments;
                });
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };    

    // Toggle reply input
    const handleReplyToggle = (commentId) => {
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, replying: !comment.replying };
            }
            return comment;
        });
        setComments(updatedComments);
    };


    const handleEnrollNow = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to buy this course?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, buy now!',
            cancelButtonText: 'No, cancel.'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const data = await buyCourse(token, id);
                    Swal.fire({
                        title: 'Purchase successful!',
                        text: `You have purchased the course: ${data.result.title}`,
                        icon: 'success'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Lỗi!',
                        text: error.message || 'Đã xảy ra lỗi trong quá trình mua khóa học. Vui lòng thử lại sau.',
                        icon: 'error'
                    });
                    console.error(error);
                }
            }
        });
    };  

    const renderStars = (rating, handleRating) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        size={25}
                        color={star <= rating ? "#ffc107" : "#e4e5e9"} // Nếu giá trị của star (ngôi sao hiện tại trong vòng lặp) nhỏ hơn hoặc bằng rating, thì ngôi sao sẽ có màu vàng (#ffc107).
                        onClick={() => handleRating(star)}
                        style={{ cursor: "pointer" }}
                    />
                ))}
            </div>
        );
    };

    const handleRatingChange = (rating) => {
        if (newRating === rating) {
            setNewRating(rating - 1);
        } else {
            setNewRating(rating);
        }
    };

    return (
        <div>

            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="mb-5">
                                <h6 className="text-secondary text-uppercase pb-2">Course Detail</h6>
                                <h1 className="display-4">{course.title}</h1>
                                <img className="img-fluid rounded w-100 mb-4" src={course.thumbnail} alt="Course" />
                                <p>{course.description}</p>
                            </div>

                            <h2 className="lesson-header mb-4 d-flex align-items-center">
                                <FaBook style={{ color: "#2c3e50", marginRight: "15px", fontSize: "1.5em" }} />
                                Course Lessons
                            </h2>

                            <ul className="lesson-list">
                                {course && Array.isArray(course.lessonName) && course.lessonName.map((lesson, index) => (
                                    <li key={index} className="lesson-item">
                                        <div className="d-flex align-items-center">
                                            <i className="fa fa-file-alt lesson-icon"></i>
                                            <span className="lesson-title">{lesson}</span> {/* lesson ở đây là một chuỗi */}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Comment Section */}
                            <div className="comments-section mt-5">
                                <h2 className="mb-4 text-secondary"><FaCommentDots className="mr-2" /> Comments</h2>

                                {/* Add Comment */}
                                <div className="comment-form mb-5">
                                    <textarea
                                        className="form-control mb-3"
                                        rows="3"
                                        placeholder="Write your comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />

                                    {/* Rating Stars */}
                                    {renderStars(newRating, handleRatingChange)}


                                    <button className="btn btn-primary px-4 mt-3" onClick={handleAddComment}>
                                        Submit Comment
                                    </button>
                                </div>

                                {/* Comment List */}
                                <div className="comments-list">
                                    {comments.map((comment, index) => (
                                        <div key={index} className="comment-item mb-4 p-3 bg-light rounded shadow-sm">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={comment.avatar || 'https://bootdey.com/img/Content/avatar/avatar7.png'}
                                                        alt="User Avatar"
                                                        className="rounded-circle mr-2"
                                                        style={{ width: '40px', height: '40px' }}
                                                    />
                                                    <h6 className="m-0">{comment.name}</h6>
                                                </div>
                                                <div>
                                                    <button className="btn btn-sm btn-outline-info mr-2" onClick={() => setEditingCommentId(comment.id)}>
                                                        <i className="fa-solid fa-comment-dots"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteComment(comment.id)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Display Rating */}
                                            <div className="mt-2">
                                                {renderStars(comment.rating || 0, () => { })}
                                            </div>

                                            {/* Comment Content */}
                                            {editingCommentId === comment.id ? (
                                                <div>
                                                    <textarea
                                                        className="form-control mt-3"
                                                        rows="3"
                                                        value={editContent[comment.id] !== undefined ? editContent[comment.id] : comment.content}
                                                        onChange={(e) => setEditContent({ ...editContent, [comment.id]: e.target.value })}
                                                    />
                                                    <button className="btn btn-success mt-2" onClick={() => handleEditComment(comment.id)}>
                                                        Save
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="mt-2">{comment.content}</p>
                                            )}


                                            {/* Replies Section */}
                                            {comment.replies.length > 0 && (
                                                <div className="replies mt-3 pl-5">
                                                    {comment.replies.map((reply, replyIndex) => (
                                                        <div key={replyIndex} className="reply-item mb-2 pl-3">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="d-flex align-items-center">
                                                                    <img
                                                                        src={reply.avatar || 'default-avatar-url'}
                                                                        alt="User Avatar"
                                                                        className="rounded-circle mr-2"
                                                                        style={{ width: '30px', height: '30px' }}
                                                                    />
                                                                    <h6 className="m-0">{reply.name}</h6>
                                                                </div>

                                                                <div>
                                                                    <button className="btn btn-sm btn-outline-info mr-2" onClick={() => setEditingCommentId(reply.id)}>
                                                                        <i className="fa-solid fa-comment-dots"></i>
                                                                    </button>

                                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteComment(reply.id)}>
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>

                                                            </div>

                                                            {editingCommentId === reply.id ? (
                                                                <div>
                                                                    <textarea
                                                                        className="form-control mt-3"
                                                                        rows="3"
                                                                        value={editContent[reply.id] !== undefined ? editContent[reply.id] : reply.content}
                                                                        onChange={(e) => setEditContent({ ...editContent, [reply.id]: e.target.value })}
                                                                    />
                                                                    <button className="btn btn-success mt-2" onClick={() => handleEditComment(reply.id)}>
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <p className="mt-2">{reply.content}</p>
                                                            )}

                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Reply Form */}
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

                                            {/* Reply button after replies */}
                                            <div className="comment-actions d-flex justify-content-end mt-2">
                                                <button className="btn btn-sm btn-outline-info" onClick={() => handleReplyToggle(comment.id)}>
                                                    <FaReply className="mr-1" /> Reply
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Other course details */}
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
                                    Course Price: {course.points}
                                    <span className="currency"><i className="fa-solid fa-coins coins-course"></i></span>
                                </h5>

                                {/* Enroll Now Button */}
                                <div className="py-3 px-4">
                                    <button
                                        className="btn enroll-now-btn btn-block py-3 px-5"
                                        onClick={handleEnrollNow} 
                                    >
                                        Enroll Now
                                    </button>
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

        </div>
    );
};