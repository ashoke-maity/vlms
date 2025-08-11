import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../pages/user/Home';
import HomeSimple from '../pages/user/HomeSimple';
import TestComponent from '../components/TestComponent';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestComponent />} />
        <Route path="/simple" element={<HomeSimple />} />
        <Route path="/full" element={<Home />} />
        <Route path="/" element={<HomeSimple />} />
      </Routes>
    </BrowserRouter>
  )
}