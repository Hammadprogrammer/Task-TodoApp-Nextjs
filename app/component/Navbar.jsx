"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../config/firebase';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      setUser(null); 
      router.push('/login'); 
    } catch (error) {
      console.error("Logout error:", error); 
    }
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">TodoApp</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="text-white hover:text-gray-200">
            Home
          </Link>

          {/* Show Profile  logged in */}
          {user && (
            <Link href="/profile" className="text-white hover:text-gray-200">
              Profile
            </Link>
          )}

          {/* Show Login if not logged in, otherwise show Logout button */}
          {!user ? (
            <Link href="/login" className="text-white hover:text-gray-200">
              Login
            </Link>
          ) : (
            <button 
              onClick={handleLogout} 
              className="text-white hover:text-gray-200"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <Link href="/" className="block text-white hover:text-gray-200">
            Home
          </Link>

          {/* Show Profile link only if the user is logged in */}
          {user && (
            <Link href="/profile" className="block text-white hover:text-gray-200">
              Profile
            </Link>
          )}

          {/* Show Login if not logged in, otherwise show Logout button */}
          {!user ? (
            <Link href="/login" className="block text-white hover:text-gray-200">
              Login
            </Link>
          ) : (
            <button 
              onClick={handleLogout} 
              className="block text-white hover:text-gray-200"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
