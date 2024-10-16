import instructor1Image from "./../../../../img/duc.jpg";
import instructor2Image from "./../../../../img/duc1.jpg";
import instructor3Image from "./../../../../img/vu.jpg";
import instructor4Image from "./../../../../img/nam.jpg";

export const InstructorsSection = () => {
  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div className="section-title text-center position-relative mb-5">
          <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">
            Instructors
          </h6>
          <h1 className="display-4">Meet Our Instructors</h1>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="team-item">
              <img
                className="img-fluid w-100"
                src={instructor1Image}
                alt="Instructor 1"
              />
              <div className="bg-light text-center p-4">
                <h5 className="mb-3">Instructor Name</h5>
                <p className="mb-2">Web Design & Development</p>
                <div className="d-flex justify-content-center">
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="team-item">
              <img
                className="img-fluid w-100"
                src={instructor2Image}
                alt="Instructor 2"
              />
              <div className="bg-light text-center p-4">
                <h5 className="mb-3">Instructor Name</h5>
                <p className="mb-2">Web Design & Development</p>
                <div className="d-flex justify-content-center">
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="team-item">
              <img
                className="img-fluid w-100"
                src={instructor3Image}
                alt="Instructor 3"
              />
              <div className="bg-light text-center p-4">
                <h5 className="mb-3">Instructor Name</h5>
                <p className="mb-2">Web Design & Development</p>
                <div className="d-flex justify-content-center">
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="team-item">
              <img
                className="img-fluid w-100"
                src={instructor4Image}
                alt="Instructor 4"
              />
              <div className="bg-light text-center p-4">
                <h5 className="mb-3">Instructor Name</h5>
                <p className="mb-2">Web Design & Development</p>
                <div className="d-flex justify-content-center">
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a className="mx-1 p-1" href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
