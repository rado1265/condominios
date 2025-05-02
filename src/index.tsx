import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Home from './pages/Home/Home';
import Condominio from './pages/Condominio/Condominio';
import HomeDesktop from './pages/HomeDesktop/HomeDesktop';
import { Analytics } from "@vercel/analytics/react";
import { isMobile } from 'react-device-detect';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const validateMobile = false;

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/desktop" element={<HomeDesktop />}></Route>
      { !validateMobile || isMobile ?
      <Route path="/" element={<Home />}></Route>
      :
      <Route path="/" element={<HomeDesktop />}></Route>
      }
      <Route path="/:id/:nombre" element={<Condominio />}></Route>
    </Routes>
    <Analytics/>
  </BrowserRouter>
);
reportWebVitals();
