// "use client";
// import Link from 'next/link';
// import React, { useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from '../config/firebase';

// function Login() {
//     const email = useRef();
//     const password = useRef();
//     const [error, setError] = useState(null); // State to store error message
//     const router = useRouter();

//     const add = (e) => {
//         e.preventDefault();
//         signInWithEmailAndPassword(auth, email.current.value, password.current.value)
//             .then((userCredential) => {
//                 const user = userCredential.user;
//                 setError(null); // Clear any previous errors
//                 router.push('/profile');
//             })
//             .catch((error) => {
//                 setError("Invalid email or password. Please try again."); // Set error message
//             });
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <form 
//                 onSubmit={add} 
//                 className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg space-y-6"
//             >
//                 <h2 className="text-2xl font-bold text-center text-blue-700">Login</h2>

//                 {error && (
//                     <div className="text-red-600 text-center mb-4">
//                         {error} {/* Display error message */}
//                     </div>
//                 )}

//                 <input 
//                     type="text" 
//                     placeholder="Enter your email" 
//                     ref={email} 
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                 />
//                 <input 
//                     type="password" 
//                     placeholder="Enter your password" 
//                     ref={password} 
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                 />

//                 <button 
//                     type="submit" 
//                     className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
//                 >
//                     Login
//                 </button>

//                 <div className="text-center">
//                     <Link href="/register" className="text-blue-600 hover:underline">
//                         Not a user? Register here
//                     </Link>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default Login;


"use client";
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase';

function Login() {
    const email = useRef();
    const password = useRef();
    const [error, setError] = useState(null);
    const router = useRouter();

    const add = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email.current.value, password.current.value)
            .then((userCredential) => {
                const user = userCredential.user;
                setError(null);
                router.push('/profile');
            })
            .catch((error) => {
                setError("Invalid email or password. Please try again.");
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form 
                onSubmit={add} 
                className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-blue-700">Login</h2>

                {error && (
                    <div className="text-red-600 text-center mb-4">
                        {error}
                    </div>
                )}

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
                    Login
                </button>

                <div className="text-center">
                    <Link href="/register" className="text-blue-600 hover:underline">
                        Not a user? Register here
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
