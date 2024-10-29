import { useEffect, useState } from "react";
import { getAvatar } from "../service/ProfileService";
import { getPointsByCurrentLogin } from "../service/UserService";

export const useUserProfile = (token, loggedOut, isTokenValid) => {
    const [avatar, setAvatar] = useState(null);
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token || loggedOut || !isTokenValid) {
            setLoading(false);
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const avatarData = await getAvatar();
                setAvatar(avatarData.result);
                const pointsData = await getPointsByCurrentLogin();
                setPoints(pointsData.result.points);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [token, loggedOut, isTokenValid]);

    return { avatar, points, loading };
};
