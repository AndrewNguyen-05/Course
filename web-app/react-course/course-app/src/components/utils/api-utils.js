const refreshToken = async() => {
    const response = await fetch(`http://localhost:8080/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({token : localStorage.getItem('token')})
    })

    if(!response.ok){
        throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    localStorage.setItem('token', data.result.token);
}

export const fetchApi = async (url, options) => {
    const response = await fetch(url, options);

    if(response.status === 401 && (await response.json()).message === 'EXPIRED_TOKEN'){
        await refreshToken();

        return await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                ...options.headers
            }
        })
    }

    return response;
}