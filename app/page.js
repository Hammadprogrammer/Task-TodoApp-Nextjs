"use client";
import { useEffect, useState } from "react";
import { db, auth } from "./config/firebase"; 
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      fetchTodos();  
    });

    return () => unsubscribe();
  }, []);

  const fetchTodos = async () => {
    const todosCollection = collection(db, "todos");
    const todoSnapshot = await getDocs(todosCollection);
    const todoList = todoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const sortedTodos = todoList.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Sort by startDate descending
    setTodos(sortedTodos); 
  };

  // Filter todos 
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Task Mangement System</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search todos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-md p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-black"
      />

      <div className="w-full max-w-md space-y-4">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <div key={todo.id} className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">
                {todo.title}
              </h3>
              <p className="text-gray-600">{todo.description}</p>
              <p className="text-gray-500">
                Start: {new Date(todo.startDate).toLocaleString()} <br />
                End: {new Date(todo.endDate).toLocaleString()}
              </p>
              <div className="flex flex-wrap mt-2 gap-2">
                {todo.imageUrls && todo.imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Uploaded"
                    className="w-12 h-12 object-cover rounded"
                    
                  />
                 
                ))}
                 
              </div>
         
            </div>
          ))
        ) : (
          <p className="text-gray-600">No todos found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
