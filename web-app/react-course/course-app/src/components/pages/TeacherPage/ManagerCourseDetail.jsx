import ModalCreateChapter from "./components/modal/ModalCreateChapter";
import { FaPlus, FaEdit, FaTrashAlt, FaChevronUp, FaChevronDown } from "react-icons/fa";
import SidebarManager from "./components/layouts/SidebarManager";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createChapter } from "../../../service/ChapterService";
import { toast, ToastContainer } from "react-toastify";
import { getInfoCourse } from "../../../service/CourseService";
import { createLesson, deleteLesson, updateLesson } from "../../../service/LessonService";
import ModalCreateLesson from "./components/modal/ModalCreateLesson";
import Swal from "sweetalert2";
import ModalUpdateLesson from "./components/modal/ModalUpdateLesson";
import StatisticsOverview from "./components/StatisticsOverview";
import SearchLesson from "./components/SearchLesson";
import ButtonNewChapter from "./components/BuutonNewChapter";
import { Footer } from "../../layouts/Footer";
import { TopBar } from "../../layouts/TopBar";
import { Header } from "../../layouts/Header";

const ManagerCourseDetail = () => {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalLessonOpen, setIsModalLessonOpen] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState("");
    const [chapterName, setChapterName] = useState('');
    const [descriptionChapter, setDescriptionChapter] = useState('');
    const [currentChapterId, setCurrentChapterId] = useState();
    const [lessonName, setLessonName] = useState('');
    const [descriptionLesson, setDescriptionLesson] = useState('');
    const [video, setVideo] = useState(null);
    const [loadingCreateLesson, setLoadingCreateLesson] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [currentLessonId, setCurrentLessonId] = useState(null);
    const [loadingUpdateLesson, setLoadingUpdateLesson] = useState(false);
    const [isVideoUpdated, setIsVideoUpdated] = useState(false);
    const [expandedChapters, setExpandedChapters] = useState([]); // Trạng thái cho các chapter đang mở rộng

    const toggleChapter = (chapterId) => {
        // Kiểm tra nếu chapter đang trong danh sách mở rộng thì xóa nó ra, ngược lại thì thêm vào
        setExpandedChapters(prevState =>
            prevState.includes(chapterId)
                ? prevState.filter(id => id !== chapterId)
                : [...prevState, chapterId]
        );
    };

    const handleVideoChange = (e) => {
        setVideo(e.target.files[0]);
        setIsVideoUpdated(true);
    };

    const handleUpdateLesson = async () => {
        setLoadingUpdateLesson(true);
        const formData = new FormData();
        const dataUpdateLesson = {
            courseId: id,
            chapterId: currentChapterId,
            lessonId: currentLessonId,
            lessonName: lessonName,
            description: descriptionLesson
        };

        formData.append("request", new Blob([JSON.stringify(dataUpdateLesson)], { type: "application/json" }));

        if (isVideoUpdated && video) {
            formData.append("video", video);
        }

        try {
            const result = await updateLesson(formData);
            if (result && result.code === 200) {
                toast.success("Lesson updated successfully");

                setLessons((prevLessons) =>
                    prevLessons.map((lesson) =>
                        lesson.lessonId === currentLessonId
                            ? {
                                ...lesson, lessonName: result.result.lessonName,
                                description: result.result.description,
                                videoUrl: result.result.videoUrl
                            }
                            : lesson
                    )
                );
                handleCloseUpdateLesson();
            } else {
                toast.error("Failed to update lesson");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while updating the lesson");
        } finally {
            setLoadingUpdateLesson(false);
        }

    }

    const handleCreateLesson = async () => {
        if (!currentChapterId) {
            toast.error("No chapter selected for this lesson.");
            return;
        }

        setLoadingCreateLesson(true);

        const formData = new FormData();
        const lessonData = {
            courseId: id,
            chapterId: currentChapterId,
            lessonName: lessonName,
            description: descriptionLesson
        };

        formData.append("request", new Blob([JSON.stringify(lessonData)], { type: "application/json" }));
        if (video) {
            formData.append("video", video);
        }

        try {
            const result = await createLesson(formData);
            if (result && result.code === 201) {
                toast.success("Lesson created successfully");
                setLessons((prevLessons) => [...prevLessons, result.result]);
                handleCloseModalLesson();
                setLessonName('');
                setDescriptionLesson('');
                setVideo(null);
                setCurrentChapterId(null);
            } else {
                toast.error("Error creating lesson");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error creating lesson");
        } finally {
            setLoadingCreateLesson(false);
        }
    };

    useEffect(() => {
        const fetchInfoCourse = async () => {
            try {
                const data = await getInfoCourse(id);
                const chapterData = data.result.chapters || [];
                setChapters(chapterData);

                if (chapterData.length > 0) {
                    const allLessons = chapterData.flatMap((chap) =>
                        (chap.lessonDto || []).map((lesson) => ({
                            ...lesson,
                            chapterId: chap.chapterId,
                        }))
                    );
                    setLessons(allLessons);
                }
            } catch (error) {
                setHttpError(error.message);
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInfoCourse();
    }, [id]);

    const handleCreateChapter = async () => {
        const chapterData = {
            courseId: id,
            chapterName: chapterName,
            description: descriptionChapter
        };
        try {
            const data = await createChapter(chapterData);
            if (data && data.code === 201) {
                toast.success("Create Chapter Successfully");
                handleCloseModal();
                setChapters((prevChapters) => [...prevChapters, data.result]);
                setChapterName('');
                setDescriptionChapter('');
            } else {
                toast.error("Create Chapter Error");
            }
        } catch (error) {
            console.log(error);
            toast.error("Create Chapter Error");
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this lesson? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            width: '360px',
            customClass: {
                popup: 'custom-swal-popup'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const data = await deleteLesson(lessonId);
                    if (data && data.code === 200) {
                        toast.success("Delete Lesson Successfully");
                        setLessons((prevLessons) =>
                            prevLessons.filter((lesson) => lesson.lessonId !== lessonId)
                        );
                    } else {
                        toast.error(data.message);
                    }
                } catch (error) {
                    console.log(error);
                    toast.error("Error deleting lesson");
                }
            }
        });
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModalLesson = (chapterId) => {
        setCurrentChapterId(chapterId);
        setIsModalLessonOpen(true);
    };

    const handleCloseModalLesson = () => {
        setIsModalLessonOpen(false);
        setCurrentChapterId(null);
    };

    const handleOpenUpdateLesson = (lessonId) => {
        const lesson = lessons.find((lesson) => lesson.lessonId === lessonId);
        if (lesson) {
            setCurrentLessonId(lessonId);
            setLessonName(lesson.lessonName);
            setDescriptionLesson(lesson.description);
            setVideo(lesson.videoUrl);
            setIsEditMode(true);
        }
    };

    const handleCloseUpdateLesson = () => {
        setCurrentLessonId(null);
        setIsEditMode(false);
        setIsVideoUpdated(false);

        setCurrentLessonId(null);
        setLessonName('');
        setDescriptionLesson('');
        setVideo(null);
    };

    if (isLoading) {
        return (<LoadingSpinner />);
    }

    if (httpError) {
        return <div>{httpError}</div>;
    }

    return (
        <div className="content-page-course-detail">
            <TopBar/>
            <Header/>
            <div className="manager-course-container content-page">
                <SidebarManager />
                <div className="manager-course-content">
                    {isModalOpen && (
                        <ModalCreateChapter
                            onClose={handleCloseModal}
                            handleCreateChapter={handleCreateChapter}
                            chapterName={chapterName}
                            setChapterName={setChapterName}
                            descriptionChapter={descriptionChapter}
                            setDescriptionChapter={setDescriptionChapter}
                        />
                    )}
                    {isModalLessonOpen && (
                        <ModalCreateLesson
                            isModalLessonOpen={isModalLessonOpen}
                            handleCloseModalLesson={handleCloseModalLesson}
                            handleCreateLesson={handleCreateLesson}
                            lessonName={lessonName}
                            setLessonName={setLessonName}
                            descriptionLesson={descriptionLesson}
                            setDescriptionLesson={setDescriptionLesson}
                            handleVideoChange={handleVideoChange}
                            setVideo={setVideo}
                            video={video}
                            loadingCreateLesson={loadingCreateLesson}
                        />
                    )}
                    {isEditMode && (
                        <ModalUpdateLesson
                            isEditMode={isEditMode}
                            handleCloseUpdateLesson={handleCloseUpdateLesson}
                            lessonName={lessonName}
                            setLessonName={setLessonName}
                            descriptionLesson={descriptionLesson}
                            setDescriptionLesson={setDescriptionLesson}
                            handleVideoChange={handleVideoChange}
                            loadingUpdateLesson={loadingUpdateLesson}
                            handleUpdateLesson={handleUpdateLesson}
                            video={video}
                        />
                    )}

                    <StatisticsOverview />
                    <SearchLesson />
                    <ButtonNewChapter handleOpenModal={handleOpenModal} />

                    <div className="manager-courses-chapter-list">
                        {Array.isArray(chapters) && chapters.map((chapter) => (
                            <div className="manager-courses-chapter" key={chapter.chapterId}>
                                <div className="manager-courses-chapter-header">
                                    <h3>{chapter.chapterName}</h3>
                                    <div>
                                        <button
                                            className="manager-courses-toggle-button"
                                            onClick={() => toggleChapter(chapter.chapterId)}
                                        >
                                            {expandedChapters.includes(chapter.chapterId) ? (
                                                <FaChevronUp />
                                            ) : (
                                                <FaChevronDown />
                                            )}
                                        </button>
                                        <button
                                            className="manager-courses-btn-add-lesson"
                                            onClick={() => handleOpenModalLesson(chapter.chapterId)}
                                        >
                                            <FaPlus /> Add Lesson
                                        </button>
                                    </div>
                                </div>
                                {/* Kiểm tra trạng thái mở rộng để hiển thị danh sách bài học */}
                                {expandedChapters.includes(chapter.chapterId) && (
                                    <ul className="manager-courses-lesson-list">
                                        {Array.isArray(lessons) && lessons
                                            .filter(lesson => lesson.chapterId === chapter.chapterId)
                                            .map((lesson) => (
                                                <li className="manager-courses-lesson" key={lesson.lessonId}>
                                                    <span>{lesson.lessonName}</span>
                                                    <div className="manager-courses-lesson-actions">
                                                        <button className="manager-courses-btn-edit"
                                                            onClick={() => handleOpenUpdateLesson(lesson.lessonId)}
                                                        >
                                                            <FaEdit /> Edit
                                                        </button>
                                                        <button className="manager-courses-btn-remove"
                                                            onClick={() => handleDeleteLesson(lesson.lessonId)}
                                                        >
                                                            <FaTrashAlt /> Remove
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
            <Footer/>
        </div>
    );
};

export default ManagerCourseDetail;
