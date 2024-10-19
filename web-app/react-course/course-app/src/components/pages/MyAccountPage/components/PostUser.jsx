import { FaCameraRetro, FaSmile, FaVideo } from "react-icons/fa";

const PostUser = (props) => {
    const {
        posts,
        loading,
        handleDeletePost,
        avatar
    } = props;
    return (
        <div className="my-account-post-section">
            <div className="create-post">
                <textarea placeholder="Bạn đang nghĩ gì?"></textarea>
                <div className="post-options">
                    <button className="post-option">
                        <FaVideo className="video-icons" /> Video trực tiếp
                    </button>
                    <button className="post-option">
                        <FaCameraRetro className="video-images" /> Ảnh/video
                    </button>
                    <button className="post-option">
                        <FaSmile className="fasmile" /> Cảm xúc/hoạt động
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="my-account-post">
                        <div className="post-header">
                            <p>
                                <img
                                    src={post.avatar || avatar}
                                    alt="Avatar nhỏ"
                                    className="my-account-avatar-post"
                                />
                                <strong>{post.name}</strong> - {post.createdAt}{' '}
                                <i className="fa-solid fa-globe"></i>
                            </p>
                            <button className="delete-post-button"
                                onClick={() => handleDeletePost(post.id)}
                            >
                                <i className="fa-solid fa-trash"></i>

                            </button>
                        </div>
                        <p>{post.content}</p>
                        {post.image && (
                            <img
                                src={post.image}
                                alt="Bài đăng hình ảnh"
                                className="post-image"
                            />
                        )}
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
                ))
            )}
        </div>
    );
}

export default PostUser;