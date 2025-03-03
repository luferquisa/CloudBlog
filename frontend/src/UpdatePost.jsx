import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { config } from "./config";


//Pagina para actualizar los post
function UpdatePost({ postId }) {
 const { id } = useParams(); // Obtener el ID del post desde la URL
  const [post, setPost] = useState({
    title: "",
    content: "",
    tags: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  // Obtener los datos del post
  useEffect(() => {
    fetch(`http://${config.BACKEND_URL}/posts/${id}`,{
        mode:  'cors',
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Enviar el token en el header
        },
      })
      .then(response => response.json())
      .then(data => {
        setPost({
          title: data.title,
          content: data.content,
          tags: data.tags.map(tag => tag.name).join(", "), // Convertimos los tags en un string separado por comas
        });
        setLoading(false);
      })
      .catch(error => {
        setError("Error al cargar el post.");
        setLoading(false);
      });
  }, [postId]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar actualización al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPost = {
      title: post.title,
      content: post.content,
      tags: post.tags.split(",").map(tag => ({ name: tag.trim() })), // Convertimos el string de tags a un array de objetos
    };

    try {
      const response = await fetch(`http://${config.BACKEND_URL}/posts/postsupdate/${id}`, {
        method: "PUT",
        mode:  'cors',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Enviar el token en el header
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) throw new Error("Error al actualizar el post.");

      setMessage("¡Post actualizado con éxito!");
    } catch (error) {
      setError("No se pudo actualizar el post.");
    }
  };

  if (loading) return <p>Cargando post...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Editar Post</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Título:
          <input type="text" name="title" value={post.title} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Contenido:
          <textarea name="content" value={post.content} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Etiquetas (separadas por coma):
          <input type="text" name="tags" value={post.tags} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Actualizar Post</button>
      </form>
    </div>
  );
}

export default UpdatePost;
