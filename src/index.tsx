import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Home from './pages/Home/Home';
import Condominio from './pages/Condominio/Condominio';
import HomeDesktop from './pages/HomeDesktop/HomeDesktop';
import { Analytics } from "@vercel/analytics/react"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/desktop" element={<HomeDesktop />}></Route>
      <Route path="/" element={<Home />}></Route>
      <Route path="/:id/:nombre" element={<Condominio />}></Route>
    </Routes>
    <Analytics/>
  </BrowserRouter>
);
reportWebVitals();
