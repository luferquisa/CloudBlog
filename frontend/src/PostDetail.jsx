import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams(); // Obtener el ID del post desde la URL
  const [post, setPost] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login"); // Ahora redirige aquí
  };

  const { logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este post?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://104.198.196.96/posts/posts/${id}`, {
        mode:  'cors',
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Enviar el token en el header
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el post");
      }

      alert("Post eliminado exitosamente");
      navigate("/"); // Redirigir a la página principal después de eliminar
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo eliminar el post");
    }
  };

  
  
  useEffect(() => {
    // URL del backend para obtener el detalle del post
    const API_URL = `http://104.198.196.96/posts/${id}`;
    ratings();
    fetch(API_URL,{
      mode:  'cors',
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Enviar el token en el header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar el post");
        }        
        
        return response.json();
      })
      .then((data) => {
        setPost(data);
        console.log(JSON.stringify(data));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
      
  }, [id]);

  // Función para obtener los ratings de cada post
  function ratings(){
    console.log("Rating "+id+" "+token);
        try{
          fetch(`http://104.198.196.96/ratings/${id}/average`,{
            mode:  'cors',  
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`, // Enviar el token en el header
            },
          })
          .then(response => response.json())
          .then(data => setRating(data.average_rating)) 
          .catch(error => console.error("Error al obtener el promedio:", error));
          //console.log("entro"+JSON.stringify(response));
          //console.log("rating "+JSON.stringify(response));
        } 
        catch{(error) => console.error(`Error al obtener rating para post ${id}:`, error)};
  }

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="min-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
      <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar Sesión
      </button>
      <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>
        Eliminar Post
      </button>
      <Link to={`/post/${id}/edit`}>
        <button>Editar Post</button>
      </Link>
      <h1 className="text-4xl font-bold text-gray-800">{post.title}</h1>
      <div className="mt-4 text-gray-700 leading-relaxed">{post.content}</div>
      <p className="text-sm text-gray-500 mt-2">
        <strong>Autor:</strong>
        {post.author !== null ? (
            <span key={post.author.username} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm mr-2">
              {post.author.username}
            </span>
        ) : (
          <span className="text-gray-500"> No hay autor </span>
        )}
      </p>
      <p className="mt-2 text-yellow-500 font-bold">
      ⭐ {rating !== null ? <p>{rating}</p> : <p>Cargando...</p>}
      </p>
     <div className="mt-6">
      <p className="text-gray-600 mt-2">
        <strong>Tags:</strong>
        {post.tags.length > 0 ? (
          post.tags.map((tag) => (
            <span key={tag.id} className="inline-block bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full mr-2">
              {tag.name}
            </span>
          ))
        ) : (
          <span className="text-gray-500"> No hay tags </span>
        )}
      </p>
        </div>
        </div>
      </div>
      <a href="/" className="mt-6 inline-block text-blue-600 hover:underline">← Volver al inicio</a>
    </div>
  );
};

export default PostDetail;
