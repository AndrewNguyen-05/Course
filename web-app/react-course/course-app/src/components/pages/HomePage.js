import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import các hình ảnh
import aboutImage from './../../img/about.jpg';
import featureImage from './../../img/feature.jpg';
import course1Image from './../../img/courses-1.jpg';
import course2Image from './../../img/courses-2.jpg';
import course3Image from './../../img/courses-3.jpg';
import course4Image from './../../img/courses-4.jpg';
import course5Image from './../../img/courses-5.jpg';
import instructor1Image from './../../img/team-1.jpg';
import instructor2Image from './../../img/team-2.jpg';
import instructor3Image from './../../img/team-3.jpg';
import instructor4Image from './../../img/team-4.jpg';
import testimonial1Image from './../../img/testimonial-1.jpg';
import testimonial2Image from './../../img/testimonial-2.jpg';

export const HomePage = () => {

    const [selectedCourse, setSelectedCourse] = useState('');

    const handleChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    return (
        <div>
            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-5 mb-5 mb-lg-0" style={{ minHeight: '500px' }}>
                            <div className="position-relative h-100">
                                <img className="position-absolute w-100 h-100" src={aboutImage} style={{ objectFit: 'cover' }} alt="About Us" />
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="section-title position-relative mb-4">
                                <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">About Us</h6>
                                <h1 className="display-4">First Choice For Online Education Anywhere</h1>
                            </div>
                            <p>Tempor erat elitr at rebum at at clita aliquyam consetetur. Diam dolor diam ipsum et, tempor voluptua sit consetetur sit. Aliquyam diam amet diam et eos sadipscing labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor consetetur takimata eirmod, dolores takimata consetetur invidunt magna dolores aliquyam dolores dolore. Amet erat amet et magna</p>
                            <div className="row pt-3 mx-0">
                                <div className="col-3 px-0">
                                    <div className="bg-success text-center p-4">
                                        <h1 className="text-white">123</h1>
                                        <h6 className="text-uppercase text-white">Available<span className="d-block">Subjects</span></h6>
                                    </div>
                                </div>
                                <div className="col-3 px-0">
                                    <div className="bg-primary text-center p-4">
                                        <h1 className="text-white">1234</h1>
                                        <h6 className="text-uppercase text-white">Online<span className="d-block">Courses</span></h6>
                                    </div>
                                </div>
                                <div className="col-3 px-0">
                                    <div className="bg-secondary text-center p-4">
                                        <h1 className="text-white">123</h1>
                                        <h6 className="text-uppercase text-white">Skilled<span className="d-block">Instructors</span></h6>
                                    </div>
                                </div>
                                <div className="col-3 px-0">
                                    <div className="bg-warning text-center p-4">
                                        <h1 className="text-white">1234</h1>
                                        <h6 className="text-uppercase text-white">Happy<span className="d-block">Students</span></h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid bg-image" style={{ margin: '90px 0' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 my-5 pt-5 pb-lg-5">
                            <div className="section-title position-relative mb-4">
                                <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Why Choose Us?</h6>
                                <h1 className="display-4">Why You Should Start Learning with Us?</h1>
                            </div>
                            <p className="mb-4 pb-2">Aliquyam accusam clita nonumy ipsum sit sea clita ipsum clita, ipsum dolores amet voluptua duo dolores et sit ipsum rebum, sadipscing et erat eirmod diam kasd labore clita est. Diam sanctus gubergren sit rebum clita amet.</p>
                            <div className="d-flex mb-3">
                                <div className="btn-icon bg-primary mr-4">
                                    <i className="fa fa-2x fa-graduation-cap text-white"></i>
                                </div>
                                <div className="mt-n1">
                                    <h4>Skilled Instructors</h4>
                                    <p>Labore rebum duo est Sit dolore eos sit tempor eos stet, vero vero clita magna kasd no nonumy et eos dolor magna ipsum.</p>
                                </div>
                            </div>
                            <div className="d-flex mb-3">
                                <div className="btn-icon bg-secondary mr-4">
                                    <i className="fa fa-2x fa-certificate text-white"></i>
                                </div>
                                <div className="mt-n1">
                                    <h4>International Certificate</h4>
                                    <p>Labore rebum duo est Sit dolore eos sit tempor eos stet, vero vero clita magna kasd no nonumy et eos dolor magna ipsum.</p>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="btn-icon bg-warning mr-4">
                                    <i className="fa fa-2x fa-book-reader text-white"></i>
                                </div>
                                <div className="mt-n1">
                                    <h4>Online Classes</h4>
                                    <p className="m-0">Labore rebum duo est Sit dolore eos sit tempor eos stet, vero vero clita magna kasd no nonumy et eos dolor magna ipsum.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5" style={{ minHeight: '500px' }}>
                            <div className="position-relative h-100">
                                <img className="position-absolute w-100 h-100" src={featureImage} style={{ objectFit: 'cover' }} alt="Features" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid px-0 py-5">
                <div className="row mx-0 justify-content-center pt-5">
                    <div className="col-lg-6">
                        <div className="section-title text-center position-relative mb-4">
                            <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Our Courses</h6>
                            <h1 className="display-4">Checkout New Releases Of Our Courses</h1>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="courses-item position-relative">
                            <img className="img-fluid" src={course1Image} alt="Course 1" />
                            <div className="courses-text">
                                <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                <div className="border-top w-100 mt-3">
                                    <div className="d-flex justify-content-between p-4">
                                        <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                        <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                    </div>
                                </div>
                                <div className="w-100 bg-white text-center p-4">
                                    <Link className="btn btn-primary" to="/course-detail">Course Detail</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="courses-item position-relative">
                            <img className="img-fluid" src={course2Image} alt="Course 2" />
                            <div className="courses-text">
                                <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                <div className="border-top w-100 mt-3">
                                    <div className="d-flex justify-content-between p-4">
                                        <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                        <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                    </div>
                                </div>
                                <div className="w-100 bg-white text-center p-4">
                                    <Link className="btn btn-primary" to="/course-detail">Course Detail</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="courses-item position-relative">
                            <img className="img-fluid" src={course3Image} alt="Course 3" />
                            <div className="courses-text">
                                <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                <div className="border-top w-100 mt-3">
                                    <div className="d-flex justify-content-between p-4">
                                        <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                        <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                    </div>
                                </div>
                                <div className="w-100 bg-white text-center p-4">
                                    <Link className="btn btn-primary" to="/course-detail">Course Detail</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="courses-item position-relative">
                            <img className="img-fluid" src={course4Image} alt="Course 4" />
                            <div className="courses-text">
                                <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                <div className="border-top w-100 mt-3">
                                    <div className="d-flex justify-content-between p-4">
                                        <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                        <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                    </div>
                                </div>
                                <div className="w-100 bg-white text-center p-4">
                                    <Link className="btn btn-primary" to="/course-detail">Course Detail</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center bg-image mx-0 mb-5">
                    <div className="col-lg-6 py-5">
                        <div className="bg-white p-5 my-5">
                            <h1 className="text-center mb-4">30% Off For New Students</h1>
                            <form>
                                <div className="form-row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <input type="text" className="form-control bg-light border-0" placeholder="Your Name" style={{ padding: '30px 20px' }} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <input type="email" className="form-control bg-light border-0" placeholder="Your Email" style={{ padding: '30px 20px' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <select
                                                className="custom-select bg-light border-0 px-3"
                                                style={{ height: '60px' }}
                                                value={selectedCourse}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>Select A course</option>
                                                <option value="1">Course 1</option>
                                                <option value="2">Course 2</option>
                                                <option value="3">Course 3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <button className="btn btn-primary btn-block" type="submit" style={{ height: '60px' }}>
                                            Sign Up Now
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="section-title text-center position-relative mb-5">
                        <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Instructors</h6>
                        <h1 className="display-4">Meet Our Instructors</h1>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-item">
                                <img className="img-fluid w-100" src={instructor1Image} alt="Instructor 1" />
                                <div className="bg-light text-center p-4">
                                    <h5 className="mb-3">Instructor Name</h5>
                                    <p className="mb-2">Web Design & Development</p>
                                    <div className="d-flex justify-content-center">
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-twitter"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-linkedin-in"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-instagram"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-youtube"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-item">
                                <img className="img-fluid w-100" src={instructor2Image} alt="Instructor 2" />
                                <div className="bg-light text-center p-4">
                                    <h5 className="mb-3">Instructor Name</h5>
                                    <p className="mb-2">Web Design & Development</p>
                                    <div className="d-flex justify-content-center">
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-twitter"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-linkedin-in"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-instagram"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-youtube"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-item">
                                <img className="img-fluid w-100" src={instructor3Image} alt="Instructor 3" />
                                <div className="bg-light text-center p-4">
                                    <h5 className="mb-3">Instructor Name</h5>
                                    <p className="mb-2">Web Design & Development</p>
                                    <div className="d-flex justify-content-center">
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-twitter"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-linkedin-in"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-instagram"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-youtube"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-item">
                                <img className="img-fluid w-100" src={instructor4Image} alt="Instructor 4" />
                                <div className="bg-light text-center p-4">
                                    <h5 className="mb-3">Instructor Name</h5>
                                    <p className="mb-2">Web Design & Development</p>
                                    <div className="d-flex justify-content-center">
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-twitter"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-linkedin-in"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-instagram"></i></a>
                                        <a className="mx-1 p-1" href="#"><i className="fab fa-youtube"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid bg-image py-5" style={{ margin: '90px 0' }}>
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-5 mb-5 mb-lg-0">
                            <div className="section-title position-relative mb-4">
                                <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Testimonial</h6>
                                <h1 className="display-4">What Say Our Students</h1>
                            </div>
                            <p className="m-0">Dolor est dolores et nonumy sit labore dolores est sed rebum amet, justo duo ipsum sanctus dolore magna rebum sit et. Diam lorem ea sea at. Nonumy et at at sed justo est nonumy tempor. Vero sea ea eirmod, elitr ea amet diam ipsum at amet. Erat sed stet eos ipsum diam</p>
                        </div>
                        <div className="col-lg-7">
                            <div className="owl-carousel testimonial-carousel">
                                <div className="bg-white p-5">
                                    <i className="fa fa-3x fa-quote-left text-primary mb-4"></i>
                                    <p>Sed et elitr ipsum labore dolor diam, ipsum duo vero sed sit est est ipsum eos clita est ipsum. Est nonumy tempor at kasd. Sed at dolor duo ut dolor, et justo erat dolor magna sed stet amet elitr duo lorem</p>
                                    <div className="d-flex flex-shrink-0 align-items-center mt-4">
                                        <img className="img-fluid mr-4" src={testimonial1Image} alt="Student 1" />
                                        <div>
                                            <h5>Student Name</h5>
                                            <span>Web Design</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-5">
                                    <i className="fa fa-3x fa-quote-left text-primary mb-4"></i>
                                    <p>Sed et elitr ipsum labore dolor diam, ipsum duo vero sed sit est est ipsum eos clita est ipsum. Est nonumy tempor at kasd. Sed at dolor duo ut dolor, et justo erat dolor magna sed stet amet elitr duo lorem</p>
                                    <div className="d-flex flex-shrink-0 align-items-center mt-4">
                                        <img className="img-fluid mr-4" src={testimonial2Image} alt="Student 2" />
                                        <div>
                                            <h5>Student Name</h5>
                                            <span>Web Design</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-5 mb-5 mb-lg-0">
                            <div className="bg-light d-flex flex-column justify-content-center px-5" style={{ height: '450px' }}>
                                <div className="d-flex align-items-center mb-5">
                                    <div className="btn-icon bg-primary mr-4">
                                        <i className="fa fa-2x fa-map-marker-alt text-white"></i>
                                    </div>
                                    <div className="mt-n1">
                                        <h4>Our Location</h4>
                                        <p className="m-0">123 Street, New York, USA</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-5">
                                    <div className="btn-icon bg-secondary mr-4">
                                        <i className="fa fa-2x fa-phone-alt text-white"></i>
                                    </div>
                                    <div className="mt-n1">
                                        <h4>Call Us</h4>
                                        <p className="m-0">+012 345 6789</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="btn-icon bg-warning mr-4">
                                        <i className="fa fa-2x fa-envelope text-white"></i>
                                    </div>
                                    <div className="mt-n1">
                                        <h4>Email Us</h4>
                                        <p className="m-0">info@example.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="section-title position-relative mb-4">
                                <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Need Help?</h6>
                                <h1 className="display-4">Send Us A Message</h1>
                            </div>
                            <div className="contact-form">
                                <form>
                                    <div className="row">
                                        <div className="col-6 form-group">
                                            <input type="text" className="form-control border-top-0 border-right-0 border-left-0 p-0" placeholder="Your Name" required="required" />
                                        </div>
                                        <div className="col-6 form-group">
                                            <input type="email" className="form-control border-top-0 border-right-0 border-left-0 p-0" placeholder="Your Email" required="required" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control border-top-0 border-right-0 border-left-0 p-0" placeholder="Subject" required="required" />
                                    </div>
                                    <div className="form-group">
                                        <textarea className="form-control border-top-0 border-right-0 border-left-0 p-0" rows="5" placeholder="Message" required="required"></textarea>
                                    </div>
                                    <div>
                                        <button className="btn btn-primary py-3 px-5" type="submit">Send Message</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};