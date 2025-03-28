import axios from "axios";

const BASE_URL = "https://reqres.in/api";

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { email, password });
        return response.data; // Should return token
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};
