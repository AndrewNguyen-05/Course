import { toast } from "react-toastify";

export const getAdsByCurrentLogin = async (token, page) => {
    const response = await fetch(`http://localhost:8080/api/v1/get-ads-current?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ads: ${response.status}`);
    }

    return response.json();
};

export const registerAds = async(token, formData) => {
    const response = await fetch(`http://localhost:8080/api/v1/register-ads`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })

    if(! response.ok){
        const errorData = await response.json();
        toast.error(errorData.message)
        throw new Error('Fail to registerAds' || errorData.message)
    }

    return response.json();
}
