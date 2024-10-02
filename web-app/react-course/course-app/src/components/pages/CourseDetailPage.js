import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCommentDots, FaReply, FaTrash, FaStar, FaBook } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { buyCourse, getChapterById, getCommentByCourseId, getCourseById } from "../../service/CourseService";
import { addComment, addReplyComment, deleteComment, editComment } from "../../service/ReviewService";
import CourseContent from "../AppComponents/CourseContent";
import { CommentSection } from "../AppComponents/CommentSection";
import { CourseFeatur } from "../AppComponents/CourseFeature";

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
    const [chapter, setChapter] = useState(null);


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

    useEffect(() => {
        getChapterById(id)
            .then(data => {
                setChapter(data.result)
                setLoading(false);
            }).catch(error => {
                console.log(error)
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
    
    if (!course) {
        return <div>Course data is not available</div>;
    }

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
            rating: 0,
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

                            <CourseContent chapter={chapter} />
                            <CommentSection
                                comments={comments}
                                newComment={newComment}
                                editingCommentId={editingCommentId}
                                setEditingCommentId={setEditingCommentId}
                                newRating={newRating}
                                setNewComment={setNewComment}
                                setNewRating={setNewRating}
                                replyContent={replyContent}
                                setReplyContent={setReplyContent}
                                editContent={editContent}
                                setEditContent={setEditContent}
                                renderStars={renderStars}
                                handleAddComment={handleAddComment}
                                handleReplyToggle={handleReplyToggle}
                                handleAddReply={handleAddReply}
                                handleEditComment={handleEditComment}
                                handleDeleteComment={handleDeleteComment}
                                handleRatingChange={handleRatingChange} /> </div>

                        <CourseFeatur
                            course={course}
                            handleEnrollNow={handleEnrollNow} />

                            
                    </div>
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    className="custom-toast-container"
                />
            </div>
    );
};