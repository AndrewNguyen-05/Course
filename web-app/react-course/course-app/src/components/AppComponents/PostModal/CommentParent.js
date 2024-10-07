import React from "react";
import { CommentReplies } from "./CommentReplies";
import { Button, Form, Image } from "react-bootstrap";
import CommentDropdown from "./CommentDropdown";
import { FaReply, FaThumbsUp } from "react-icons/fa";

export const CommentParent = ({
    comment,
    timeAgo,
    handleEditComment,
    handleDeleteComment,
    handleSaveEdit,
    handleCancelEdit,
    handleReplyToggle,
    setEditContent,
    editingCommentId,
    activeDropdownId,
    toggleDropdown,
    replyStatus,
    replyContent,
    setReplyContent,
    handleReplyComment,
    editContent,
}) => {
    // Check the state of replyStatus for debugging
    console.log('replyStatus:', replyStatus);

    return (
        <div className="post-comment-item">
            <div className="d-flex align-items-start">
                <Image
                    src={comment.avatar || 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'}
                    roundedCircle
                    width={30}
                    height={30}
                    className="me-3"
                />
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{comment.name}</strong> <span className="text-muted">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <CommentDropdown
                            commentId={comment.id}
                            handleEdit={() => handleEditComment(comment.id, comment.content)}
                            handleDelete={() => handleDeleteComment(comment.id)}
                            activeDropdownId={activeDropdownId}
                            toggleDropdown={toggleDropdown}
                        />
                    </div>

                    {/* Hiển thị phần nội dung comment */}
                    {editingCommentId === comment.id ? (
                        <div>
                            <Form.Control
                                as="textarea"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="my-2"
                            />
                            <Button variant="primary" onClick={() => handleSaveEdit(comment.id)}>
                                Save
                            </Button>
                            <Button variant="secondary" onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <p className="mb-1">{comment.content}</p>
                    )}

                    {/* Thêm các nút chức năng cho comment */}
                    <div className="d-flex align-items-center">
                        <Button variant="link" size="sm" className="text-primary p-0 me-3">
                            <FaThumbsUp /> {comment.likes} Thích
                        </Button>
                        <Button
                            variant="link"
                            size="sm"
                            className="text-primary p-0 text-reply"
                            onClick={() => handleReplyToggle(comment.id)}
                        >
                            <FaReply /> Phản hồi
                        </Button>
                    </div>

                    {/* Hiển thị các comment con */}
                    <CommentReplies
                        replies={comment.replies}
                        timeAgo={timeAgo}
                        handleEditComment={handleEditComment}
                        handleDeleteComment={handleDeleteComment}
                        handleSaveEdit={handleSaveEdit}
                        handleCancelEdit={handleCancelEdit}
                        activeDropdownId={activeDropdownId}
                        toggleDropdown={toggleDropdown}
                        editingCommentId={editingCommentId}
                        setEditContent={setEditContent}
                        editContent={editContent}
                    />

                    {/* Khung nhập phản hồi */}
                    {replyStatus[comment.id] && (
                        <div className="reply-box-container mt-2">
                            <textarea
                                placeholder="Viết phản hồi của bạn..."
                                className="form-control reply-textarea"
                                value={replyContent[comment.id] || ''}
                                onChange={(e) => setReplyContent({ ...replyContent, [comment.id]: e.target.value })}
                            />
                            <Button
                                variant="primary"
                                className="mt-1 reply-button"
                                onClick={() => handleReplyComment(comment.id)}
                            >
                                Gửi
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
