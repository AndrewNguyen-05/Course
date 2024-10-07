import React, { useEffect, useState } from 'react';
import { Modal, Button, Image, ListGroup, Form, Spinner, Dropdown } from 'react-bootstrap';
import { FaThumbsUp, FaReply, FaEllipsisH } from 'react-icons/fa';
import { toast } from 'react-toastify';
import moment from 'moment';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostFooter } from './PostFooter';
import CommentDropdown from './CommentDropdown';
import { CommentInput } from './CommentInput';
import { addComment, getCommentByPostId, replyComment } from '../../../service/CommentService';
import { getAvatar } from '../../../service/ProfileService';

const PostModal = ({ show, handleClose, post }) => {
    const postId = post?.id;
    const token = localStorage.getItem('token');
    const [avatar, setAvatar] = useState('https://bootdey.com/img/Content/avatar/avatar7.png')
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [replyStatus, setReplyStatus] = useState({});
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [replyContent, setReplyContent] = useState({});

    const timeAgo = (createdAt) => {
        return moment(createdAt).fromNow();
    }

    // Fetch Avatar User Current Login
    useEffect(() => {
        if (!token) return;
        getAvatar(token)
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
                const data = await getCommentByPostId(token, postId, currentPage);
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
            const result = await addComment(token, commentData);
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
            const result = await replyComment(token, replyData);
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



    // Edit Comment
    const handleEditComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditContent(content);
    };

    // Save edit comment
    const handleSaveEdit = (commentId) => {
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment.id === commentId ? { ...comment, content: editContent } : comment
            )
        );
        setEditingCommentId(null);
        setEditContent('');
        toast.success("Comment updated successfully!");
    };


    // Delete Comment
    const handleDeleteComment = (commentId) => {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        toast.success("Comment deleted successfully!");
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
                                    src={cmt.avatar || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"}
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
                                        <CommentDropdown
                                            commentId={cmt.id}
                                            handleEdit={handleEditComment}
                                            handleDelete={handleDeleteComment}
                                            activeDropdownId={activeDropdownId}
                                            toggleDropdown={toggleDropdown}
                                            commentContent={cmt.content}
                                        />
                                    </div>

                                    {/* Hiển thị phần nội dung comment cha */}
                                    {editingCommentId === cmt.id ? (
                                        <div>
                                            <Form.Control
                                                as="textarea"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
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
                                                            {/* Dropdown cho reply */}
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
                                                                    value={editContent}
                                                                    onChange={(e) => setEditContent(e.target.value)}
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