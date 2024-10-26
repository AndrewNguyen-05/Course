import { useNavigate } from 'react-router-dom';

export const HandleLogout = ({ setLoggedOut }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.log('No token found');
            setLoggedOut(true);
            navigate('/login');
            return;
        }

        localStorage.clear();
        setLoggedOut(true); 

        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token })
            });

            if (response.ok) {
                navigate('/login');  
            } else {
                const errorData = await response.json();
                console.log('Logout Failed: ', errorData.message || response.statusText);
            }
        } catch (error) {
            console.log('Logout error: ', error);
        }
    };

    return { handleLogout };
};