export const getAdsByCurrentLogin = async (token) => {
    const response = await fetch(`http://localhost:8080/api/v1/get-ads-current`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    return response.json();
}