import React, { useEffect, useState } from 'react';
import { Modal, Button, Image, ListGroup, Form, Spinner, Dropdown } from 'react-bootstrap';
import { FaThumbsUp, FaReply, FaEllipsisH } from 'react-icons/fa';
import { toast } from 'react-toastify';
import moment from 'moment';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostFooter } from './PostFooter';
import { CommentInput } from './CommentInput';
import { addComment, deleteComment, getCommentByPostId, replyComment, updateComment } from '../../../../service/CommentService';
import { getAvatar } from '../../../../service/ProfileService';
import avatarDefault from '../../../../img/avatar-default.jpg'

const PostModal = ({ show, handleClose, post }) => {
    const postId = post?.id;
    const token = localStorage.getItem('token');
    const [avatar, setAvatar] = useState('https://bootdey.com/img/Content/avatar/avatar7.png')
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [replyStatus, setReplyStatus] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState({});
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [replyContent, setReplyContent] = useState({});

    const timeAgo = (createdAt) => {
        return moment(createdAt).fromNow();
    }

    // Fetch Avatar User Current Login
    useEffect(() => {
        if (!token) return;
        getAvatar()
            .then((data) => setAvatar(data.result))
            .catch((error) => console.log(error));
    })

    // Fetch Comment By Post Id
    useEffect(() => {
        if (!token || !postId) return;

        const fetchComments = async () => {
            setIsLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const data = await getCommentByPostId(postId, currentPage);
                const updatedComments = data.result.data.map((comment) => ({
                    ...comment,
                    replying: false,
                    replies: comment.replies || [],
                }));
                if (currentPage === 1) {
                    setComments(updatedComments);
                } else {
                    setComments((prevComments) => [...prevComments, ...updatedComments]);
                }
                if (updatedComments.length < 3) {
                    setHasMoreComments(false);
                }
            } catch (error) {
                console.error('Error fetching comments:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [token, postId, currentPage]);

    const handleLoadMoreComments = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    // Add Comment
    const handleAddComment = async () => {
        if (!commentContent.trim()) {
            toast.error("Comment cannot be empty!");
            return;
        }
        const commentData = {
            content: commentContent.trim(),
            postId: postId,
            parentCommentId: null
        };

        try {
            const result = await addComment(commentData);
            setComments([
                ...comments,
                {
                    ...result,
                    replying: false,
                    replies: []
                }
            ]);
            // comment mới(result) sẽ nằm dưới comment cũ(commentss)
            setCommentContent("");

        } catch (error) {
            console.log(error)
        }
    }

    // Reply Comment
    const handleReplyComment = async (commentId) => {
        const replyText = replyContent[commentId] || '';
        if (!replyText.trim()) {
            toast.error('Comment cannot be empty!');
            return;
        }

        const replyData = {
            content: replyText.trim(),
            parentCommentId: commentId,
            postId: postId,
        };

        try {
            const result = await replyComment(replyData);
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
            console.log('Error replying to comment:', error);
        }
    };

    // Delete Comment
    const handleDeleteComment = async (commentId) => {
        if (!token || !commentId) return;
        try {
            await deleteComment(commentId);

            setComments((prevComments) => {
                return prevComments.map((comment) => {
                    if (comment.replies.some((reply) => reply.id === commentId)) {
                        return {
                            ...comment,
                            replies: comment.replies.filter((reply) => reply.id !== commentId),
                        };
                    }
                    return comment;
                }).filter((comment) => comment.id !== commentId);
            });

            toast.success("Comment deleted successfully!");
        } catch (error) {
            toast.error(`Failed to delete comment: ${error.message}`);
        }
    };

    // Show Edit Comment
    const handleEditComment = (commentId, content) => {
        setEditingCommentId(commentId); // Xác định comment nào đang được chỉnh sửa
        setEditContent((prevEditContent) => ({ ...prevEditContent, [commentId]: content })); // editContent chứa đúng nội dung theo commentId
    };

    // Save edit comment
    const handleSaveEdit = async (commentId) => {
        const updatedContent = (editContent[commentId] || "").trim();
        if (!updatedContent) {
            toast.error('Please enter new content');
            return;
        }
        try {
            const result = await updateComment(commentId, updatedContent);
            if (result) {
                setComments((prevComments) => {
                    // Bước 1: Tạo một danh sách comments mới bằng cách map qua các bình luận cũ.
                    const updateComments = prevComments.map(comment => {
                    // Bước 2: Kiểm tra xem comment hiện tại có trùng ID với comment cần update không (commentId là ID của comment muốn update)
                        if (comment.id === commentId) {
                            // Nếu trùng, cập nhật content của comment đó với nội dung mới từ `result`
                            return { ...comment, content: result.content };
                        }
                    // Bước 3: Nếu không phải bình luận cha, tìm trong danh sách replies (bình luận con) của bình luận hiện tại
                        const updatedReplies = comment.replies.map(reply => {
                            // Nếu reply hiện tại có ID trùng với commentId, cập nhật nội dung của nó
                            if (reply.id === commentId) {
                                return { ...reply, content: result.content };
                            }
                            // Nếu không, giữ nguyên reply
                            return reply;
                        });
                    // Bước 4: Trả về bình luận hiện tại với danh sách replies đã được cập nhật (nếu có)
                        return { ...comment, replies: updatedReplies };
                    })
                    // Bước 5: Cập nhật lại state `comments` với danh sách bình luận đã thay đổi
                    return [...updateComments];
                });
                setEditingCommentId(null);
                setEditContent('');
            }
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    // ShowHide Reply
    const handleReplyToggle = (commentId) => {
        setReplyStatus((prevStatus) => ({
            ...prevStatus,
            [commentId]: !prevStatus[commentId]
        }));
    };

    // ShowHide Dropdow Edit và Delete Comment
    const toggleDropdown = (commentId) => {
        setActiveDropdownId((prevId) => (prevId === commentId ? null : commentId));
    };

    // Cancel Edit Commit
    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditContent('');
    };


    return (
        <Modal show={show} onHide={handleClose} centered className="post-modal">
            <Modal.Body className="post-modal-body p-0">
                <PostHeader avatar={post.avatar} author={post.author} createdAt={post.createdAt} />
                <PostContent content={post.content} image={post.image} />
                <PostFooter />

                <ListGroup className="post-modal-comments">
                    {comments.map((cmt) => (
                        <ListGroup.Item key={cmt.id} className="post-comment-item">
                            <div className="d-flex align-items-start">
                                <Image
                                    src={cmt.avatar || avatarDefault}
                                    roundedCircle
                                    width={30}
                                    height={30}
                                    className="me-3"
                                />
                                <div className="flex-grow-1">

                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{cmt.name}</strong> <span className="text-muted">{timeAgo(cmt.createdAt)}</span>
                                        </div>
                                        <Dropdown show={activeDropdownId === cmt.id} onToggle={() => toggleDropdown(cmt.id)} className="ms-auto">
                                            <Dropdown.Toggle as="button" className="post-dropdown-toggle">
                                                <FaEllipsisH />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="post-dropdown-menu">
                                                <Dropdown.Item onClick={() => handleEditComment(cmt.id, cmt.content)}>Edit</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleDeleteComment(cmt.id)}>Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>

                                    {/* Hiển thị phần nội dung comment cha */}
                                    {editingCommentId === cmt.id ? (
                                        <div>
                                            <Form.Control
                                                as="textarea"
                                                value={editContent[cmt.id] || ""} // Hiển thị đúng nội dung cho comment theo commentId
                                                onChange={(e) => setEditContent({ ...editContent, [cmt.id]: e.target.value })} // Cập nhật nội dung chỉnh sửa theo commentId
                                                className="my-2"
                                            />
                                            <Button variant="primary" onClick={() => handleSaveEdit(cmt.id)} className='save-comment'>Save</Button>
                                            <Button variant="secondary" onClick={handleCancelEdit} className='cancel-comment'>Cancel</Button>
                                        </div>
                                    ) : (
                                        <p className="mb-1">{cmt.content}</p>
                                    )}

                                    {/* Thêm các nút chức năng cho comment */}
                                    <div className="d-flex align-items-center">
                                        <Button variant="link" size="sm" className="text-primary p-0 me-3">
                                            <FaThumbsUp /> {cmt.likes} Thích
                                        </Button>
                                        <Button variant="link" size="sm" className="text-primary p-0 text-reply" onClick={() => handleReplyToggle(cmt.id)}>
                                            <FaReply /> Phản hồi
                                        </Button>
                                    </div>

                                    {/* Hiển thị phần replies, nếu có */}
                                    {cmt.replies && cmt.replies.length > 0 && (
                                        <div className="replies-container ml-4 mt-2">
                                            {cmt.replies.map((reply) => (
                                                <div key={reply.id} className="reply-item d-flex align-items-start mt-2">
                                                    <Image src={reply.avatar} roundedCircle width={25} height={25} className="me-2" />
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>{reply.name}</strong>
                                                                <span className="text-muted"> - {timeAgo(reply.createdAt)}</span>
                                                            </div>
                                                            <Dropdown show={activeDropdownId === reply.id} onToggle={() => toggleDropdown(reply.id)} className="ms-auto">
                                                                <Dropdown.Toggle as="button" className="post-dropdown-toggle">
                                                                    <FaEllipsisH />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="post-dropdown-menu">
                                                                    <Dropdown.Item onClick={() => handleEditComment(reply.id, reply.content)}>Edit</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleDeleteComment(reply.id)}>Delete</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>

                                                        {/* Hiển thị nội dung comment con */}
                                                        {editingCommentId === reply.id ? (
                                                            <div>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    value={editContent[reply.id] || ""} // Hiển thị đúng nội dung cho comment theo commentId
                                                                    onChange={(e) => setEditContent({ ...editContent, [reply.id]: e.target.value })} // Cập nhật nội dung chỉnh sửa theo commentId
                                                                    className="my-2"
                                                                />
                                                                <Button variant="primary" onClick={() => handleSaveEdit(reply.id)} className='save-comment'>Save</Button>
                                                                <Button variant="secondary" onClick={handleCancelEdit} className='cancel-comment'>Cancel</Button>
                                                            </div>
                                                        ) : (
                                                            <p className="mb-1">{reply.content}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Khung nhập phản hồi  */}
                                    {replyStatus[cmt.id] && (
                                        <div className='reply-box-container mt-2'>
                                            <textarea
                                                placeholder="Viết phản hồi của bạn..."
                                                className="form-control reply-textarea"
                                                value={replyContent[cmt.id] || ""}
                                                onChange={(e) => setReplyContent({ ...replyContent, [cmt.id]: e.target.value })}
                                            />
                                            <Button variant="primary" className="mt-1 reply-button" onClick={() => handleReplyComment(cmt.id)}>
                                                Gửi
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}

                    {hasMoreComments && (
                        <div className="d-flex justify-content-center py-3 see-more-comment">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="post-load-more-btn"
                                onClick={handleLoadMoreComments}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Loading...
                                    </>
                                ) : (
                                    'See more comments ...'
                                )}
                            </Button>
                        </div>
                    )}
                </ListGroup>

                <CommentInput
                    avatar={avatar}
                    commentContent={commentContent}
                    setCommentContent={setCommentContent}
                    handleAddComment={handleAddComment}
                />

            </Modal.Body>
        </Modal>
    );
};

export default PostModal;
