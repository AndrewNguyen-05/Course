import CertificateTemplate from "./components/CertificateTemplate";

const CertificateContent = () => {
    return (
        <div className="certificate-page">
            <div className="motivation-section">
                <h2>Certificate of Achievement</h2>
                <p>
                    This is a list of individuals who have shown <strong className="green">responsibility</strong> to themselves,
                    to their families, and to their future.
                </p>
                <blockquote>
                    “The way you do one thing is the way you do everything.”
                </blockquote>
                <p>
                    You could spend <strong className="red">hours</strong> watching your favorite shows, <strong className="red">entire evenings</strong> drinking with friends,
                    or <strong className="red">full days</strong> immersed in video games. That’s your choice.
                </p>
                <p>
                    But here, we celebrate those who chose to <strong className="black-bold">work hard every day</strong>,
                    to <strong className="black-bold">strive consistently</strong>, and to <strong className="black-bold">grow continuously</strong>.
                </p>
                <p>
                    They understand that without effort today, without striving right now, they won’t
                    have a better life, their parents won’t enjoy a comfortable old age, and their children
                    won’t have wise parents.
                </p>
                <p>
                    Learning and self-improvement are challenging pursuits, especially with the temptations
                    of social gatherings and video games. But good things come to those who <strong className="green">truly
                        commit to their goals</strong> and complete what they started.
                </p>
                <p>
                    Are you just signing up for classes without finishing them? Do you feel challenged by the
                    real-world knowledge <span className="red">DLearning</span> brings to you?
                </p>
                <p>
                    The insights you gain here will accelerate your career, helping you move <strong className="blue">faster</strong>, go <strong className="blue">further</strong>
                    than others, and <strong className="blue">save you time and money</strong>. But if you choose to leave all of it behind…
                </p>
                <p>
                    Remember, when you eventually see the potential of DevOps and wish to learn, everything
                    will still be here, but others may have already raced ahead of you.
                </p>
            </div>

            <CertificateTemplate />
        </div>
    );
};

export default CertificateContent;
