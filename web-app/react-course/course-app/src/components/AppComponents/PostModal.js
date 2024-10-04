import React, { useEffect, useState } from 'react';
import { Modal, Button, Image, ListGroup, Form } from 'react-bootstrap';
import { FaThumbsUp, FaReply, FaEllipsisH, FaSmile, FaCamera, FaPaperPlane, FaHeart, FaLaugh, FaSurprise, FaSadTear, FaAngry } from 'react-icons/fa';
import { MdGif } from 'react-icons/md';
import { BsFillImageFill } from 'react-icons/bs';
import { getCommentByPostId } from '../../service/CommentService';

const PostModal = ({ show, handleClose, post }) => {
    
    const token = localStorage.getItem('token');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const postId = post?.id;

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
                    setComments((prevComments) => [...updatedComments, ...prevComments]);
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

    return (
        <Modal show={show} onHide={handleClose} centered className="post-modal">
            <Modal.Body className="post-modal-body">
                {/* Hiển thị thông tin bài viết */}
                <div className="d-flex align-items-center mb-3">
                    <Image
                        src={post.avatar || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"}
                        roundedCircle
                        width={40}
                        height={40}
                        className="me-3 shadow-sm"
                    />
                    <div>
                        <strong>{post.author}</strong>
                        <p className="text-muted mb-0" style={{ fontSize: '0.85em' }}>{post.createdAt}</p>
                    </div>
                </div>

                {/* Hiển thị nội dung bài viết */}
                <p className="post-modal-content">{post.content}</p>
                {post.image && (
                    <div className="post-modal-image-container">
                        <img src={post.image} alt="Post" className="post-modal-image" />
                    </div>
                )}

                {/* Nút tương tác */}
                <div className="d-flex justify-content my-3">
                    <div className="like-post">
                        <FaThumbsUp className="icon" />
                        <span className="reaction-tooltip">Like</span>
                    </div>

                    <div className="favorite-post">
                        <FaHeart className="icon" />
                        <span className="reaction-tooltip">Love</span>
                    </div>

                    <div className="falaugh-post">
                        <FaLaugh className="icon" />
                        <span className="reaction-tooltip">Haha</span>
                    </div>

                    <div className="fasurprice-post">
                        <FaSurprise className="icon" />
                        <span className="reaction-tooltip">Wow</span>
                    </div>

                    <div className="sad-post">
                        <FaSadTear className="icon" />
                        <span className="reaction-tooltip">Sad</span>
                    </div>

                    <div className="angry-post">
                        <FaAngry className="icon" />
                        <span className="reaction-tooltip">Angry</span>
                    </div>
                </div>

                {/* Hiển thị danh sách bình luận */}
                <hr />
                {hasMoreComments && (
                    <div className="d-flex justify-content-center mt-2">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="post-load-more-btn"
                            onClick={handleLoadMoreComments}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span>Loading...</span>
                            ) : (
                                'See more comments ...'
                            )}
                        </Button>
                    </div>
                )}
                <ListGroup className="post-modal-comments">
                    {comments.map((cmt) => (
                        <ListGroup.Item key={cmt.id} className="post-comment-item shadow-sm">
                            <div className="d-flex align-items-start">
                                <Image
                                    src={cmt.avatar || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"}
                                    roundedCircle
                                    width={30}
                                    height={30}
                                    className="me-3 shadow-sm"
                                />
                                <div className="flex-grow-1">
                                    <div className="post-comment-header d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong className="post-comment-author">{cmt.name}</strong> <span className="text-muted">{cmt.createdAt}</span>
                                        </div>
                                        <FaEllipsisH className="text-secondary" />
                                    </div>
                                    <p className="mb-1">{cmt.content}</p>
                                    <div className="post-comment-actions d-flex align-items-center">
                                        <Button variant="link" size="sm" className="text-primary p-0 me-3">
                                            <FaThumbsUp /> {cmt.likes} Thích
                                        </Button>
                                        <Button variant="link" size="sm" className="text-primary p-0">
                                            <FaReply /> Phản hồi
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                {/* Nhập bình luận mới */}
                <div className="post-comment-input-container d-flex align-items-center mt-3 p-2 rounded shadow-sm">
                    <Image
                        src={post.avatar || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"}
                        roundedCircle
                        width={40}
                        height={30}
                        className="me-3 shadow-sm"
                    />
                    <Form.Control
                        type="text"
                        placeholder="Viết bình luận của bạn..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="shadow-sm flex-grow-1 me-2"
                    />
                    {/* Các biểu tượng cảm xúc và thêm hình ảnh */}
                    <div className="post-icon-container d-flex align-items-center">
                        <FaSmile size={20} className="post-icon me-2 text-warning" title="Thêm biểu tượng cảm xúc" />
                        <BsFillImageFill size={20} className="post-icon me-2 text-success" title="Thêm ảnh" />
                        <MdGif size={22} className="post-icon me-2 text-info" title="Thêm GIF" />
                        <FaCamera size={20} className="post-icon me-2 text-primary" title="Chụp ảnh" />
                    </div>

                    <Button variant="link" className="p-0 text-primary">
                        <FaPaperPlane size={24} />
                    </Button>

                </div>
            </Modal.Body>
        </Modal>
    );
};

export default PostModal;
