import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPassword_confirmation] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== password_confirmation) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await authService.register(name, email, password, password_confirmation);
            console.log('Registration successful:', response);
            navigate('/documents');
        } catch (error: any) {
            console.error('Registration failed:', error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-500 drop-shadow-sm">Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="my-6">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="mt-1 block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-500 placeholder-blue-300 transition"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="my-6">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-500 placeholder-blue-300 transition"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="my-6">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-500 placeholder-blue-300 transition"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="my-6">
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            className="mt-1 block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-500 placeholder-blue-300 transition"
                            placeholder="Confirm your password"
                            value={password_confirmation}
                            onChange={(e) => setPassword_confirmation(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white text-lg py-2 px-4 rounded-2xl font-bold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
                    >
                        Register
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-blue-400 text-lg">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:text-blue-700 text-lg font-semibold">
                            Login now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;