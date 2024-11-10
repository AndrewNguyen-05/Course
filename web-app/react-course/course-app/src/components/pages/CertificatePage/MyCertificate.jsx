import React, { useEffect, useState } from "react";
import axios from "../../../utils/CustomizeAxios";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const MyCertificate = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState('');

    useEffect(() => {
        const fetchCertificateByUserLogin = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`api/v1/certificate/current-login`);
                if (response && response.data.code === 200 && response.data.result) {
                    setCertificates(response.data.result);
                } else {
                    setCertificates([]);
                }
            } catch (error) {
                console.log(error);
                setHttpError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificateByUserLogin();
    }, []);

    const handleDownload = (certificateId) => {
        const certificateElement = document.getElementById(`certificate-${certificateId}`);
        html2canvas(certificateElement, { scale: 5 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Certificate_${certificateId}.pdf`);
        });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (httpError) {
        return <div>{httpError}</div>;
    }

    return (
        <div className="main-certificate">
            <div className="my-certificate-page">
                {certificates.map((certificate) => (
                    <div
                        key={certificate.certificateId}
                        id={`certificate-${certificate.certificateId}`}
                        className="my-certificate-container"
                        onClick={() => handleDownload(certificate.certificateId)}
                    >
                        <div className="my-certificate-outer-border">
                            <div className="my-certificate-inner-border">
                                <div className="my-certificate-content">
                                    <div className="my-certificate-logo">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEg1auepYpgbQmgwOxAJVs9RVLB2LuwTqeyQ&s"
                                            alt="DLearning Logo"
                                        />
                                    </div>
                                    <h1>DLearning Certificate of Completion</h1>
                                    <p className="my-certificate-title">This certifies that</p>
                                    <p className="my-certificate-recipient-name">{certificate.username}</p>
                                    <p className="my-certificate-description">has successfully completed the course</p>
                                    <p className="my-certificate-course-title">{certificate.courseName}</p>
                                    <p className="my-certificate-description">on {certificate.issueDate}</p>

                                    <div className="my-certificate-center-signature">
                                        <div className="my-certificate-signature-line">DLearning</div>
                                        <span>Official Website Signature</span>
                                    </div>

                                    <div className="my-certificate-footer">
                                        <div className="my-certificate-signature">
                                            <div>Instructor</div>
                                            <span className="my-certificate-signature-line">{certificate.author}</span>
                                        </div>
                                        <div className="my-certificate-date-completed">
                                            <div>Issue Date</div>
                                            <span className="my-certificate-date-line">{certificate.issueDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCertificate;
