import React from "react";
import { AuthProvider } from "./AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import PostDetail from "./PostDetail";
import CreatePost from "./CreatePost";
import Login from "./Login"
import Register from "./Register"
import UpdatePost from "./UpdatePost";
import TagsList from "./TagList";
import PostsByTag from "./PostByTag";

function App() {
  return ( 
    <AuthProvider>
    <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/post/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />
          <Route path="/post/:id/edit" element={<PrivateRoute><UpdatePost /></PrivateRoute>} /> 
          <Route path="/createpost" element={<PrivateRoute><CreatePost /></PrivateRoute> }/>
          <Route path="/tags" element={<PrivateRoute><TagsList /></PrivateRoute> }/>
          <Route path="/posts-by-tag/:tagId" element={<PostsByTag />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </Router>
    </AuthProvider>
    
  );
}

export default App;
