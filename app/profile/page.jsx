"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth, storage } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [images, setImages] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTodos(currentUser.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchTodos = async (userId) => {
    const todosCollection = collection(db, 'todos');
    const userTodosQuery = query(todosCollection, where("userId", "==", userId));
    const todoSnapshot = await getDocs(userTodosQuery);
    const todoList = todoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const sortedTodos = todoList.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    setTodos(sortedTodos); 
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!user) return;

    const todoData = {
      title,
      description,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      userId: user.uid,
      imageUrls: [],
    };

    if (editId) {
      // If editing, delete previous images before uploading new ones
      await deleteExistingImages(editId);
      const uploadedUrls = await uploadImages(editId, user.uid);
      await updateDoc(doc(db, 'todos', editId), { ...todoData, imageUrls: uploadedUrls });
      setEditId(null);
      fetchTodos(user.uid);  // Refresh todos to show the updated todo with images
    } else {
      const newTodoRef = await addDoc(collection(db, 'todos'), todoData);
      const newTodo = { id: newTodoRef.id, ...todoData };

      // Upload images for the new todo
      if (images.length > 0) {
        const uploadedUrls = await uploadImages(newTodoRef.id, user.uid);
        await updateDoc(doc(db, 'todos', newTodoRef.id), { imageUrls: uploadedUrls });
        newTodo.imageUrls = uploadedUrls;
      }

      setTodos((prevTodos) => [...prevTodos, newTodo].sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
    }

    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setImages([]);
    setExistingImageUrls([]);
  };

  const uploadImages = async (todoId, userId) => {
    const uploadedUrls = [];
    for (const image of images) {
      const imageRef = ref(storage, `todos/${userId}/${todoId}/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);
      uploadedUrls.push(imageUrl);
    }
    return uploadedUrls;
  };

  const deleteExistingImages = async (todoId) => {
    // Remove existing images from storage
    for (const url of existingImageUrls) {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
    }
  };

  const handleImageUpload = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const editTodo = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setStartDate(new Date(todo.startDate).toISOString().slice(0, 16));
    setEndDate(new Date(todo.endDate).toISOString().slice(0, 16));
    setEditId(todo.id);
    setImages([]); 
    setExistingImageUrls(todo.imageUrls || []); // Set existing images for the todo being edited
  };

  const deleteTodo = async (id) => {
    await deleteExistingImages(id);
    await deleteDoc(doc(db, 'todos', id));
    fetchTodos(user.uid);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Todo App</h1>

      {user ? (
        <>
          {/* Responsive Form */}
          <form onSubmit={addTodo} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mb-6 space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500 text-black"
              />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500 text-black"
              />
            </div>

            {/* Date-Time Inputs */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              {/* Start Date */}
              <div className="w-full">
                <label htmlFor="startDate" className="block text-gray-700 mb-2">Start Date</label>
                <input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500 text-black"
                />
              </div>

              {/* End Date */}
              <div className="w-full">
                <label htmlFor="endDate" className="block text-gray-700 mb-2">End Date</label>
                <input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500 text-black"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="file-upload" className="block text-gray-700 mb-2">Upload Images</label>
              {/* Hidden File Input */}
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {/* Custom Upload Button */}
              <label
                htmlFor="file-upload"
                className="cursor-pointer w-full p-3 bg-blue-600 text-white text-center font-semibold rounded-md hover:bg-blue-700 transition-colors"
              >
                Upload Files
              </label>
            </div>

            {/* Image Previews */}
            <div className="flex flex-wrap gap-4">
              {existingImageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="Uploaded"
                  className="w-24 h-24 object-cover rounded-md"
                />
              ))}
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              {editId ? "Update Todo" : "Add Todo"}
            </button>
          </form>

          {/* Todo List */}
          <div className="w-full max-w-lg space-y-6">
            {todos.map(todo => (
              <div key={todo.id} className="p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between">
                {/* Todo Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{todo.title}</h3>
                  <p className="text-gray-600 mt-2">{todo.description}</p>
                  <p className="text-gray-500 mt-2">
                    <span className="font-medium">Start:</span> {new Date(todo.startDate).toLocaleString()} <br />
                    <span className="font-medium">End:</span> {new Date(todo.endDate).toLocaleString()}
                  </p>
                  {/* Image Previews */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {todo.imageUrls && todo.imageUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Uploaded"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-4 sm:mt-0">
                  <button
                    onClick={() => editTodo(todo)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-700">Please log in to manage your todos.</p>
      )}
    </div>
  );
};

export default TodoApp;
