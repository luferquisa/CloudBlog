import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams(); // Obtener el ID del post desde la URL
  const [post, setPost] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // URL del backend para obtener el detalle del post
    const API_URL = `http://104.198.196.96/posts/${id}`;
    ratings();
    fetch(API_URL)
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
    console.log("Rating "+id);
        try{
          fetch(`http://104.198.196.96/ratings/${id}/average`)
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
      <p className="text-gray-600 mt-2">{post.content}</p>
      <p className="text-gray-600 mt-2">
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
     
      <p className="text-gray-600 mt-2">
        <strong>Tags:</strong>
        {post.tags.length > 0 ? (
          post.tags.map((tag) => (
            <span key={tag.id} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm mr-2">
              {tag.name}
            </span>
          ))
        ) : (
          <span className="text-gray-500"> No hay tags </span>
        )}
      </p>

      <a href="/" className="mt-6 inline-block text-blue-600 hover:underline">← Volver al inicio</a>
    </div>
  );
};

export default PostDetail;
