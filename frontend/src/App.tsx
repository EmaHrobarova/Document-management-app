import { useState } from 'react'
import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import DocumentList from './pages/Documents';
import AddDocument from './pages/AddDocument';

function App() {

  return (
   <Routes>
       <Route path="/" element={<Navigate to="/login" />} />
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/documents" element={<DocumentList />} />
       <Route path="/documents/add" element={<AddDocument />} />
   </Routes>
  )
}

export default App
