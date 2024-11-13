import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { getAllCourses } from "../../../service/CourseService";
import { addFavorite } from "../../../service/FavoriteService";
import { InfoContact } from "../ContactPage/components/InfoContact";
import { motion } from "framer-motion";
import { getAdsActive } from "../../../service/AdsService";
import { EducationHighlights } from "./components/EducationHighlights";
import { IntroSection } from "./components/IntroSection";
import { OurCourses } from "./components/OurCourses";
import { InstructorsSection } from "./components/InstructorsSection";
import { FeedbackSection } from "./components/FeedbackSection";
import { ContactSection } from "./components/ContactSection";
import { PromoModal } from "../AdsPage/components/PromoModal";
import LoadingSpinner from "../../../utils/LoadingSpinner";

export const HomePage = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // State để hiển thị loading
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [hasMore, setHasMore] = useState(true); // Trạng thái có còn dữ liệu không
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAdsActive = async () => {
      try {
        const response = await getAdsActive();
        if (response.data.result && Array.isArray(response.data.result)) {
          setAds(response.data.result);
        } else {
          setAds([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAdsActive();
  }, []);

  const handleCloseModal = () => {
    setShowPromoModal(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPromoModal(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = "HomePage";
    const fetchCourses = async () => {
      try {
        const result = await getAllCourses(currentPage, pageSize);
        const { data, totalPages } = result.result;

        if (currentPage === 1) {
          setCourses(data);
        } else {
          setCourses((prevCourses) => {
            const newCourses = data.filter(
              (course) => !prevCourses.some((prev) => prev.id === course.id)
            );
            return [...prevCourses, ...newCourses];
          });
        }

        if (currentPage >= totalPages) {
          setHasMore(false);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, pageSize]); // useEffect chạy lại mỗi khi currentPage hoặc pageSize thay đổi

  const handleAddToFavorites = (courseId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    addFavorite(courseId)
      .then((response) => {
        // Kiểm tra nếu response chứa mã phản hồi là 201 hoặc thông báo thành công
        if (response && response.data.code === 201) {
          toast.success("Course added to favorites successfully!");
          return;
        } else {
          toast.error(response.data.message);
          throw new Error("Failed to add to favorites");
        }
      })
      .catch((error) => {
        console.error("Error adding to favorites:", error);
      });
  };

  const loadMoreCourses = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <LoadingSpinner />
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="content-page"
    >
      {showPromoModal && <PromoModal onClose={handleCloseModal} ads={ads} />}
      <EducationHighlights />
      <IntroSection />
      <OurCourses
        courses={courses}
        hasMore={hasMore}
        loadMoreCourses={loadMoreCourses}
        handleAddToFavorites={handleAddToFavorites}
      />
      <InstructorsSection />
      <FeedbackSection />

      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <InfoContact />
            <ContactSection />
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="add-favorite-toast"
      />
    </motion.div>
  );
};
