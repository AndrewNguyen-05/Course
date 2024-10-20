import React, { useEffect, useState } from 'react';
import { TopBar } from '../../layouts/TopBar';
import { Header } from '../../layouts/Header';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { ReviewSection } from '../CourseDetailPage/components/ReviewSection';
import { addReplyReview, addReview, deleteReview, editReview } from "../../../service/ReviewService";
import { ReviewLesson } from '../CourseDetailPage/components/ReviewLesson';

export const LearningPage = () => {
    useEffect(() => {
        document.title = 'Learning';
    });

    const { id } = useParams();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [chapters, setChapters] = useState([]);  // Danh sách các chương từ API
    const [currentLesson, setCurrentLesson] = useState(null);  // Bài học hiện tại
    const [openSections, setOpenSections] = useState({});  // Trạng thái mở của các chương
    const [comments, setComments] = useState([]); // list comment
    const [newComment, setNewComment] = useState(""); // add comment
    const [replyContent, setReplyContent] = useState({});
    const [editContent, setEditContent] = useState({}); // cập nhật nội dung chỉnh sửa của bình luận.
    const [editingCommentId, setEditingCommentId] = useState(null); // lưu ID của bình luận đang được chỉnh sửa

    // Lấy dữ liệu các chương và bài học
    useEffect(() => {
        const fetchLessonByCourseId = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`http://localhost:8080/api/v1/info-course/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch lessons');
                }
                const data = await response.json();
                console.log(data);
                setChapters(data.result.chapters || []);
                setLoading(false);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLessonByCourseId();
    }, [id, token]);

    // Add a new comment
    const handleAddReview = async () => {
        if (!newComment.trim()) {
            toast.error('Please enter a comment or select a rating');
            return;
        }

        const commentData = {
            content: newComment.trim(),
            parentCommentId: null,
            courseId: id
        };

        try {
            const result = await addReview(id, commentData);
            setComments([{
                ...result, // sao chép toàn bộ thuộc tính trong result:  bình luận mới được trả về từ server.
                replying: false,
                replies: []
            }, ...comments]);  // sao chép toàn bộ các comment trước đó và bao gồm cả comment mới được thêm vào đầu danh sách

            setNewComment("");
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
            parentReviewId: commentId,
            courseId: id
        };

        try {
            const result = await addReplyReview(id, replyData);

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
    const handleEditReview = async (commentId) => {
        const updatedContent = (editContent[commentId] || "").trim();

        if (!updatedContent) {
            toast.error('Please enter new content');
            return;
        }
        try {
            const result = await editReview(commentId, updatedContent, token);

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
    const handleDeleteReview = async (reviewId) => {
        try {
            const result = await deleteReview(reviewId, token);
            if (result) {
                // Cập nhật lại danh sách comments sau khi xóa thành công
                setComments((prevComments) => {
                    const updatedReviews = prevComments
                        .filter(comment => comment.id !== reviewId)  // Loại bỏ bình luận cha đã bị xoá
                        .map(comment => ({
                            ...comment,
                            replies: comment.replies.filter(reply => reply.id !== reviewId)  // Loại bỏ cả các replies nếu có
                        }));

                    return updatedReviews;
                });
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Toggle reply input
    const handleReplyToggle = (reviewId) => {
        const updatedReviews = comments.map(comment => {
            if (comment.id === reviewId) {
                return { ...comment, replying: !comment.replying };
            }
            return comment;
        });
        setComments(updatedReviews);
    };

    // Đóng/mở chương học
    const toggleSection = (sectionId) => {
        setOpenSections(prevState => ({
            ...prevState,
            [sectionId]: !prevState[sectionId]
        }));
    };

    // Xử lý khi chọn bài học trong một chương
    const handleLessonClick = (lesson) => {
        if (lesson.videoUrl) {
            setCurrentLesson(lesson);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <TopBar />
            <Header />
            <div className='content-page'>
                <div className="lp-learning-container d-flex">
                    {/* Bên trái: Danh sách chương và bài học */}
                    <div className="lp-lesson-list">
                        <h3>Course Content</h3>
                        {chapters.map((chapter, index) => (
                            <div key={index} className="lesson-section">
                                {/* Tiêu đề chương */}
                                <div className="sections-title" onClick={() => toggleSection(chapter.chapterId)}>
                                    <h4>
                                        {chapter.chapterName}{" "}
                                        <span className="toggle-icon">
                                            {openSections[chapter.chapterId] ? (
                                                <i className="fas fa-chevron-down"></i>
                                            ) : (
                                                <i className="fas fa-chevron-right"></i>
                                            )}
                                        </span>
                                    </h4>
                                </div>

                                {/* Danh sách bài học trong chương */}
                                {openSections[chapter.chapterId] && chapter.lessonDto && (
                                    <ul className="lesson-list">
                                        {chapter.lessonDto.map((lesson, lessonIndex) => (
                                            <li
                                                key={lessonIndex}
                                                className="lesson-item"
                                                onClick={() => handleLessonClick(lesson)}
                                            >
                                                <i className="fa fa-file-video"></i>
                                                <span>{`Lesson: ${lesson.lessonName}`}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Bên phải: Video và mô tả bài học */}
                    <div className="lp-video-content">
                        {currentLesson ? (
                            <div>
                                <h3>{currentLesson.lessonName}</h3>
                                <video
                                    key={currentLesson.videoUrl}
                                    width="100%"
                                    height={750}
                                    controls
                                >
                                    <source src={currentLesson.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <ReviewLesson
                                    comments={comments}
                                    newComment={newComment}
                                    editingCommentId={editingCommentId}
                                    setEditingCommentId={setEditingCommentId}
                                    setNewComment={setNewComment}
                                    replyContent={replyContent}
                                    setReplyContent={setReplyContent}
                                    editContent={editContent}
                                    setEditContent={setEditContent}
                                    handleAddReview={handleAddReview}
                                    handleReplyToggle={handleReplyToggle}
                                    handleAddReply={handleAddReply}
                                    handleEditReview={handleEditReview}
                                    handleDeleteReview={handleDeleteReview}
                                />
                            </div>
                        ) : (
                            <p>Chọn một bài học để xem nội dung</p>
                        )}
                    </div>
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

export default LearningPage;
