import './App.css'
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Documents from './pages/Documents';
import UploadDocument from './pages/UploadDocument.tsx';
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {

    const location = useLocation();


    return (
      <>
          {location.pathname !== '/login' && location.pathname !== '/register' && <Navbar />}
          <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/documents" element={
                  <ProtectedRoute>
                      <Documents />
                  </ProtectedRoute>} />
              <Route path="/documents/upload" element={
                  <ProtectedRoute>
                      <UploadDocument />
                  </ProtectedRoute>} />
          </Routes>
      </>
    )
}

export default App
