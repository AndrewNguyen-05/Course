import { Col, Container, Row, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaRegFrown } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "./PostCard";
import { ClipLoader } from "react-spinners";

const PostList = (props) => {
    const { 
        posts, 
        loading, 
        isSearching, 
        hasMore, 
        setCurrentPage,
        handleDeletePost
    } = props;

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={8}>

                    {isSearching && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="d-flex justify-content-center align-items-center my-5"
                        >
                            <ClipLoader color={"#007bff"} size={50} />
                            <span className="ms-3">Searching for posts...</span>
                        </motion.div>
                    )}

                    {!loading && posts.length === 0 && !isSearching ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center my-4"
                        >
                            <FaRegFrown size={100} color="#ccc" className="my-3" />
                            <p>No results were found matching your keyword.</p>
                        </motion.div>
                    ) : (
                        <InfiniteScroll
                            dataLength={posts.length}
                            next={() => setCurrentPage((prevPage) => prevPage + 1)}
                            hasMore={hasMore}
                            loader={
                                !isSearching && (
                                    <div className="text-center my-3">
                                        <Spinner animation="border" />
                                        <p>Loading more articles...</p>
                                    </div>
                                )
                            }
                            endMessage={<p className="text-center text-secondary">There are no more posts to display!</p>}
                        >
                            {posts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    className="post-container mb-1 p-2 rounded"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <PostCard
                                        id={post.id}
                                        author={post.name}
                                        content={post.content}
                                        avatar={post.avatar}
                                        image={post.image}
                                        likes={post.likes}
                                        comments={post.comments}
                                        owner={post.owner}
                                        createdAt={post.createdAt}
                                        handleDeletePost={handleDeletePost}
                                    />
                                </motion.div>
                            ))}
                        </InfiniteScroll>

                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default PostList;