import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { config } from "./config";
import { Link } from "react-router-dom";


//Pagina para consultar todos los post por tag
const PostsByTag = () => {
  const { tagId } = useParams(); // Obtiene el ID del tag desde la URL
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://${config.BACKEND_URL}/posts/posts-by-tag/${tagId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener los posts");
        }
        return response.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [tagId]);

  if (loading) return <p className="text-center text-gray-500 mt-4">Cargando posts...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Posts con el Tag ID: {tagId}
      </h2>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No hay posts con este tag.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="p-4 border rounded-md shadow-sm bg-gray-50">
              <h3 className="text-lg font-bold text-gray-700">{post.title}</h3>
              <p className="text-gray-600">{post.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostsByTag;
