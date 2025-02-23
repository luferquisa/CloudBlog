import React, { useEffect, useState } from "react";

function Home() {
  const [posts, setPosts] = useState([]);
 
  useEffect(() => {
    fetch("http://104.198.196.96/posts") // Asegúrate de que esta URL coincida con tu API
      .then((response) => response.json())
      .then((data) =>{ 
        console.log("Datos recibidos:", data);
        setPosts(data);})
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to My Blog</h1>
      <p>This is a simple blog application built with React.</p>
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/post/${post.id}`} style={{ textDecoration: "none", color: "blue" }}>
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
