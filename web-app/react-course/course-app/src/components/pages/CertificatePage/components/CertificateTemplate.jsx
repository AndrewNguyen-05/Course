const CertificateTemplate = () => {
    return (
        <div className="certificate-container">
            <div className="certificate-outer-border">
                <div className="certificate-inner-border">
                    <div className="certificate-content">
                        <div className="certificate-logo">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEg1auepYpgbQmgwOxAJVs9RVLB2LuwTqeyQ&s"
                                alt="DLearning Logo"
                            />
                        </div>
                        <h1>DLearning Certificate of Completion</h1>
                        <p className="certificate-title">This certifies that</p>
                        <p className="certificate-recipient-name">[Recipient Name]</p>
                        <p className="certificate-description">has successfully completed the course</p>
                        <p className="certificate-course-title">[Course Name]</p>
                        <p className="certificate-description">on [Completion Date]</p>

                        <div className="certificate-center-signature">
                            <div className="certificate-signature-line">DLearning</div>
                            <span>Official Website Signature</span>
                        </div>

                        <div className="certificate-footer">
                            <div className="certificate-signature">
                                <div className="certificate-signature-line">[Instructor Name]</div>
                                <span>Instructor</span>
                            </div>
                            <div className="certificate-date-completed">
                                <div className="certificate-date-line">[Completion Date]</div>
                                <span>Date</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CertificateTemplate;