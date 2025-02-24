import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams(); // Obtener el ID del post desde la URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // URL del backend para obtener el detalle del post
    const API_URL = `http://104.198.196.96/posts/${id}`;

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar el post");
        }
        return response.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
      <p className="text-gray-600 mt-2">{post.content}</p>
      <a href="/" className="mt-6 inline-block text-blue-600 hover:underline">← Volver al inicio</a>
    </div>
  );
};

export default PostDetail;
