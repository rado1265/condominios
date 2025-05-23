import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Home from './pages/Home/Home';
import Condominio from './pages/Condominio/Condominio';
import HomeDesktop from './pages/HomeDesktop/HomeDesktop';
import { Analytics } from "@vercel/analytics/react";
import { isMobile } from 'react-device-detect';
import Precios from './pages/Precios/Precios';
import { useEffect } from 'react';
import { store } from './store/store';
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const validateMobile = false;

let urlActual = window.location.href;

if (!urlActual.includes("www.") && !urlActual.includes("localhost")) {
  window.location.href = "https://www.conexionresidencial.cl/"
}


window.addEventListener('wheel', function (e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });


window.addEventListener('keydown', function (e) {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
    e.preventDefault();
  }
});
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/desktop" element={<HomeDesktop />}></Route>
        <Route path="/precios" element={<Precios />}></Route>
        {!validateMobile || isMobile ?
          <Route path="/" element={<Condominio />}></Route>
          :
          <Route path="/" element={<HomeDesktop />}></Route>
        }
        <Route path="/:id/:nombre" element={<Condominio />}></Route>
      </Routes>
      <Analytics />
    </BrowserRouter>
  </Provider>
);
reportWebVitals();
