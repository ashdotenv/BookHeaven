import React from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../Redux/APIService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const[login] = useLoginMutation()
    const handleLogin = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const obj = Object.fromEntries(formData.entries());
        const loginData = await login(obj)
        if (loginData && loginData.data && loginData.data.token) {
            localStorage.setItem('token', loginData.data.token);
            localStorage.setItem('user', JSON.stringify({
                id: loginData.data.id,
                fullName: loginData.data.fullName,
                username: loginData.data.username,
                email: loginData.data.email,
                role: loginData.data.role
            }));
            navigate('/dashboard');
        } else {
            toast.error('Login failed!');
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-8 space-y-4 shadow-xl bg-base-100 rounded-xl">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            name='username'
                            placeholder="Enter your Username    "
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            name='password'
                            type="password"
                            placeholder="Enter your password"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-2">
                            <input type="checkbox" className="checkbox" />
                            <span className="label-text">Remember me</span>
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Sign In
                    </button>

                </form>
                <p className="text-center text-sm">Don't have an account Yet? <Link to="/Register" className="link link-primary">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;
