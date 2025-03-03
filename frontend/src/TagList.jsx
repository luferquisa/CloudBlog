import React, { useEffect, useState } from "react";
import { config } from "./config";
import { Link } from "react-router-dom";


const TagsList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token"); // Capturar el token

  useEffect(() => {
    fetch(`http://${config.BACKEND_URL}/tags/gettags`,{
          mode:  'cors',
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Enviar el token en el header
          },
        } )
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener etiquetas");
        }
        return response.json();
      })
      .then(data => {
        setTags(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando etiquetas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Lista de Etiquetas</h2>
    <div className="flex flex-wrap gap-2 justify-center">
      {tags.map(tag => (
          <Link
            key={tag.id}
            to={`/posts-by-tag/${tag.id}`}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold hover:bg-blue-200 transition duration-300"
          >
            {tag.name}
          </Link>
        ))}
    </div>
  </div>
  );
};

export default TagsList;
