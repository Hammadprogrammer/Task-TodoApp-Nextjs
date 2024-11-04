"use client";
import Link from 'next/link';
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase';

function Register() {
    const email = useRef();
    const password = useRef();
    const router = useRouter();

    const register = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
            .then((userCredential) => {
                const user = userCredential.user;
                router.push('/login');
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form 
                onSubmit={register} 
                className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-blue-700">Register</h2>

                <input 
                    type="text" 
                    placeholder="Enter your email" 
                    ref={email} 
                    className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500"
                />
                <input 
                    type="password" 
                    placeholder="Enter your password" 
                    ref={password} 
                    className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500"
                />

                <button 
                    type="submit" 
                    className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Register
                </button>

                <div className="text-center">
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Already a user? Login here
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Register;
