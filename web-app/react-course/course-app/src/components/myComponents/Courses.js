import React from "react";
import { Link } from 'react-router-dom';

export const Courses = () => {
    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <div className="row mx-0 justify-content-center">
                    <div className="col-lg-8">
                        <div className="section-title text-center position-relative mb-5">
                            <h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">Our Courses</h6>
                            <h1 className="display-4">Checkout New Releases Of Our Courses</h1>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-6 pb-4">
                        <Link className="courses-list-item position-relative d-block overflow-hidden mb-2" to="/detail">
                            <img className="img-fluid" src={require('./../../img/courses-1.jpg')} alt="Course 1" />
                            <div className="courses-text">
                                <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                <div className="border-top w-100 mt-3">
                                    <div className="d-flex justify-content-between p-4">
                                        <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                        <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-lg-4 col-md-6 pb-4">
                        <Link className="courses-list-item position-relative d-block overflow-hidden mb-2" to="/detail">
                            <img className="img-fluid" src={require('./../../img/courses-2.jpg')} alt="Course 2" />
                            <div className="courses-text">
                                <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                <div className="border-top w-100 mt-3">
                                    <div className="d-flex justify-content-between p-4">
                                        <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                        <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-lg-4 col-md-6 pb-4">
                        <Link className="courses-list-item position-relative d-block overflow-hidden mb-2" to="/detail">
                            <img className="img-fluid" src={require('./../../img/courses-3.jpg')} alt="Course 3" />
                            <div className="courses-text">
                                <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                <div className="border-top w-100 mt-3">
                                    <div className="d-flex justify-content-between p-4">
                                        <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                        <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-lg-4 col-md-6 pb-4">
                        <Link className="courses-list-item position-relative d-block overflow-hidden mb-2" to="/detail">
                            <img className="img-fluid" src={require('./../../img/courses-4.jpg')} alt="Course 4" />
                            <div className="courses-text">
                                <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                <div className="border-top w-100 mt-3">
                                    <div className="d-flex justify-content-between p-4">
                                        <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                        <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-lg-4 col-md-6 pb-4">
                        <Link className="courses-list-item position-relative d-block overflow-hidden mb-2" to="/detail">
                            <img className="img-fluid" src={require('./../../img/courses-5.jpg')} alt="Course 3" />
                            <div className="courses-text">
                                <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                <div className="border-top w-100 mt-3">
                                    <div className="d-flex justify-content-between p-4">
                                        <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                        <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-lg-4 col-md-6 pb-4">
                        <Link className="courses-list-item position-relative d-block overflow-hidden mb-2" to="/detail">
                            <img className="img-fluid" src={require('./../../img/courses-6.jpg')} alt="Course 3" />
                            <div className="courses-text">
                                <h4 className="text-center text-white px-3">Web design & development courses for beginners</h4>
                                <div className="border-top w-100 mt-3">
                                    <div className="d-flex justify-content-between p-4">
                                        <span className="text-white"><i className="fa fa-user mr-2"></i>Jhon Doe</span>
                                        <span className="text-white"><i className="fa fa-star mr-2"></i>4.5 <small>(250)</small></span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
          
                    <div className="col-12">
                        <nav aria-label="Page navigation">
                            <ul className="pagination pagination-lg justify-content-center mb-0">
                                <li className="page-item disabled">
                                    <Link className="page-link rounded-0" to="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </Link>
                                </li>
                                <li className="page-item active"><Link className="page-link" to="#">1</Link></li>
                                <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                                <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                <li className="page-item">
                                    <Link className="page-link rounded-0" to="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                        <span className="sr-only">Next</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

