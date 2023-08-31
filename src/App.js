import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from './components/Menu';
import Quiz from './components/Quiz';
import NoPage from './components/Quiz';
import './App.css';

/*
  Salvar as perguntas erradas em um useState e perguntar se quer responder as perguntas novamente
  Criar componente 404
*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;