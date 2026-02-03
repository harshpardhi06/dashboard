import axiosInstance from "../utils/axiosInstance";

export async function loginUser({ email, password }) {
    try {
        const response = await axiosInstance.post('/dashboard/login', {
            email,
            password,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function logOut() {
    const response = await axiosInstance.post('/dashboard/logout');
    return response.data;
}

