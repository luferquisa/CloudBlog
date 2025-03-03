import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "./config";

//Pagina para autenticacion
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      const response = await fetch(`http://${config.BACKEND_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al iniciar sesión");
      }

      // Guardar el token en LocalStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_id",data.user_id)
      

    } catch (err) {
      setError(err.message);
    }
    // Redirigir al usuario después del login
    navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión</h2>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white px-4 py-2 rounded py-2 hover:bg-blue-600 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
