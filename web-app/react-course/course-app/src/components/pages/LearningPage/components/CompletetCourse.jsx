import { useEffect } from "react";

const CongratulationsModal = ({ onClose }) => {
    useEffect(() => {
        createConfetti();
    }, []);

    const createConfetti = () => {
        const confettiContainer = document.getElementById('confetti-container');
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDuration = `${2 + Math.random() * 3}s`;
            confettiContainer.appendChild(confetti);
        }
    };

    return (
        <div className="complete-course-card">
            <div id="confetti-container"></div>
            <div className="complete-course-title-container">
                <h1 className="complete-course-title">Congratulations!</h1>
            </div>
            <p className="complete-course-subtitle">You've successfully completed the course!</p>

            <div className="complete-course-image-container">
                <div className="complete-course-image-frame">
                    <img src="https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/461888924_1336338187342499_1600352219436889037_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE4-1mZ_f7NkxFD5h9w00u1ferysEJfdKF96vKwQl90ocbWfSKJ-gwSVNsAdUcTp1uW9F1PGqrCRQSUdallPAZ_&_nc_ohc=nueSKEM6AkYQ7kNvgH_YQds&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=AOa6tic6lXvv51ot55Pcnpu&oh=00_AYB6VSheZJWgFmLVxWh0IIeKjOAfOLeyg0150M7vLg1NRQ&oe=67381109" alt="User" className="complete-course-image" />
                </div>
            </div>

            <h2 className="complete-course-username">Le Khanh Duc</h2>
            <p className="complete-course-message">
                You are now certified! Keep up the great work and continue learning!
            </p>

            <button className="complete-course-button"
                onClick={onClose}
            >View Certificate</button>
        </div>
    );
};

export default CongratulationsModal;
