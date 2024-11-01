import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { ReviewLesson } from './components/ReviewLesson';
import { addCommentLesson, getCommentLesson } from '../../../service/LessonComment';
import { getAvatar } from '../../../service/ProfileService';
import { getInfoCourse } from '../../../service/CourseService';
import ProgressBar from './components/ProgressBar';
import { FaChevronDown } from 'react-icons/fa';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import { checkPurchase } from '../../../service/Enrollment';
import { getCompletionPercentage } from '../../../service/LessonProgress';

export const LearningPage = () => {
    useEffect(() => {
        document.title = 'Learning';
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [commentLesson, setCommentLesson] = useState([]);
    const [newCommentLesson, setNewCommentLesson] = useState('');
    const [replyContent, setReplyContent] = useState({});
    const [activeReply, setActiveReply] = useState(null);
    const [avatar, setAvatar] = useState();

    const [completionData, setCompletionData] = useState({
        totalLessonComplete: 0,
        totalLessons: 0,
        completionPercentage: 0,
    });

    useEffect(() => {
        const calculateCompletion = async () => {
            try {
                const data = await getCompletionPercentage(id);
                setCompletionData({
                    totalLessonComplete: data.result.totalLessonComplete,
                    totalLessons: data.result.totalLessons,
                    completionPercentage: data.result.completionPercentage
                });
            } catch (error) {
                console.log(error);
            }
        }
        calculateCompletion();
    }, [id])

    useEffect(() => {
        const fetchPurchaseStatus = async () => {
            try {
                const result = await checkPurchase(id);
                if (result && result.result) {
                    if (!result.result.purchased) {
                        navigate('/home');
                    }
                }
            } catch (error) {
                console.error("Error checking purchase status:", error);
                navigate('/home');
            }
        };

        if (id) {
            fetchPurchaseStatus();
        }
    }, [id, navigate]);

    useEffect(() => {
        const fetchLessonByCourseId = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const data = await getInfoCourse(id);
                setCourseTitle(data.result.courseTitle);
                const chaptersData = data.result.chapters || [];
                setChapters(chaptersData);

                if (chaptersData.length > 0) {
                    const firstLesson = chaptersData[0].lessonDto && chaptersData[0].lessonDto[0];
                    if (firstLesson) {
                        setCurrentLesson(firstLesson);

                        setCurrentChapter({
                            chapterId: chaptersData[0].chapterId
                        });
                        fetchCommentLesson(firstLesson.lessonId);
                    }
                }

                setLoading(false);
            } catch (error) {
                setHttpError(error.message)
                toast.error('Unable to load course data');
            } finally {
                setLoading(false);
            }
        };

        fetchLessonByCourseId();
    }, [id, token]);

    useEffect(() => {
        if (!token) {
            return;
        }
        getAvatar()
            .then(data => setAvatar(data.result))
            .catch(error => {
                console.log(error)
                setHttpError(error.message);
            });
    }, [token])

    const fetchCommentLesson = async (lessonId) => {
        if (!lessonId) return;
        try {
            const response = await getCommentLesson(lessonId);
            if (response.result) {
                setCommentLesson(response.result || []);
            } else {
                toast.error('Error getting comment list');
            }
        } catch (error) {
            setHttpError(error.message);
            toast.error('Error getting comment list');
        }
    };

    const handleAddCommentLesson = async () => {
        if (!newCommentLesson.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        if (!currentLesson) {
            toast.error('No lesson selected');
            return;
        }

        const commentData = {
            courseId: id,
            chapterId: currentChapter.chapterId,
            lessonId: currentLesson.lessonId,
            content: newCommentLesson,
            parentReviewId: null
        };

        try {
            const response = await addCommentLesson(commentData);

            if (response && response.result) {
                setCommentLesson(prevComments => [
                    {
                        ...response.result,
                        replies: []
                    },
                    ...prevComments
                ])
                toast.success('Add comment successfully')
                setNewCommentLesson('');
            } else {
                console.error('Failed response:', response);
                toast.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
    };

    const handleReplySubmit = async (commentId) => {
        if (!replyContent[commentId]?.trim()) return;

        const commentReply = {
            courseId: id,
            chapterId: currentChapter.chapterId,
            lessonId: currentLesson.lessonId,
            content: replyContent[commentId],
            parentReviewId: commentId
        }
        try {
            const response = await addCommentLesson(commentReply);
            if (response && response.result) {
                setCommentLesson(prevComments => prevComments.map(comment => {
                    if (comment.reviewId === commentId) {
                        return {
                            ...comment,
                            replies: [...comment.replies, response.result]
                        }
                    }
                    return comment;
                }))

                toast.success('Reply added successfully');
                setReplyContent(prev => ({ ...prev, [commentId]: '' })); // Reset nội dung trả lời
                setActiveReply(null);
            } else {
                toast.error('Failed to add reply');
            }
        } catch (error) {
            toast.error('Error adding reply');
        }

    };

    useEffect(() => {
        if (currentLesson && currentLesson.lessonId) {
            fetchCommentLesson(currentLesson.lessonId);
        }
    }, [currentLesson]);


    const handleReplyChange = (id, value) => {
        setReplyContent(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const toggleSection = (sectionId) => {
        setOpenSections(prevState => ({
            ...prevState,
            [sectionId]: !prevState[sectionId]
        }));
    };

    const handleLessonClick = (lesson, chapterId) => {
        if (lesson.videoUrl) {
            setCurrentLesson(lesson);

            setCurrentChapter({
                chapterId: chapterId
            });
            fetchCommentLesson(lesson.lessonId);
        }
    };

    const handleNewCommentChange = (e) => {
        setNewCommentLesson(e.target.value);
    }

    const toggleReplyInput = (id) => {
        setActiveReply(activeReply === id ? null : id);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (httpError) {
        return (
            <div>
                {httpError}
            </div>
        )
    }

    return (
        <div>
            <ProgressBar courseTitle={courseTitle} completionData={completionData} />
            <div className="lp-learning-container d-flex">
                <div className="lp-lesson-list">
                    {chapters.map((chapter) => (
                        <div key={chapter.chapterId} className="lesson-section">
                            <div
                                className="sections-title"
                                onClick={() => toggleSection(chapter.chapterId)}
                            >
                                <h4>{chapter.chapterName}</h4>
                                <FaChevronDown
                                    className={`arrow-icon ${openSections[chapter.chapterId] ? 'open' : ''}`}
                                />
                            </div>
                            {openSections[chapter.chapterId] && chapter.lessonDto && (
                                <ul className="lesson-list">
                                    {chapter.lessonDto.map((lesson) => (
                                        <li
                                            key={lesson.lessonId}
                                            className="lesson-item"
                                            onClick={() => handleLessonClick(lesson, chapter.chapterId)}
                                        >
                                            {lesson.lessonName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                <div className="lp-video-content">
                    {currentLesson ? (
                        <div>
                            <video
                                key={currentLesson.videoUrl}
                                width="100%"
                                height={750}
                                controls
                            >
                                <source src={currentLesson.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <h3 className='title-lesson-current'>{currentLesson.lessonName}</h3>

                            <ReviewLesson
                                comments={commentLesson}
                                handleAddCommentLesson={handleAddCommentLesson}
                                newCommentLesson={newCommentLesson}
                                handleReplyChange={handleReplyChange}
                                handleReplySubmit={handleReplySubmit}
                                replyContent={replyContent}
                                handleNewCommentChange={handleNewCommentChange}
                                toggleReplyInput={toggleReplyInput}
                                activeReply={activeReply}
                                avatar={avatar}
                            />
                        </div>
                    ) : (
                        <p>Chọn một bài học để xem nội dung</p>
                    )}
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