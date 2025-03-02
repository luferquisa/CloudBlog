import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  
  const [posts, setPosts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [page, setPage] = useState(1);
  const limit = 10; // Número de posts por página

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  const { logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Capturar el token
  //setPage(prev= 1? 1:(prev - 1) * limit);
  // Función para obtener los posts desde el backend
  useEffect(() => {
    fetch(`http://104.198.196.96/posts?offset=${(page - 1) * limit}&limit=${limit}`, {
          mode:  'cors',
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Enviar el token en el header
          },
        }) 
      .then((response) => response.json())
      .then((data) =>{ 
        console.log("Datos recibidos:", data);
        fetchRatings(data);
        setPosts(data);})
      .catch((error) => console.error("Error fetching posts:", error));

      
  }, [page]);

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => (prev > 1 ? prev - 1 : 1));

  // Función para obtener los ratings de cada post
  const fetchRatings = (posts) => {
    posts.forEach((post) => {
      fetch(`http://104.198.196.96/ratings/${post.id}/average`,{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Enviar el token en el header
        },
      })
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
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="text-center py-6">
      <h1 className="text-4xl font-bold text-blue-600">Bienvenidos al blog de Luisa, Diego y Nièdila</h1>
      <p className="text-gray-600 mt-2">Este es el blog de seguridad cloud</p>
      <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar Sesión
      </button>
      </header>
      <main className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800">Últimos Posts</h2>
      
      <Link
          to="/createpost"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Nuevo Post
        </Link>
        <div className="grid gap-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div key={post.id} className="bg-white shadow-lg rounded-lg p-5 hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold text-gray-800">{post.title}</h3>
            <p className="text-sm text-gray-500">{post.content}</p>
            <p className="mt-2 text-yellow-500 font-bold">
              ⭐ {ratings[post.id] !== undefined ? ratings[post.id].toFixed(1): "Cargando..."}
            </p>
            <div className="mt-2">
              <strong>Etiquetas:</strong>{" "}
              {post.tags.map(tag => (
                <span key={tag.id} className="bg-blue-200 px-2 py-1 rounded mx-1 text-sm">
                  {tag.name}
                </span>
              ))}
            </div>
            <a href={`/post/${post.id}`} className="mt-3 inline-block text-blue-500 hover:underline">
              Leer más
            </a>
          </div>
          </article>
        ))}
         {/* Controles de paginación */}
      <button onClick={prevPage} disabled={page === 1}>
        Anterior
      </button>
      <span> Página {page} </span>
      <button onClick={nextPage} disabled={posts.length < limit}>
        Siguiente
      </button>
      </div>
      </main>
      
    </div>
  );
}

export default Home;
