import React from 'react';
import { Link } from 'react-router-dom';
import { useRegisterMutation } from '../Redux/APIService';
import toast from 'react-hot-toast';

const Register = () => {
    const [register] = useRegisterMutation()
    const handleRegister = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const obj = Object.fromEntries(formData.entries());
        const loginData = await register({ ...obj })
        console.log(loginData);
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-8 space-y-4 shadow-xl bg-base-100 rounded-xl">
                <h1 className="text-2xl font-bold text-center">Register</h1>
                <form onSubmit={handleRegister} className="space-y-4"  >
                    <div>
                        <label className="label">
                            <span className="label-text">Full Name</span>
                        </label>
                        <input
                            name='fullname'
                            type="text"
                            placeholder="John Doe"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            name='email'
                            type="email"
                            placeholder="your@email.com"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            name='username'
                            type="username"
                            placeholder="Enter your Username"
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
                            placeholder="Create a password"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Confirm Password</span>
                        </label>
                        <input
                            name='confirmPassword'
                            type="password"
                            placeholder="Repeat your password"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Create Account
                    </button>
                    <p className="text-center text-sm">Already have an account? <Link to="/login" className="link link-primary">Login</Link></p>
                </form>
            </div>
        </div>
    );
};

export default Register;
