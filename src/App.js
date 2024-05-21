import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Homepage/Home';
import Marathons from './Marathons/Marathons';
import Sign from './Photographer/Sign';
import Photographer from './Photographer/Photographer';
import Marathon from "./Marathons/Marathon"

function App() {
  return (
    <div className="App w-full h-[100vh]">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/marathons' element={<Marathons />}></Route>
        <Route path='/login' element={<Sign />}></Route>
        <Route path='/photographer' element={<Photographer />}></Route>
        <Route path='/marathons/:id' element={<Marathon />}></Route>
      </Routes>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
