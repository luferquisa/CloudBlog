import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { config } from "./config";

//Pagina para crear los post
const CreatePost = () => {

  // Estado para manejar el formulario
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState(""); 
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // Capturar el token
  const author = localStorage.getItem("user_id");

  const handleLogout = () => {
    logout();
    navigate("/login"); // Ahora redirige aquí
  };

  const { logout } = useAuth();
  const navigate = useNavigate();


  // Función para enviar el post al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convertir la cadena de etiquetas en una lista
    const tagList = tags.split(",").map(tag => ({ name: tag.trim() })).filter(tag => tag.name !== "");

    const newPost = { title, content };
    console.log(newPost.title+" prueba prueba"+ tagList[0],+" "+token);
    try {
      const response = await fetch(`http://${config.BACKEND_URL}/posts/create`, { 
        mode:  'cors',  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Enviar token en los headers
        },
        body: JSON.stringify({
          author : author,
          title: newPost.title,
          content: newPost.content,
          tags:tagList
        }),
      });

      if (response.status === 401) {
        logout(); // Cerrar sesión si el token es inválido
        navigate("/login");
        return;
      }

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
      <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar Sesión
      </button>
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
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium">Contenido:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black h-32 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
            <label className="block text-gray-700">Etiquetas (separadas por comas)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Python, FastAPI, Backend"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

        <button
          type="submit"
          className="bg-blue-600 bg-black text-white px-4 py-2 rounded  hover:bg-blue-700"
        >
          Publicar
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
