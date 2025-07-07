import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const authService = {
    async login(email: string, password: string) {
        try {
            const response = await api.post('/login', {
                email,
                password,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    async register(name: string, email: string, password: string, password_confirmation: string) {
        try {
            const response = await api.post('/register', {
                name,
                email,
                password,
                password_confirmation,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    }
};

export default api; 