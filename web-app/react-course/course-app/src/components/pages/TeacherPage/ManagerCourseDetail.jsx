import { useEffect, useState } from "react";
import ModalCreateChapter from "./components/modal/ModalCreateChapter";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import SidebarManager from "./components/layouts/SidebarManager";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import { getInfoCourse } from "../../../service/CourseService";
import { useParams } from "react-router-dom";

const ManagerCourseDetail = () => {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState('');

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchInfoCourse = async () => {
            try {
                const data = await getInfoCourse(id);
                const chapterData = data.result.chapters || [];
                setChapters(chapterData);

                if (chapterData.length > 0) {
                    const allLessons = chapterData.flatMap(chap => 
                        (chap.lessonDto || []).map(lesson => ({
                            ...lesson,
                            chapterId: chap.chapterId
                        }))
                    );
                    setLessons(allLessons);
                }
                setIsLoading(false);
            } catch (error) {
                setHttpError(error.message);
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchInfoCourse();
    }, [id]);

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

                {isModalOpen && <ModalCreateChapter onClose={handleCloseModal} />}

                <div className="manager-courses-chapter-list">
                    {Array.isArray(chapters) && chapters.map((chapter) => (
                        <div className="manager-courses-chapter" key={chapter.chapterId}>
                            <div className="manager-courses-chapter-header">
                                <h3>{chapter.chapterName}</h3>
                                <button className="manager-courses-btn-add-lesson">
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
        </div>
    );
};

export default ManagerCourseDetail;
