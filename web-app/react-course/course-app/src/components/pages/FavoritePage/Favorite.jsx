import React, { useEffect, useState } from "react";
import { getFavorite, removeFavorite } from "../../../service/FavoriteService";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";
import { ViewFavorite } from "./components/ViewFavorite";
import LoadingSpinner from "../../../utils/LoadingSpinner";

const FavoriteCourses = () => {
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Favorite";
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getFavorite(currentPage);
        if (data.result && Array.isArray(data.result.data)) {
          setFavorites(data.result.data);
          setTotalPages(data.result.totalPages || 1);
        } else {
          setFavorites([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Error fetching favorite courses:", error);
        setFavorites([]);
        setTotalPages(0);
        setError("Failed to load favorite courses");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, currentPage]);

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      await removeFavorite(favoriteId);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.favoriteId !== favoriteId)
      );
      toast.success("Deleted favorite successfully");
    } catch (error) {
      console.error("Error deleting favorite:", error);
      toast.error("Failed to delete favorite");
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  if(loading){
    <LoadingSpinner />
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <motion.div
      key={currentPage}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="content-page"
    >
      <div className="container">
        <h2 className="vip-title">Your Favorite Courses</h2>
        <br />

        <ViewFavorite
          loading={loading}
          favorites={favorites}
          handleDeleteFavorite={handleDeleteFavorite}
        />

        <ReactPaginate
          previousLabel={"«"}
          nextLabel={"»"}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          forcePage={currentPage - 1}
          containerClassName={"pagination pagination-lg justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="custom-toast-container"
      />
    </motion.div>
  );
};

export default FavoriteCourses;
