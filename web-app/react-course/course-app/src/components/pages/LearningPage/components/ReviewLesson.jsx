import { FaPaperPlane } from 'react-icons/fa';

export const ReviewLesson = (props) => {

    const {
        comments,
        handleAddCommentLesson,
        newCommentLesson,
        handleReplyChange,
        handleReplySubmit,
        replyContent,
        handleNewCommentChange,
        toggleReplyInput,
        activeReply,
        avatar
    }

        = props;

    return (
        <div>
            <div className="comment-lesson-container">
                <div className="comment-lesson-avatar">
                    <img
                        src={avatar}
                        alt="User Avatar"
                        className="comment-lesson-avatar-img"
                    />
                </div>
                <div className="comment-lesson-input-wrapper">
                    <input
                        type="text"
                        className="comment-lesson-input"
                        value={newCommentLesson}
                        onChange={(e) => handleNewCommentChange(e)}
                        placeholder="Enter your new comment"
                    />
                </div>
                <button
                    className="comment-lesson-submit"
                    onClick={handleAddCommentLesson}
                >
                    <FaPaperPlane />
                </button>
            </div>

            {/* Hiển thị danh sách bình luận */}
            {comments && comments.length > 0 ? (
                comments.map(comment => (
                    <div key={comment.reviewId} className="comment-lesson-container">
                        <div className="comment-lesson-avatar">
                            <img
                                src={comment.avatar}
                                alt="User Avatar"
                                className="comment-lesson-avatar-img"
                            />
                        </div>
                        <div className="comment-lesson-content">
                            <div className="comment-lesson-name">{comment.name}</div>
                            <div className="comment-lesson-text">{comment.content}</div>
                            <div className="comment-lesson-actions">
                                <span onClick={() => toggleReplyInput(comment.reviewId)}>Reply</span>
                            </div>

                            {comment.replies && comment.replies.length > 0 && (
                                <div className="comment-lesson-replies">
                                    {comment.replies.map(reply => (
                                        <div key={reply.reviewId} className="comment-lesson-container comment-lesson-reply">
                                            <div className="comment-lesson-avatar">
                                                <img
                                                    src={reply.avatar}
                                                    alt="User Avatar"
                                                    className="comment-lesson-avatar-img"
                                                />
                                            </div>
                                            <div className="comment-lesson-content">
                                                <div className="comment-lesson-name">{reply.name}</div>
                                                <div className="comment-lesson-text">{reply.content}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeReply === comment.reviewId && (
                                <div className="comment-lesson-reply-input-wrapper">
                                    <div className="comment-lesson-reply-input">
                                        <input
                                            type="text"
                                            value={replyContent[comment.reviewId] || ''}
                                            onChange={(e) => handleReplyChange(comment.reviewId, e.target.value)}
                                            placeholder="Write a reply..."
                                        />
                                        <button
                                            className="comment-lesson-submit-reply"
                                            onClick={() => handleReplySubmit(comment.reviewId)}
                                        >
                                            <FaPaperPlane />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No comments yet. Be the first to comment!</p>
            )}
        </div>
    );
};
