import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await authService.login(email, password);
            console.log('Login successful:', response);
            navigate('/documents');
        } catch (error: any) {
            console.error('Login failed:', error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-500 drop-shadow-sm">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-500 placeholder-blue-300 transition"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-7">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-500 placeholder-blue-300 transition"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white text-lg py-2 px-4 rounded-2xl font-bold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
                    >
                        Login
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-blue-400 text-lg">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-500 hover:text-blue-800 text-lg font-semibold">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;