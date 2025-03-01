import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  
  const [posts, setPosts] = useState([]);
  const [ratings, setRatings] = useState({});

  // Función para obtener los posts desde el backend
  useEffect(() => {
    fetch("http://104.198.196.96/posts") // Asegúrate de que esta URL coincida con tu API
      .then((response) => response.json())
      .then((data) =>{ 
        console.log("Datos recibidos:", data);
        fetchRatings(data);
        setPosts(data);})
      .catch((error) => console.error("Error fetching posts:", error));

      
  }, []);

  // Función para obtener los ratings de cada post
  const fetchRatings = (posts) => {
    posts.forEach((post) => {
      fetch(`http://104.198.196.96/ratings/${post.id}/average`)
        .then((response) => response.json())
        .then((data) => {
          setRatings((prevRatings) => ({
            ...prevRatings,
            [post.id]: data.average_rating, // Guardar el rating en el estado
          }));
        })
        .catch((error) => console.error(`Error al obtener rating para post ${post.id}:`, error));
    });
    console.log("post "+JSON.stringify(posts));
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to My Blog Luisa</h1>
      <p>Este es el blog de seguridad cloud</p>
      <h2 className="text-2xl font-semibold text-gray-800">Últimos Posts</h2>
      <Link
          to="/createpost"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Nuevo Post
        </Link>
        <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-lg rounded-lg p-5 hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-gray-700">{post.title}</h3>
            <p className="text-gray-600 mt-2">{post.content}</p>
            <p className="mt-2 text-yellow-500 font-bold">
              ⭐ {ratings[post.id] !== undefined ? ratings[post.id].toFixed(1): "Cargando..."}
            </p>
            <a href={`/post/${post.id}`} className="mt-3 inline-block text-blue-500 hover:underline">
              Leer más
            </a>
          </div>
        ))}c
      </div>
      
      
    </div>
  );
}

export default Home;
