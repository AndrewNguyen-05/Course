import { Spinner } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import { Link } from "react-router-dom";

export const ViewFavorite = (props) => {
  const { loading, favorites, handleDeleteFavorite } = props;
  return (
    <div className="row">
      {loading ? (
        <div className="col-12 text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : favorites && favorites.length > 0 ? (
        favorites.map((favorite) => (
          <div className="col-lg-4 col-md-6 pb-4" key={favorite.favoriteId}>
            <div className="courses-list-item">
              <Link to={`/course-detail/${favorite.courseId}`}>
                <img
                  className="img-fluid"
                  src={favorite.thumbnail || "default-thumbnail.jpg"}
                  alt="Course Thumbnail"
                />
              </Link>
              <div className="courses-info">
                <div className="courses-author">
                  <span>
                    <i className="fa fa-user mr-2"></i>
                    {favorite.author || "Unknown Author"}
                  </span>
                </div>
                <div className="courses-title">
                  {favorite.title || "No Title Available"}
                </div>
                <div className="course-meta">
                  <span>
                    <i className="fa fa-star mr-2"></i>4.5 (250)
                  </span>
                </div>

                <div className="course-price mt-2">
                  <strong>Price: </strong>
                  <span className="course-price-value">
                    {favorite.points}{" "}
                    <i className="fa-solid fa-coins coins-course-favorite"></i>
                  </span>
                </div>

                <div className="d-flex justify-content-between mt-3">
                  <Link
                    to={`/course-detail/${favorite.courseId}`}
                    className="btn btn-outline-primary"
                  >
                    <MdOutlineDescription className="mr-2" />
                        Detail
                  </Link>

                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDeleteFavorite(favorite.favoriteId)}
                  >
                    <FaTrashAlt className="mr-2" />
                        Remove
                  </button>

                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12">
          <p>No favorite courses available.</p>
        </div>
      )}
    </div>
  );
};
