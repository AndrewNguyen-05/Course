import { useEffect, useState } from "react";
import { introspect } from "../service/AuthenticationService";

export const useAuthData = (token, loggedOut, isTokenValid) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || loggedOut || !isTokenValid) {
      setLoading(false);
      return;
    }

    introspect(token)
      .then((data) => {
        if (data.valid) setRole(data.scope);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [token, loggedOut, isTokenValid]);

  return { role, loading };
};
