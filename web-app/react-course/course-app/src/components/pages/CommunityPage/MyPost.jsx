import { ToastContainer } from "react-toastify";
import SidebarCommunity from "./components/SidebarCommunity";
import PostList from "./components/PostList";
import { useCallback, useEffect, useState } from "react";
import { deletePost, getPostByUserLogin } from "../../../service/PostService";
import Swal from "sweetalert2";

const MyPost = () => {

    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [filterQuery, setFilterQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const fetchPostsCurrentLogin = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getPostByUserLogin(currentPage, filterQuery);
            if (data && data.result && Array.isArray(data.result.data)) {
                const newPosts = data.result.data;
                console.log("Page", currentPage);
                if (currentPage === 1) {
                    setPosts(newPosts);
                } else {
                    setPosts((prevPosts) => [
                        ...prevPosts,
                        ...newPosts.filter((post) => !prevPosts.some((p) => p.id === post.id))
                    ]);
                }
                setHasMore(currentPage < data.result.totalPages);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    }, [currentPage, filterQuery]);

    useEffect(() => {
        fetchPostsCurrentLogin();
    }, [fetchPostsCurrentLogin]);

    const handlesearchPost = () => {
        setIsSearching(true);
        setPosts([]);
        setCurrentPage(1);

        setTimeout(() => {
            fetchPostsCurrentLogin(1, filterQuery);
        }, 2000);
    };

    const handleDeletePost = (postId) => {
        Swal.fire({
            title: 'Are you sure ?',
            text: 'Do you want to delete this post ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete now',
            cancelButtonText: "No, cancel",
            width: "370px",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deletePost(postId);
                    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your post has been deleted.',
                        icon: 'success',
                        width: "370px",
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: error.message || 'Đã xảy ra lỗi trong quá trình mua khóa học. Vui lòng thử lại sau.',
                        icon: 'error'
                    });
                    console.error(error);
                }
            }
        })
    }

    return (
        <div className='content-page'>
            <div className="community-container d-flex">
                <SidebarCommunity
                    filterQuery={filterQuery}
                    setFilterQuery={setFilterQuery}
                    handlesearchPost={handlesearchPost}
                />

                <div className="main-content">
                    <PostList
                        posts={posts}
                        loading={loading}
                        isSearching={isSearching}
                        hasMore={hasMore}
                        setCurrentPage={setCurrentPage}
                        handleDeletePost={handleDeletePost}
                    />
                </div>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    style={{ top: '20%', right: '20px' }}
                />
            </div>
        </div>
    );
}

export default MyPost;