import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddConsumption from "./pages/AddConsumption";
import History from "./pages/History";
import Statistics from "./pages/Statistics";
import Report from "./pages/Report";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            }/>

            <Route path="/add" element={
              <PrivateRoute><AddConsumption /></PrivateRoute>
            }/>

            <Route path="/history" element={
              <PrivateRoute><History /></PrivateRoute>
            }/>

            <Route path="/statistics" element={
              <PrivateRoute><Statistics /></PrivateRoute>
            }/>

            <Route path="/report" element={
              <PrivateRoute><Report /></PrivateRoute>
            }/>

            <Route path="/leaderboard" element={
              <PrivateRoute><Leaderboard /></PrivateRoute>
            }/>
            <Route path="/profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
            }/>

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
