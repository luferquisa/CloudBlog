import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  // Estado para manejar el formulario
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  // Función para enviar el post al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = { title, content };
    console.log(newPost.title+" prueba prueba")
    try {
      const response = await fetch("http://104.198.196.96/posts/create", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el post");
      }
      const data = await response.json();
      console.log("Post creado:", data);
      // Redirigir a la página principal después de crear el post
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Crear Nuevo Post</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 font-medium">Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium">Contenido:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md h-40"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Publicar
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
