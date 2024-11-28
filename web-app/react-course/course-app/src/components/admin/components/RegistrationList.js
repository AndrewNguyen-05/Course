// import React, { useEffect, useState } from "react";
// import { SidebarAdmim } from "../layouts/SidebarAdmin";
// import AdminHeader from "../layouts/AdminHeader";
// import { Footer } from "../../layouts/Footer";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Button,
//   Table,
//   Badge,
//   Spinner,
//   Container,
//   Row,
//   Col,
//   Modal,
// } from "react-bootstrap";
// import {
//   FiCheckCircle,
//   FiFileText,
//   FiFacebook,
//   FiXCircle,
//   FiAward,
// } from "react-icons/fi"; // Sử dụng Feather Icons
// import { approveTeacher, rejectTeacher } from "../../../service/TeacherService";
// import "../admin.css";

// export const RegistrationList = () => {
//   const [listRegister, setListRegister] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedTeacherId, setSelectedTeacherId] = useState(null);
//   const [actionType, setActionType] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8080/api/v1/registration-teachers`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setListRegister(data.result);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleOpenInNewTab = (url) => {
//     const fullUrl = `http://localhost:8080${url}`;
//     window.open(fullUrl, "_blank", "noopener,noreferrer");
//   };

//   const handleActionClick = (teacher, action) => {
//     if (teacher && teacher.id) {
//       setSelectedTeacherId(teacher.id);
//       setActionType(action);
//       setShowModal(true);
//     } else {
//       toast.error("Invalid teacher selection.");
//     }
//   };

//   const handleConfirmAction = async () => {
//     if (!selectedTeacherId) {
//       toast.error("Invalid teacher selection.");
//       return;
//     }

//     try {
//       if (actionType === "approve") {
//         await approveTeacher(selectedTeacherId);
//         toast.success("Teacher approved successfully.");
//       } else if (actionType === "reject") {
//         await rejectTeacher(selectedTeacherId);
//         toast.success("Teacher rejected successfully.");
//       }

//       setListRegister(
//         listRegister.filter((teacher) => teacher.id !== selectedTeacherId)
//       );
//     } catch (error) {
//       toast.error("An error occurred while processing your request.");
//     } finally {
//       setShowModal(false);
//     }
//   };

//   return (
//     <div className="registration-container d-flex flex-column min-vh-100">
//       <div className="d-flex flex-grow-1">
//         <SidebarAdmim />
//         <div className="content-wrapper flex-grow-1">
//           <AdminHeader />
//           <Container fluid className="mt-4">
//             <Row>
//               <Col>
//                 <h2 className="registration-title mb-4 text-center">
//                   Teacher Registration List
//                 </h2>
//                 {loading ? (
//                   <div className="text-center">
//                     <Spinner animation="border" variant="primary" />
//                   </div>
//                 ) : error ? (
//                   <p className="text-center text-danger">Error: {error}</p>
//                 ) : (
//                   <div className="registration-table-container p-3 rounded">
//                     <Table
//                       striped
//                       bordered
//                       hover
//                       responsive
//                       className="registration-table"
//                     >
//                       <thead className="bg-primary text-white">
//                         <tr>
//                           <th>#</th>
//                           <th>Email</th>
//                           <th>Name</th>
//                           <th>Phone</th>
//                           <th>Facebook</th>
//                           <th>CV</th>
//                           <th>Certificate</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {listRegister.length > 0 ? (
//                           listRegister.map((teacher, index) => (
//                             <tr key={index} className="align-middle">
//                               <td>{index + 1}</td>
//                               <td>
//                                 <Badge bg="info" className="p-2">
//                                   {teacher.email}
//                                 </Badge>
//                               </td>
//                               <td>{teacher.name}</td>
//                               <td>
//                                 <Badge bg="warning" className="p-2">
//                                   {teacher.phone}
//                                 </Badge>
//                               </td>
//                               <td>
//                                 {teacher.facebookLink ? (
//                                   <a
//                                     href={teacher.facebookLink}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-primary"
//                                   >
//                                     <FiFacebook /> Profile
//                                   </a>
//                                 ) : (
//                                   <span className="text-muted">No Profile</span>
//                                 )}
//                               </td>
//                               <td>
//                                 <Button
//                                   variant="outline-primary"
//                                   onClick={() =>
//                                     handleOpenInNewTab(teacher.cvUrl)
//                                   }
//                                 >
//                                   <FiFileText /> View CV
//                                 </Button>
//                               </td>
//                               <td>
//                                 <Button
//                                   variant="outline-secondary"
//                                   onClick={() =>
//                                     handleOpenInNewTab(teacher.certificate)
//                                   }
//                                 >
//                                   <FiAward /> View Certificate
//                                 </Button>
//                               </td>
//                               <td>
//                                 <Button
//                                   variant="outline-success"
//                                   className="me-2"
//                                   onClick={() =>
//                                     handleActionClick(teacher, "approve")
//                                   }
//                                 >
//                                   <FiCheckCircle /> Approve
//                                 </Button>
//                                 <Button
//                                   variant="outline-danger"
//                                   onClick={() =>
//                                     handleActionClick(teacher, "reject")
//                                   }
//                                 >
//                                   <FiXCircle /> Reject
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="8" className="text-center">
//                               No registrations found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </Table>
//                   </div>
//                 )}
//               </Col>
//             </Row>
//           </Container>
//         </div>
//       </div>
//       <Footer />
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm {actionType}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {actionType === "approve" ? (
//             <p>Are you sure you want to approve this registration?</p>
//           ) : (
//             <p>Are you sure you want to reject this registration?</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button
//             variant={actionType === "approve" ? "success" : "danger"}
//             onClick={handleConfirmAction}
//           >
//             Confirm
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };
