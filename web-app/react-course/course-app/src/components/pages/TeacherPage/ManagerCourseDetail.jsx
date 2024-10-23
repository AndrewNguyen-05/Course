import ModalCreateChapter from "./components/modal/ModalCreateChapter";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import SidebarManager from "./components/layouts/SidebarManager";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createChapter } from "../../../service/ChapterService";
import { toast, ToastContainer } from "react-toastify";
import { getInfoCourse } from "../../../service/CourseService";
import { createLesson } from "../../../service/LessonService";
import ModalCreateLesson from "./components/modal/ModalCreateLesson";

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
            } else {
                toast.error("Create Chapter Error");
            }
        } catch (error) {
            console.log(error);
            toast.error("Create Chapter Error");
        }
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

    if (isLoading) {
        return (<LoadingSpinner />);
    }

    if (httpError) {
        return <div>{httpError}</div>;
    }

    return (
        <div className="manager-course-container">
            <SidebarManager />
            <div className="manager-course-content">
                <div className="manager-courses-header">
                    <h2>Manage Courses</h2>
                    <button className="manager-courses-btn-create" onClick={handleOpenModal}>
                        <FaPlus /> New Chapter
                    </button>
                </div>

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
                        setVideo={setVideo}
                        loadingCreateLesson={loadingCreateLesson}
                    />
                )}

                <div className="manager-courses-chapter-list">
                    {Array.isArray(chapters) && chapters.map((chapter) => (
                        <div className="manager-courses-chapter" key={chapter.chapterId}>
                            <div className="manager-courses-chapter-header">
                                <h3>{chapter.chapterName}</h3>
                                <button
                                    className="manager-courses-btn-add-lesson"
                                    onClick={() => handleOpenModalLesson(chapter.chapterId)}
                                >
                                    <FaPlus /> Add Lesson
                                </button>
                            </div>
                            <ul className="manager-courses-lesson-list">
                                {Array.isArray(lessons) && lessons
                                    .filter(lesson => lesson.chapterId === chapter.chapterId)
                                    .map((lesson) => (
                                        <li className="manager-courses-lesson" key={lesson.lessonId}>
                                            <span>{lesson.lessonName}</span>
                                            <div className="manager-courses-lesson-actions">
                                                <button className="manager-courses-btn-edit">
                                                    <FaEdit /> Edit
                                                </button>
                                                <button className="manager-courses-btn-remove">
                                                    <FaTrashAlt /> Remove
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
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
    );
};

export default ManagerCourseDetail;
